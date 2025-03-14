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

exports.slackStatusWebhook = functions.https.onRequest(async (req, res) => {
  try {
      const event     = req.body?.event;
      const challenge = req.body?.challenge;

      if (!event || event.type !== "presence_change") {
          return res.status(200).send({response: "Evento no válido", challenge: challenge});
      }

      const { user, presence } = event;
      const slackUserInfo = await axios.get(`https://slack.com/api/users.info`, {
          headers: { Authorization: `Bearer ${SLACK_BOT_TOKEN}` },
          params: { user }
      });

      if (!slackUserInfo.data.ok) {
          console.error("Error al obtener info del usuario:", slackUserInfo.data);
          return res.status(500).send({response: "Error al obtener info del usuario", challenge: challenge});
      }

      const { profile } = slackUserInfo.data.user;
      const email = profile.email || "desconocido";
      const username = profile.real_name || "Usuario sin nombre";

      const timestamp = Date.now();
      const formattedDate = new Date(timestamp).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });

      const checkinData = {
          _rawDate: formattedDate,
          date: timestamp,
          email: email,
          isOtpValid: true,
          tenant: "lexart",
          timeBrb: presence === "away" ? timestamp : null,
          timeCheckin: presence === "active" ? timestamp : null,
          username: username
      };

      await db.collection("checkin").add(checkinData);

      res.status(200).send({response: "Check-in registrado", challenge: challenge});
  } catch (error) {
      console.error("Error procesando el evento:", error);
      res.status(500).send({response: "Error interno del servidor", challenge: null});
  }
});
