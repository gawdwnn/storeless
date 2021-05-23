import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import MainNav from './components/nav/MainNav';
import UserDropdown from './components/nav/UserDropdown';
import { openUserDropdown, useAuthContext } from './state/auth-context';
import { useModalContext } from './state/modal-context';

interface Props {}

const Layout: React.FC<Props> = ({ children }) => {
  const { modal } = useModalContext();
  const {
    authState: { isUserDropdownOpen },
    authDispatch,
  } = useAuthContext();
  const { pathname } = useLocation();

  useEffect(() => {
    if (isUserDropdownOpen) authDispatch(openUserDropdown(false));
  }, [pathname]);

  return (
    <div>
      <MainNav />
      {isUserDropdownOpen && <UserDropdown />}

      <div className="page">{children}</div>
      {modal && modal}
    </div>
  );
};

export default Layout;
