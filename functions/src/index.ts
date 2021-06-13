import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const env = functions.config();
const productsCollection = 'products';
const productCountsCollection = 'product-counts';
const productCountsDocument = 'counts';

type ProductCategory = 'Clothing' | 'Shoes' | 'Watches' | 'Accessories';

type Counts = {
  [key in 'All' | ProductCategory]: number;
};

type Product = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageRef: string;
  imageFileName: string;
  price: number;
  category: ProductCategory;
  inventory: number;
  creator: string;
};

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
          role:
          context.auth.token.email === env.admin.super_admin ? 'SUPER_ADMIN' : 'CLIENT',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

    if (!result) return;
    return {message: 'User created'};
  } catch (error) {
    throw error;
  }
});

export const onProductCreated = functions.firestore
    .document(`${productsCollection}/{productId}`)
    .onCreate(async (snapshot, context) => {
      const product = snapshot.data() as Product;

      let counts: Counts;

      // Query the product-counts collection
      const countsData = await admin
          .firestore()
          .collection(productCountsCollection)
          .doc(productCountsDocument)
          .get();

      if (!countsData.exists) {
      // First product item

        // Construct the counts object
        counts = {
          All: 1,
          Clothing: product.category === 'Clothing' ? 1 : 0,
          Shoes: product.category === 'Shoes' ? 1 : 0,
          Watches: product.category === 'Watches' ? 1 : 0,
          Accessories: product.category === 'Accessories' ? 1 : 0,
        };
      } else {
        const {All, Clothing, Shoes, Watches, Accessories} = countsData.data() as Counts;

        counts = {
          All: All + 1,
          Clothing: product.category === 'Clothing' ? Clothing + 1 : Clothing,
          Shoes: product.category === 'Shoes' ? Shoes + 1 : Shoes,
          Watches: product.category === 'Watches' ? Watches + 1 : Watches,
          Accessories: product.category === 'Accessories' ? Accessories + 1 : Accessories,
        };
      }

      // Update the counts document in the product-counts collection
      return await admin
          .firestore()
          .collection(productCountsCollection)
          .doc(productCountsDocument)
          .set(counts);

    // return productsIndex.saveObject({
    //   objectID: snapshot.id,
    //   ...product,
    // });
    });

export const onProductUpdated = functions.firestore
    .document(`${productsCollection}/{productId}`)
    .onUpdate(async (snapshot, context) => {
      const beforeProd = snapshot.before.data() as Product;
      const afterProd = snapshot.after.data() as Product;

      // Check if the category has been changed
      if (beforeProd.category !== afterProd.category) {
      // B. The category is changed
        const countsData = await admin
            .firestore()
            .collection(productCountsCollection)
            .doc(productCountsDocument)
            .get();

        if (!countsData.exists) return;

        const counts = countsData.data() as Counts;

        // Update the counts object
        counts[beforeProd.category] = counts[beforeProd.category] - 1;
        counts[afterProd.category] = counts[afterProd.category] + 1;

        return await admin
            .firestore()
            .collection(productCountsCollection)
            .doc(productCountsDocument)
            .set(counts);
      }
      return;
    // return productsIndex.saveObject({
    //   objectID: snapshot.after.id,
    //   ...afterProd,
    // });
    });

export const onProductDeleted = functions.firestore
    .document(`${productsCollection}/{productId}`)
    .onDelete(async (snapshot, context) => {
      const product = snapshot.data() as Product;

      // Query the product-counts/counts from firestore
      const countsData = await admin
          .firestore()
          .collection(productCountsCollection)
          .doc(productCountsDocument)
          .get();

      if (!countsData.exists) return;

      const counts = countsData.data() as Counts;

      // Update the counts object
      counts.All = counts.All - 1;
      counts[product.category] = counts[product.category] - 1;

      return await admin
          .firestore()
          .collection(productCountsCollection)
          .doc(productCountsDocument)
          .set(counts);

    // return productsIndex.deleteObject(snapshot.id);
    });
