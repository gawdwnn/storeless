import React from 'react';
import { Route, Switch } from 'react-router';
import Index from '../pages/Index';
import PageNotFound from '../pages/PageNotFound';
import ProductDetail from '../pages/ProductDetail';
import Products from '../pages/Products';
import AdminRoutes from './AdminRoutes';
import BuyRoutes from './BuyRoutes';
import OrderRoutes from './OrderRoutes';

interface Props {}

const Routes: React.FC<Props> = () => {
  return (
    <Switch>
      <Route exact path="/" component={Index} />
      <Route exact path="/products" component={Products} />
      <Route exact path="/products/:id" component={ProductDetail} />
      <Route path="/buy" component={BuyRoutes} />
      <Route path="/orders" component={OrderRoutes} />
      <Route path="/admin" component={AdminRoutes} />
      <Route path="*" component={PageNotFound} />
    </Switch>
  );
};

export default Routes;
