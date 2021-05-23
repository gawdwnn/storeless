import React, { createContext, Dispatch, useReducer, useContext, useEffect } from 'react';

import { AuthUser } from '../types';
import { auth } from '../firebase/config';

interface Props {}

type FETCH_AUTH_USER = { type: 'FETCH_AUTH_USER'; payload: AuthUser | null };

type AuthActions = FETCH_AUTH_USER;

type AuthState = {
  authUser: AuthUser | null;
};

type AuthDispatch = Dispatch<AuthActions>;

const AuthStateContext = createContext<AuthState | undefined>(undefined);
const AuthDispatchContext = createContext<AuthDispatch | undefined>(undefined);

// Action creators
export const fetchAuthUser = (user: AuthUser | null): FETCH_AUTH_USER => ({
  type: 'FETCH_AUTH_USER',
  payload: user,
});

// Reducer function
const authReducer = (state: AuthState, action: AuthActions): AuthState => {
  switch (action.type) {
    case 'FETCH_AUTH_USER':
      return {
        ...state,
        authUser: action.payload,
      };

    default:
      return state;
  }
};

const initialState: AuthState = {
  authUser: null,
};

const AuthContextProvider: React.FC<Props> = ({ children }) => {
  const [authState, authDispatch] = useReducer(authReducer, initialState);

  // Listen to auth state change in firebase authentication
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        authDispatch(fetchAuthUser(user));
      } else {
        authDispatch(fetchAuthUser(null));
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthStateContext.Provider value={authState}>
      <AuthDispatchContext.Provider value={authDispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthContext = () => {
  const authState = useContext(AuthStateContext);
  const authDispatch = useContext(AuthDispatchContext);

  if (authState === undefined || authDispatch === undefined)
    throw new Error('useAuthContext must be used within AuthContextProvider.');

  return { authState, authDispatch };
};
