import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthContext } from '../../state/auth-context';
import { useModalContext } from '../../state/modal-context';
import Button from '../Button';

interface Props {}

const Navbar: React.FC<Props> = () => {
  const { authState } = useAuthContext();
  console.log("🚀 ~ file: Navbar.tsx ~ line 11 ~ authState", authState)
  const { setModalType } = useModalContext();

  return (
    <div className="head">
      <div className="head__section">
        <div className="head__logo">
          <NavLink to="/">
            <h2 className="header header--logo">Storeless</h2>
          </NavLink>
        </div>

        <div className="head__search">
          <div className="search-input">
            <input type="text" className="search" placeholder="Search" />
          </div>
          <Button>Search</Button>
        </div>

        <div className="head__navbar">
          <ul className="navbar">
            <div className="navbar__lists"></div>
            <div className="navbar__profile">
              <Button className="btn--sign">Sign in</Button>
              <Button className="btn--sign" onClick={() => setModalType('signup')}>
                Sign up
              </Button>
            </div>
          </ul>
        </div>

        {/* <NavLink to="/products" className="list-link">
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
        </NavLink> */}
      </div>
    </div>
  );
};

export default Navbar;
