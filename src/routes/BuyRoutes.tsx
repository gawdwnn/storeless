import React from 'react';
import { Route, Switch } from 'react-router';
import Checkout from '../pages/Checkout';
import MyCart from '../pages/MyCart';
import PageNotFound from '../pages/PageNotFound';
import SelectAddress from '../pages/SelectAddress';

interface Props {}

const BuyRoutes: React.FC<Props> = () => {
  return (
    <Switch>
      <Route exact path="/buy/my-cart" component={MyCart} />
      <Route exact path="/buy/select-address" component={SelectAddress} />
      <Route exact path="/buy/checkout" component={Checkout} />
      <Route exact path="*" component={PageNotFound} />
    </Switch>
  );
};

export default BuyRoutes;
