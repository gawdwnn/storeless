import { UserInfo } from '../types';
import { db, firebase } from './config';

export const usersRef = db.collection('users');

export const snapshotToDoc = <T extends UserInfo>(
  doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>,
) => {
  const docData = doc.data() as T;
  const docObject: T = {
    ...docData,
    id: doc.id,
  };

  return docObject;
};
