import React from 'react';
import Navbar from './components/nav/Navbar';
import { useModalContext } from './state/modal-context';

interface Props {}

const Layout: React.FC<Props> = ({ children }) => {
  const { modal } = useModalContext();
  return (
    <div>
      <Navbar />
      <div className="page">{children}</div>
      {modal && modal}
    </div>
  );
};

export default Layout;
