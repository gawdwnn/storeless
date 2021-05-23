import React from 'react';
import { NavLink } from 'react-router-dom';

import { useAuthContext } from '../../state/auth-context';
import Button from '../Button';
import LoggedInNav from './LoggedInNav';
import LoggedOutNav from './LoggedOutNav';

interface Props {}

const MainNav: React.FC<Props> = () => {
  const {
    authState: { authUser },
  } = useAuthContext();

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
          {!authUser ? <LoggedOutNav /> : <LoggedInNav />}
        </div>
      </div>
    </div>
  );
};

export default MainNav;
