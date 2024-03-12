/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
require('dotenv').config();

const ADMIN_USERS = process.env.ADMIN_USERS.split(',');
const LEADS_USERS = process.env.LEADS_USERS.split(',');

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();


exports.convertadmin = functions.auth.user().onCreate((user) => {
  // Comprueba si el usuario se autenticó con Google
  if (user.providerData.some(provider => provider.providerId === 'google.com') && ADMIN_USERS.includes(user.email)) {
    // Convierte al usuario en administrador
    return admin.auth().setCustomUserClaims(user.uid, { admin: true })
      .then(() => {
        console.log('Usuario convertido en administrador:', user.uid, user);
        return null;
      })
      .catch((error) => {
        console.error('Error al convertir en administrador:', error);
        return null;
      });
  } else {
    console.log('Usuario no autenticado con Google, no se convierte en administrador:', user.uid);
    return null;
  }
});