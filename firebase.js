const admin = require('firebase-admin');
const fs = require('fs');

const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

let db = null;
let firebaseInitialized = false;

if (!credPath || !fs.existsSync(credPath)) {
  console.warn('⚠️ GOOGLE_APPLICATION_CREDENTIALS not set or file not found.');
  console.warn('⚠️ Firebase/Firestore features (shifts) will NOT work.');
  console.warn('⚠️ Onboarding features will still work normally.');
  // Create a mock db that throws helpful errors
  db = new Proxy({}, {
    get() {
      throw new Error('Firebase not initialized. Please configure service-account.json first.');
    }
  });
} else {
  try {
    const serviceAccount = require(credPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    firebaseInitialized = true;
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error.message);
    console.warn('⚠️ Shift features will NOT work.');
    // Create a mock db
    db = new Proxy({}, {
      get() {
        throw new Error('Firebase initialization failed. Check your service-account.json');
      }
    });
  }
}

module.exports = { db, admin, firebaseInitialized };

