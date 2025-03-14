const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require("axios");
require('dotenv').config();

const ADMIN_USERS     = process.env.ADMIN_USERS.split(',');
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

admin.initializeApp();
const db = admin.firestore();

async function getPresence(userId) {
  try {
    // Realiza la solicitud a Slack para obtener la presencia del usuario
    const response = await axios.get('https://slack.com/api/users.getPresence', {
      params: {
        user: userId
      },
      headers: {
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`
      }
    });

    if (response.data.ok) {
      // Si la solicitud fue exitosa, retorna el estado de presencia
      return response.data.presence;  // 'active' o 'away'
    } else {
      console.error('Error al obtener la presencia:', response.data.error);
      return null;
    }
  } catch (error) {
    console.error('Error al hacer la solicitud a la API de Slack:', error);
    return null;
  }
}

async function getAllUsers() {
  try {
    const response = await axios.get('https://slack.com/api/users.list', {
      headers: {
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
      },
    });

    if (response.data.ok) {
      return response.data.members;  // Array of user objects
    } else {
      console.error('Error fetching users from Slack:', response.data.error);
      return [];
    }
  } catch (error) {
    console.error('Error making request to Slack API:', error);
    return [];
  }
}

async function createCheckin(user) {
  const userPresence = await getPresence(user.id);
  const currentDate = new Date();
  const rawDate = new Date(currentDate).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });

  const checkinData = {
    _rawDate: rawDate,
    date: currentDate.getTime(),
    email: user.profile.email,
    isOtpValid: true,  // Assuming OTP is valid, you can change this logic based on your needs
    tenant: 'lexart',
    timeBrb: userPresence === 'away' ? currentDate.getTime() : null,
    timeCheckin: userPresence === 'active' ? currentDate.getTime() : null,
    username: user.real_name,
  };

  try {
    await db.collection('checkin').add(checkinData);
    console.log(`Check-in added for user ${user.real_name}`);
  } catch (error) {
    console.error('Error adding check-in to Firestore:', error);
  }
}

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

exports.checkSlackUsersPresence = functions.pubsub.schedule('*/5 * * * *').onRun(async (context) => {
  console.log('Running scheduled function ::');

  // Get all users from Slack
  const users = await getAllUsers();

  // Loop through each user and perform the check-in logic
  for (const user of users) {
    if (!user.is_bot && user.profile?.email && user?.is_email_confirmed === true) {
      // Do the check-in logic for active users
      await createCheckin(user);
    }
  }

  console.log('Scheduled function completed ::');
});
