const admin = require('firebase-admin');
const serviceAccount = require('../music-52602-firebase-adminsdk-fax9b-0d8089b84a.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'music-52602.appspot.com' 
  });
}

const bucket = admin.storage().bucket();

module.exports = bucket;
