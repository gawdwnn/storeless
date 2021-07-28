import { useAsyncCall } from "./useAsyncCall";
import { Address, UserInfo } from "../types";
import { firebase } from "../firebase/config";
import { usersRef } from "../firebase";

export const useManageShippingAddress = () => {
  const { loading, setLoading, error, setError } = useAsyncCall();

  const addNewAddress = async (data: Omit<Address, "index">, userInfo: UserInfo) => {
    try {
      setLoading(true);

      const updatedUserInfo = {
        shippingAddresses: userInfo.shippingAddresses
          ? [...userInfo.shippingAddresses, data]
          : [data],
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      // Update the user document in the users collection in firestore
      await usersRef.doc(userInfo.id).set(updatedUserInfo, { merge: true });
      setLoading(false);

      return true;
    } catch (error) {
      const { message } = error as { message: string };

      setError(message);
      setLoading(false);

      return false;
    }
  };

  const editAddress = async (
    data: Omit<Address, "index">,
    index: number,
    userInfo: UserInfo
  ) => {
    try {
      if (!userInfo.shippingAddresses) {
        setError("Sorry cannot edit the shipping address.");
        return false;
      }

      setLoading(true);

      // The current shipping addresses array
      const currentShippingAddresses = userInfo.shippingAddresses;

      // Update the shipping address
      currentShippingAddresses[index] = data;

      // An updated user info
      const updatedUserInfo = {
        shippingAddresses: currentShippingAddresses,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      // Update the user document in firestore
      await usersRef.doc(userInfo.id).set(updatedUserInfo, { merge: true });
      setLoading(false);

      return true;
    } catch (err) {
      const { message } = err as { message: string };

      setError(message);
      setLoading(false);

      return false;
    }
  };

  const deleteAddress = async (index: number, userInfo: UserInfo) => {
    try {
      if (!userInfo.shippingAddresses || userInfo.shippingAddresses.length === 0) {
        setError("Sorry, something went wrong.");
        return false;
      }

      setLoading(true);

      // An updated user info
      const updatedUserInfo = {
        shippingAddresses: userInfo.shippingAddresses.filter((_, i) => i !== index),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      // Update the user document in firestore
      await usersRef.doc(userInfo.id).set(updatedUserInfo, { merge: true });
      setLoading(false);

      return true;
    } catch (err) {
      const { message } = err as { message: string };

      setError(message);
      setLoading(false);

      return false;
    }
  };

  return { addNewAddress, editAddress, deleteAddress, loading, error };
};
