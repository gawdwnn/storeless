import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { isClient } from '../helpers';
import Checkout from '../pages/Checkout';
import MyCart from '../pages/MyCart';
import PageNotFound from '../pages/PageNotFound';
import SelectAddress from '../pages/SelectAddress';
import { UserInfo } from '../types';

interface Props {}

const BuyRoutes: React.FC<Props> = (props) => {
  const { userInfo } = props as { userInfo: UserInfo };

  if (!isClient(userInfo.role)) return <Redirect to="/" />;

  return (
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
  );
};

export default BuyRoutes;
