import { firebase } from '../firebase/config';

export type AuthUser = firebase.User;

export type SignupData = {
  username: string;
  email: string;
  password: string;
};

export type Role = 'SUPER_ADMIN' | 'CLIENT' | 'ADMIN';
export type Address = {
  index?: number;
  fullname: string;
  address1: string;
  address2?: string;
  city: string;
  zipCode: string;
  phone: string;
};

export type UserInfo = {
  id: string;
  username: string;
  email: string;
  role: Role;
  createdAt: firebase.firestore.Timestamp;
  shippingAddresses?: Address[];
  stripeCustomerId?: string;
  updatedAt?: firebase.firestore.Timestamp;
};
