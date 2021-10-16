import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { isClient } from '../helpers';
import Checkout from '../pages/Checkout';
import MyCart from '../pages/MyCart';
import PageNotFound from '../pages/PageNotFound';
import SelectAddress from '../pages/SelectAddress';
import { UserInfo } from '../types';

interface Props {}

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

const BuyRoutes: React.FC<Props> = (props) => {
  const { userInfo } = props as { userInfo: UserInfo };

  if (!isClient(userInfo.role)) return <Redirect to="/" />;

  return (
    <Elements stripe={stripePromise}>
      <Switch>
        <Route path="/buy/my-cart">
          <MyCart />
        </Route>
        <Route path="/buy/select-address">
          <SelectAddress />
        </Route>
        <Route path="/buy/checkout">
          <Checkout />
        </Route>
        <Route path="*">
          <PageNotFound />
        </Route>
      </Switch>
    </Elements>
  );
};

export default BuyRoutes;
