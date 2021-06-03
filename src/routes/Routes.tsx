import React from 'react';
import { Route, Switch } from 'react-router';
import Index from '../pages/Index';
import PageNotFound from '../pages/PageNotFound';
import ProductDetail from '../pages/ProductDetail';
import Products from '../pages/Products';
import AdminRoutes from './AdminRoutes';
import BuyRoutes from './BuyRoutes';
import OrderRoutes from './OrderRoutes';
import PrivateRoute from './PrivateRoute';

interface Props {}

const Routes: React.FC<Props> = () => {
  return (
    <Switch>
      <Route path='/buy'>
        <PrivateRoute>
          <BuyRoutes />
        </PrivateRoute>
      </Route>
      <Route path='/orders'>
        <PrivateRoute>
          <OrderRoutes />
        </PrivateRoute>
      </Route>
      <Route path='/admin'>
        <PrivateRoute>
          <AdminRoutes />
        </PrivateRoute>
      </Route>
      <Route path='/products/:productId'>
        <ProductDetail />
      </Route>
      <Route path='/products'>
        <Products />
      </Route>
      <Route path='/'>
        <Index />
      </Route>
      <Route path='*'>
        <PageNotFound />
      </Route>
    </Switch>
  );
};

export default Routes;
