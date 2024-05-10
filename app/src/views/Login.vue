<template>
    <v-container class="fill-height">
      <v-responsive class="align-center text-center fill-height">
        <div class="text-body-1 font-weight-light mb-n1" style="color: #fff;">Check-In/Brb</div>

        <div class="py-4" />

        <v-row class="d-flex align-center justify-center">
          <v-col>
            <v-btn class="btn-custom-login" x-large="true" prepend-icon="mdi-google" @click="signinPopup">
              Enter with Google
            </v-btn>
          </v-col>
        </v-row>
      </v-responsive>
    </v-container>
  </template>

  <script setup>
    import {
      signInWithPopup,
      GoogleAuthProvider,
      signOut,
      getAuth
    } from 'firebase/auth'
    import { useCurrentUser, useFirebaseAuth } from 'vuefire'
    import router from '../router'
    import { EMAIL_PREFIX } from '@/main'
    import {useToast} from 'vue-toast-notification'
    import 'vue-toast-notification/dist/theme-sugar.css'
    import utils from '@/utils'

    const googleAuthProvider = new GoogleAuthProvider()
    const auth = useFirebaseAuth() // only exists on client side
    const error = {}

    async function signinPopup() {
      error.value = null
      signInWithPopup(auth, googleAuthProvider).then(async (response) => {
          console.log("response: ", response)
          if(response.user?.email.includes(EMAIL_PREFIX)){
            // Set a flag to check if the user just logged in
            sessionStorage.setItem('justLoggedIn', 'true');
            router.push('/check-in')
          } else {
            // do logout
            const auth = await getAuth()

            const $toast = useToast();
            let instance = $toast.error('Email not allowed in this tenant.');

            await signOut(auth)
            router.push('/')
          }
      }).catch((reason) => {
        console.error('Failed sign', reason)
        error.value = reason
      })
    }

    setTimeout( () => {
      const currentUser = useCurrentUser()
      utils.clearIntervallAll()
      if(currentUser.value !== null){
        router.push('/check-in')
        return
      }
    }, 50)
  </script>
