import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DialogWrapper from "./DialogWrapper";
import Button from "../Button";
import { Product } from "../../types";

interface Props {
  header: string;
  cartItemData: {
    product: Product;
    quantity: number;
  } | null;
  goToCart: () => void;
  continueShopping: () => void;
}

const ConfirmAddToCartDialog: React.FC<Props> = ({
  header,
  cartItemData,
  goToCart,
  continueShopping,
}) => {
  return (
    <DialogWrapper header={header}>
      <div className="dialog-body">
        <div className="dialog-body__cart-info">
          <FontAwesomeIcon icon={["fas", "check-circle"]} size="lg" color="green" />

          <img
            src={cartItemData?.product.imageUrl}
            alt={cartItemData?.product.title}
            width="30px"
          />

          <p className="paragraph">{cartItemData?.product.title}</p>

          <p className="paragraph">{cartItemData?.quantity}</p>

          <Button onClick={goToCart}>Go to cart</Button>
        </div>

        <Button width="13rem" className="btn--orange" onClick={continueShopping}>
          Continue shopping
        </Button>
      </div>
    </DialogWrapper>
  );
};

export default ConfirmAddToCartDialog;
