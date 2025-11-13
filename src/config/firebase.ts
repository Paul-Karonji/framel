import admin from 'firebase-admin';

// Initialize Firebase Admin
const initializeFirebase = () => {
  try {
    // Check if already initialized
    if (admin.apps.length > 0) {
      return admin.app();
    }

    // Initialize with service account credentials from environment
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });

    console.log('✅ Firebase Admin initialized successfully');
    return admin.app();
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error);
    throw error;
  }
};

// Initialize Firebase
initializeFirebase();

// Export Firestore instance
export const db = admin.firestore();

// Export Auth instance
export const auth = admin.auth();

// Export Storage instance (if needed later)
export const storage = admin.storage();

// Export admin for other uses
export default admin;
