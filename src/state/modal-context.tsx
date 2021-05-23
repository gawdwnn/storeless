import React, {
  createContext,
  ReactElement,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useContext,
} from 'react';
import ResetPassword from '../components/auth/ResetPassword';
import Signin from '../components/auth/Signin';
import Signup from '../components/auth/Signup';

interface Props {}

type ModalType = 'close' | 'signup' | 'signin' | 'reset_password';

type Modals = {
  [key in ModalType]: ReactElement | null;
};

type ModalState = {
  modal: ReactElement | null;
  setModalType: Dispatch<SetStateAction<ModalType>>;
};

const ModalContext = createContext<ModalState | undefined>(undefined);

const modals: Modals = {
  close: null,
  signup: <Signup />,
  signin: <Signin />,
  reset_password: <ResetPassword />,
};

const ModalContextProvider: React.FC<Props> = ({ children }) => {
  const [modal, setModal] = useState<ReactElement | null>(null);
  const [modalType, setModalType] = useState<ModalType>('close');

  useEffect(() => {
    setModal(modals[modalType]);
  }, [modalType]);

  return (
    <ModalContext.Provider value={{ modal, setModalType }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContextProvider;

export const useModalContext = () => {
  const context = useContext(ModalContext);

  if (context === undefined)
    throw new Error('useModalContext must be used within the ModalContextProvider.');

  return context;
};
