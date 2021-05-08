import React from 'react';
import { Route, Switch } from 'react-router';
import ManageOrderDetail from '../pages/ManageOrderDetail';
import ManageOrders from '../pages/ManageOrders';
import ManageProducts from '../pages/ManageProducts';
import ManageUsers from '../pages/ManageUsers';
import PageNotFound from '../pages/PageNotFound';

interface Props {}

const AdminRoutes: React.FC<Props> = () => {
  return (
    <Switch>
      <Route exact path="/admin/manage-products" component={ManageProducts} />
      <Route exact path="/admin/manage-orders/:id" component={ManageOrderDetail} />
      <Route exact path="/admin/manage-orders" component={ManageOrders} />
      <Route exact path="/admin/manage-users" component={ManageUsers} />
      <Route exact path="*" component={PageNotFound} />
    </Switch>
  );
};

export default AdminRoutes;
