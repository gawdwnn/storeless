import React, { useEffect, useRef, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PaymentMethod, StripeCardElementChangeEvent } from "@stripe/stripe-js";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useForm } from "react-hook-form";

import {
  Address,
  CartItem,
  CreatePaymentIntentData,
  CreatePaymentMethod,
} from "../types";
import { useAuthContext } from "../state/auth-context";
import { useCartContext } from "../state/cart-context";
import { useDialog } from "../hooks/useDialog";
import { calculateCartQuantity, calculateCartAmount } from "../helpers";
import Spinner from "../components/Spinner";
import Button from "../components/Button";
import { address_key } from "./../components/select-address/ShippingAddress";
import { useCheckout } from "../hooks/useCheckout";
import { useFetchCards } from "../hooks/useFetchCards";

interface Props {}

const Checkout: React.FC<Props> = () => {
  const history = useHistory();
  const [orderSummary, setOrderSummary] = useState<{
    quantity: number;
    amount: number;
    orderItems: CartItem[];
  }>();

  const [address, setAddress] = useState<Address | null>(null);
  const [loadAddress, setLoadAddress] = useState(true);

  const [useCard, setUseCard] = useState<
    { type: "new" } | { type: "saved"; payment_method: string }
  >({ type: "new" });
  const [disabled, setDisabled] = useState(true);
  const [newCardError, setNewCardError] = useState("");
  const [openSetDefault, setOpenSetDefault] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<PaymentMethod | null>(null);
  const [dialogType, setDialogType] = useState<"inform_payment" | "remove_card" | null>(
    null
  );

  const elements = useElements();
  const stripe = useStripe();

  const { openDialog, setOpenDialog } = useDialog();
  const { cart } = useCartContext();
  const {
    authState: { userInfo },
  } = useAuthContext();
  const { completePayment, createStripeCustomerId, loading, error } = useCheckout();
  const {
    userCards,
    stripeCustomer,
    setUserCards,
    loading: fetchCardsLoading,
    error: fetchCardsError,
  } = useFetchCards(userInfo);

  const btnRef = useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    cardName: string;
    save?: boolean;
    setDefault?: boolean;
  }>();

  useEffect(() => {
    const addressData = window.localStorage.getItem(address_key);

    if (!addressData) {
      setLoadAddress(false);
      return;
    }

    const address = JSON.parse(addressData);
    setAddress(address);
    setLoadAddress(false);
  }, [setAddress, setLoadAddress]);

  useEffect(() => {
    if (cart && cart.length > 0)
      setOrderSummary({
        quantity: calculateCartQuantity(cart),
        amount: calculateCartAmount(cart),
        orderItems: cart,
      });
  }, [cart]);

  const handleClickBtn = () => {
    if (btnRef && btnRef.current) btnRef.current.click();
  };

  const handleCardChange = (e: StripeCardElementChangeEvent) => {};

  const handleCompletePayment = handleSubmit(async (data) => {
    if (!elements || !orderSummary || !stripe || !userInfo || !address) return;

    if (useCard.type === "new") {
      // A. New Card
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      if (typeof data.save === "boolean") {
        // A.1 New card, not save
        // 1. Prepare a create payemnt intent data to get a client secret
        const createPaymentIntentData: CreatePaymentIntentData = {
          amount: orderSummary.amount,
        };

        // 2. Prepare a payment method to complete the payment
        const payment_method: CreatePaymentMethod = {
          card: cardElement,
          billing_details: { name: data.cardName },
        };

        if (data.save) {
          // A.2 New card, save
          if (!userInfo.stripeCustomerId) {
            // 1. User doesn't have a stripe customer id yet, create a new stripe customer.
            const stripeCustomerId: any = await createStripeCustomerId();

            createPaymentIntentData.customer = stripeCustomerId;
          } else {
            // 2. User already has, use the existing one
            createPaymentIntentData.customer = userInfo.stripeCustomerId;
          }
        }

        const finished = await completePayment(
          { createPaymentIntentData, stripe, payment_method },
          {
            save: data.save,
            setDefault: data.setDefault,
            customerId: createPaymentIntentData.customer,
          }
          // newOrder,
          // orderItems
        );

        if (finished) {
          setOpenDialog(true);
          setDialogType("inform_payment");
          reset();
        }
      }
    } else if (useCard.type === "saved" && useCard.payment_method) {
      // B. Saved Card
      // 1. Prepare a create payemnt intent data to get a client secret
      const createPaymentIntentData: CreatePaymentIntentData = {
        amount: orderSummary.amount,
        // customer: stripeCustomer?.id,
        payment_method: useCard.payment_method,
      };

      // 2. Prepare a payment method to complete the payment
      const payment_method: CreatePaymentMethod = useCard.payment_method;

      const finished = await completePayment(
        { createPaymentIntentData, stripe, payment_method },
        {
          save: data.save,
          setDefault: data.setDefault,
          // customerId: stripeCustomer?.id,
        }
        // newOrder,
        // orderItems
      );

      if (finished) {
        setOpenDialog(true);
        setDialogType("inform_payment");
        reset();
      }
    }
  });

  if (loadAddress) return <Spinner color="grey" height={50} width={50} />;

  if (!address) return <Redirect to="/buy/select-address" />;

  const { fullname, address1, address2, city, zipCode, phone } = address;

  return (
    <div className="page--checkout">
      <div className="payment">
        <h2 className="header">Select a payment card</h2>
        <form className="form" onSubmit={handleCompletePayment}>
          {/* Saved Cards */}
          {fetchCardsLoading ? (
            <Spinner color="grey" height={30} width={30} />
          ) : (
            userCards?.data &&
            userCards.data.length > 0 &&
            userCards.data.map((method) => {
              console.log(userCards);
              return (
                <label key={method.id} className="card" htmlFor={method.id}>
                  <input
                    type="radio"
                    name="card"
                    value={method.id}
                    style={{ width: "10%" }}
                    checked={
                      useCard.type === "saved" && useCard.payment_method === method.id
                    }
                    onChange={() => {
                      setUseCard({ type: "saved", payment_method: method.id });
                      setDisabled(false);
                      reset();
                    }}
                  />

                  <p className="paragraph" style={{ width: "40%" }}>
                    **** **** **** {method.card?.last4}
                  </p>

                  <p className="paragraph" style={{ width: "10%" }}>
                    {method.card?.brand === "visa" ? (
                      <FontAwesomeIcon
                        icon={["fab", "cc-visa"]}
                        size="2x"
                        color="#206CAB"
                      />
                    ) : method.card?.brand === "mastercard" ? (
                      <FontAwesomeIcon
                        icon={["fab", "cc-mastercard"]}
                        size="2x"
                        color="#EB2230"
                      />
                    ) : method.card?.brand === "amex" ? (
                      <FontAwesomeIcon
                        icon={["fab", "cc-amex"]}
                        size="2x"
                        color="#099DD9"
                      />
                    ) : (
                      method.card?.brand
                    )}
                  </p>

                  <div style={{ width: "30%" }}>
                    {method.id ===
                    stripeCustomer?.invoice_settings.default_payment_method ? (
                      <p className="paragraph--center paragraph--focus">Default</p>
                    ) : useCard.type === "saved" &&
                      useCard.payment_method === method.id ? (
                      <div>
                        <input type="checkbox" {...register("setDefault")} />
                        <label htmlFor="setDefault" className="set-default-card">
                          Set as default
                        </label>
                      </div>
                    ) : undefined}
                  </div>

                  <p
                    className="paragraph"
                    style={{ width: "10%", cursor: "pointer" }}
                    onClick={() => {
                      setCardToDelete(method);
                      setOpenDialog(true);
                      setDialogType("remove_card");
                    }}
                  >
                    <FontAwesomeIcon icon={["fas", "trash-alt"]} size="1x" color="red" />
                  </p>
                </label>
              );
            })
          )}
        </form>
      </div>

      <div className="summary">
        {/* Shipping Address */}
        <div className="summary__section">
          <h3 className="header">Delivery address</h3>

          <p className="paragraph paragraph--focus">{fullname}:</p>
          <p className="paragraph paragraph--focus">{address1}</p>
          {address2 && <p className="paragraph paragraph--focus">{address2}</p>}
          <p className="paragraph paragraph--focus">
            {city}, {zipCode}
          </p>
          <p className="paragraph paragraph--focus">Tel: {phone}</p>
        </div>

        {/* Order summary */}
        <div className="summary__section">
          <h3 className="header">Order summary</h3>

          <div className="order-summary">
            <div>
              <p className="paragraph paragraph--focus">Total quantity:</p>
              <p className="paragraph paragraph--focus">Total amount:</p>
            </div>
            <div>
              <p className="paragraph paragraph--focus">
                {orderSummary && orderSummary.quantity} pcs
              </p>
              <p className="paragraph paragraph--focus">
                ${orderSummary && orderSummary.amount}
              </p>
            </div>
          </div>
        </div>

        <div className="summary__section">
          <Button
            width="100%"
            className="btn--orange btn--payment"
            onClick={handleClickBtn}
            disabled={!stripe || !useCard || disabled || loading}
            loading={loading}
          >
            Complete payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
