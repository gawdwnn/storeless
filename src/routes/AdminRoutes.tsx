import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { isAdmin } from '../helpers';
import ManageOrderDetail from '../pages/ManageOrderDetail';
import ManageOrders from '../pages/ManageOrders';
import ManageProducts from '../pages/ManageProducts';
import ManageUsers from '../pages/ManageUsers';
import PageNotFound from '../pages/PageNotFound';
import { UserInfo } from '../types';

interface Props {}

const AdminRoutes: React.FC<Props> = (props) => {
  const { userInfo } = props as { userInfo: UserInfo };

  if (!isAdmin(userInfo?.role)) return <Redirect to="buy/my-cart" />;

  return (
    <Switch>
      <Route path="/admin/manage-products">
        <ManageProducts />
      </Route>
      <Route path="/admin/manage-orders/:id">
        <ManageOrderDetail />
      </Route>
      <Route path="/admin/manage-orders">
        <ManageOrders />
      </Route>
      <Route path="/admin/manage-users">
        <ManageUsers />
      </Route>
      <Route path="*">
        <PageNotFound />
      </Route>
    </Switch>
  );
};

export default AdminRoutes;
