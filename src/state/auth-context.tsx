import React, { createContext, Dispatch, useReducer, useContext, useEffect } from 'react';

import { AuthUser, UserInfo } from '../types';
import { auth } from '../firebase/config';
import { snapshotToDoc, usersRef } from '../firebase';

interface Props {}

type FETCH_AUTH_USER = { type: 'FETCH_AUTH_USER'; payload: AuthUser | null };
type OPEN_USER_DROPDOWN = { type: 'OPEN_USER_DROPDOWN'; payload: boolean };
type FETCH_USER_INFO = { type: 'FETCH_USER_INFO'; payload: UserInfo | null };

type AuthActions = FETCH_AUTH_USER | OPEN_USER_DROPDOWN | FETCH_USER_INFO;

type AuthState = {
  authUser: AuthUser | null;
  isUserDropdownOpen: boolean;
  userInfo: UserInfo | null;
};

type AuthDispatch = Dispatch<AuthActions>;

const AuthStateContext = createContext<AuthState | undefined>(undefined);
const AuthDispatchContext = createContext<AuthDispatch | undefined>(undefined);

// Action creators
export const fetchAuthUser = (user: AuthUser | null): FETCH_AUTH_USER => ({
  type: 'FETCH_AUTH_USER',
  payload: user,
});

export const openUserDropdown = (open: boolean): OPEN_USER_DROPDOWN => ({
  type: 'OPEN_USER_DROPDOWN',
  payload: open,
});

export const fetchUserInfo = (userInfo: UserInfo | null): FETCH_USER_INFO => ({
  type: 'FETCH_USER_INFO',
  payload: userInfo,
});

// Reducer function
const authReducer = (state: AuthState, action: AuthActions): AuthState => {
  switch (action.type) {
    case 'FETCH_AUTH_USER':
      return {
        ...state,
        authUser: action.payload,
      };

    case 'OPEN_USER_DROPDOWN':
      return {
        ...state,
        isUserDropdownOpen: action.payload,
      };

    case 'FETCH_USER_INFO':
      return {
        ...state,
        userInfo: action.payload,
      };

    default:
      return state;
  }
};

const initialState: AuthState = {
  authUser: null,
  isUserDropdownOpen: false,
  userInfo: null,
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

  // Listen to user document changed in firestore
  useEffect(() => {
    if (!authState.authUser) return authDispatch(fetchUserInfo(null))

    const unsubscribe = usersRef.doc(authState.authUser.uid).onSnapshot({
      next: (doc) => {
        if (!doc.exists) return authDispatch(fetchUserInfo(null))

        const userInfo = snapshotToDoc<UserInfo>(doc)
        authDispatch(fetchUserInfo(userInfo))
      },
      error: () => authDispatch(fetchUserInfo(null)),
    })

    return () => unsubscribe()
  }, [authState.authUser])

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
