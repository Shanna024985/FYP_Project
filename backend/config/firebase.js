const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.join(__dirname, '../firebase-service-account-key.json'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
});

const auth = admin.auth();
const db = admin.firestore();

module.exports = { admin, auth, db };