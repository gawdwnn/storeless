import { useAsyncCall } from './useAsyncCall';
import { Provider, SignupData } from '../types';
import { auth, functions, firebase } from '../firebase/config';
import { openUserDropdown, useAuthContext } from '../state/auth-context';

export const useAuthenticate = () => {
  const { authState, authDispatch } = useAuthContext();
  const { isUserDropdownOpen } = authState;
  const { loading, setLoading, error, setError, successMsg, setSuccessMsg } =
    useAsyncCall();

  const signup = async (data: SignupData) => {
    const { username, email, password } = data;

    try {
      setLoading(true);

      const response = await auth.createUserWithEmailAndPassword(email, password);

      if (!response) {
        setError('Sorry, something went wrong.');
        setLoading(false);
        return;
      }

      // Update the user displayname in firebase authentication
      await auth.currentUser?.updateProfile({
        displayName: username,
      });

      // Call onSignup functions to create a new user in firestore
      const onSignup = functions.httpsCallable('onSignup');

      const data = await onSignup({ username });

      setLoading(false);

      return data;
    } catch (err) {
      const { message } = err as { message: string };

      setError(message);
      setLoading(false);
    }
  };

  const signout = () => {
    auth
      .signOut()
      .then(() => {
        if (isUserDropdownOpen) authDispatch(openUserDropdown(false));
      })
      .catch((err) => alert('Soryy, something went wrong.'));
  };

  const signin = async (data: Omit<SignupData, 'username'>) => {
    const { email, password } = data;

    try {
      setLoading(true);

      const response = await auth.signInWithEmailAndPassword(email, password);

      if (!response) {
        setError('Sorry, something went wrong.');
        setLoading(false);
        return;
      }

      setLoading(false);

      return response;
    } catch (err) {
      const { message } = err as { message: string };

      setError(message);
      setLoading(false);
    }
  };

  const resetPassword = (data: Omit<SignupData, 'username' | 'password'>) => {
    setLoading(true);

    auth
      .sendPasswordResetEmail(data.email)
      .then(() => {
        setSuccessMsg('Please check your email to reset your password.');
        setLoading(false);
      })
      .catch((err) => {
        const { message } = err as { message: string };

        setError(message);
        setLoading(false);
      });
  };

  const socialLogin = async (provider: Provider) => {
    try {
      setLoading(true);

      const providerObj =
        provider === 'facebook'
          ? new firebase.auth.FacebookAuthProvider()
          : provider === 'google'
          ? new firebase.auth.GoogleAuthProvider()
          : null;

      if (!providerObj) return;

      const response = await auth.signInWithPopup(providerObj);

      if (!response) {
        setError('Sorry, something went wrong.');
        setLoading(false);
        return;
      }

      // Call onSignup functions to create a new user in firestore
      const onSignup = functions.httpsCallable('onSignup');

      const data = await onSignup({ username: response.user?.displayName });

      setLoading(false);

      return data;
    } catch (err) {
      const { message } = err as { message: string };

      setError(message);
      setLoading(false);
    }
  };

  return {
    signup,
    signin,
    signout,
    resetPassword,
    socialLogin,
    loading,
    error,
    successMsg,
  };
};
