import React from 'react';
import { useAuthenticate } from '../../hooks/useAuthenticate';
import { openUserDropdown, useAuthContext } from '../../state/auth-context';
import Button from '../Button';
// import AdminDropdown from './AdminDropdown';
import ClientDropdown from './ClientDropdown';

interface Props {}

const Sidebar: React.FC<Props> = () => {
  const {
    authState: { authUser },
    authDispatch,
  } = useAuthContext()
  const { signout } = useAuthenticate();

  return (
    <div className="page page--sidebar">
      <div className="sidebar sidebar-show">
        <div className="sidebar__section">
          <div className="sidebar__section sidebar__section--profile">
            <h3 className="header--center header--sidebar">{authUser?.displayName}</h3>
            <h3 className="header--center header--sidebar">{authUser?.email}</h3>
          </div>
        </div>

        {/* Client User */}
        <ClientDropdown />

        {/* Admin User */}
        {/* <AdminDropdown /> */}

        {/* Logout */}
        <div className='sidebar__section'>
          <Button
            className='btn--sidebar-signout'
            onClick={() => {
              signout()
              // authDispatch(signoutRedirect(true))
            }}
          >
            SIGN OUT
          </Button>
        </div>

        {/* Close sidebar */}
        <div className='sidebar__section'>
          <Button
            className='sidebar__close'
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
