import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAuthContext, openUserDropdown } from '../../state/auth-context';

interface Props {}

const LoggedInNav: React.FC<Props> = () => {
  const { authDispatch } = useAuthContext();

  return (
    <ul className="navbar">
      <div className="navbar__lists">
        <li className="list list--cart">
          <NavLink to="/buy/my-cart">
            <FontAwesomeIcon icon={['fas', 'cart-arrow-down']} color="white" size="lg" />
          </NavLink>
          <div className="cart-qty">0</div>
        </li>
      </div>

      <div className="navbar__profile">
        <div className="profile">
          <FontAwesomeIcon
            icon={['fas', 'user-circle']}
            color="white"
            size="2x"
            onClick={() => authDispatch(openUserDropdown(true))}
          />
        </div>
      </div>
    </ul>
  );
};

export default LoggedInNav;
