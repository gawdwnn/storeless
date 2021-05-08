import React from 'react';
import { NavLink } from 'react-router-dom';

interface Props {}

const Navbar: React.FC<Props> = () => {
  return (
    <div className="head">
      <div className="head__section">
        <div className="head__logo">
          <NavLink to="/">
            <h2 className="header header--logo">Storeless</h2>
          </NavLink>
        </div>
        <NavLink to="/" className="list-link">
          Home
        </NavLink>
        <NavLink to="/products" className="list-link">
          Products
        </NavLink>
        <NavLink to="/buy/my-cart" className="list-link">
          Cart
        </NavLink>
        <NavLink to="/buy/select-address" className="list-link">
          Select Address
        </NavLink>
        <NavLink to="/buy/checkout" className="list-link">
          Checkout
        </NavLink>
        <NavLink to="/orders/my-orders" className="list-link">
          Orders
        </NavLink>
        <NavLink to="/admin/manage-products" className="list-link">
          Manage Products
        </NavLink>
        <NavLink to="/admin/manage-orders" className="list-link">
          Manage Orders
        </NavLink>
        <NavLink to="/admin/manage-users" className="list-link">
          Manage Users
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
