import React from 'react';
import { Route, Switch } from 'react-router';
import OrderDetail from '../pages/OrderDetail';
import Orders from '../pages/Orders';
import PageNotFound from '../pages/PageNotFound';

interface Props {}

const OrderRoutes: React.FC<Props> = () => {
  return (
    <Switch>
      <Route exact path="/orders/my-orders" component={Orders} />
      <Route exact path="/orders/my-orders/:id" component={OrderDetail} />
      <Route exact path="*" component={PageNotFound} />
    </Switch>
  );
};

export default OrderRoutes;
