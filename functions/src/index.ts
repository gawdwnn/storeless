import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const env = functions.config();

export const onSignup = functions.https.onCall(async (data, context) => {
  try {
    const {username} = data as { username: string };

    if (!context.auth?.uid) return;

    await admin.auth().setCustomUserClaims(context.auth.uid, {
      role: context.auth.token.email === env.admin.super_admin ? 'SUPER_ADMIN' : 'CLIENT',
    });

    const result = await admin
        .firestore()
        .collection('users')
        .doc(context.auth?.uid)
        .set({
          username,
          email: context.auth.token.email,
          role: context.auth.token.email === env.admin.super_admin ? 'SUPER_ADMIN' : 'CLIENT',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

    if (!result) return;
    return {message: 'User created'};
  } catch (error) {
    throw error;
  }
});
