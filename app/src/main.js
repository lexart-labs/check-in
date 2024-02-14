/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { VueFire, VueFireAuth } from 'vuefire'
import { initializeApp } from 'firebase/app'
import firebaseConfig from './firebaseConfig'
import { getFirestore } from 'firebase/firestore'
import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-bootstrap.css'

export const firebaseApp = initializeApp(firebaseConfig)

// used for the firestore refs
export const db = getFirestore(firebaseApp)

export const EMAIL_PREFIX = 'lexartlabs.xyz'

export const TICKER_TIME  = 30000

const app = createApp(App)

app.use(VueFire, {
    // imported above but could also just be created here
    firebaseApp,
    modules: [
        // we will see other modules later on
        VueFireAuth(),
    ],
})
app.use(ToastPlugin)
registerPlugins(app)

app.mount('#app')
