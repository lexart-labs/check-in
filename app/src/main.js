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

export const firebaseApp = initializeApp(firebaseConfig)

// used for the firestore refs
export const db = getFirestore(firebaseApp)

const app = createApp(App)

app.use(VueFire, {
    // imported above but could also just be created here
    firebaseApp,
    modules: [
        // we will see other modules later on
        VueFireAuth(),
    ],
})

registerPlugins(app)

app.mount('#app')
