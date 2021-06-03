import React from 'react';
import { isAdmin, isClient } from '../../helpers';
import { useAuthenticate } from '../../hooks/useAuthenticate';
import {
  openUserDropdown,
  useAuthContext,
  signoutRedirect,
} from '../../state/auth-context';
import { useViewContext } from '../../state/view-context';
import Button from '../Button';
import AdminDropdown from './AdminDropdown';
import ClientDropdown from './ClientDropdown';

interface Props {}

const Sidebar: React.FC<Props> = () => {
  const { authState, authDispatch } = useAuthContext();
  const { authUser, userInfo } = authState;
  const { signout } = useAuthenticate();
  const { viewMode } = useViewContext();
  const handleSignout = () => {
    signout();
    authDispatch(signoutRedirect(true));
  };

  return (
    <div className="page page--sidebar">
      <div className="sidebar sidebar-show">
        <div className="sidebar__section">
          <div className="sidebar__section sidebar__section--profile">
            <h3 className="header--center header--sidebar">{authUser?.displayName}</h3>
            <h3 className="header--center header--sidebar">{authUser?.email}</h3>
          </div>
        </div>

        {/* Admin user */}
        {userInfo && isAdmin(userInfo?.role) && <AdminDropdown />}

        {/* Client user */}
        {userInfo &&
          (isClient(userInfo?.role) ||
            (isAdmin(userInfo?.role) && viewMode === 'client')) && <ClientDropdown />}

        {/* Logout */}
        <div className="sidebar__section">
          <Button className="btn--sidebar-signout" onClick={() => handleSignout()}>
            SIGN OUT
          </Button>
        </div>

        {/* Close sidebar */}
        <div className="sidebar__section">
          <Button
            className="sidebar__close"
            onClick={() => authDispatch(openUserDropdown(false))}
          >
            &times;
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
