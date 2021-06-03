import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import OrderDetail from '../pages/OrderDetail';
import Orders from '../pages/Orders';
import PageNotFound from '../pages/PageNotFound';
import { UserInfo } from '../types';
import { isClient } from '../helpers';

interface Props {}

const OrderRoutes: React.FC<Props> = (props) => {
  const { userInfo } = props as { userInfo: UserInfo };

  if (!isClient(userInfo.role)) return <Redirect to="/" />;

  return (
    <Switch>
      <Route path="/orders/my-orders/:id">
        <OrderDetail />
      </Route>
      <Route path="/orders/my-orders">
        <Orders />
      </Route>
      <Route path="*">
        <PageNotFound />
      </Route>
    </Switch>
  );
};

export default OrderRoutes;
