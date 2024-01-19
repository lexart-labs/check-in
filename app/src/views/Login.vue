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
    } from 'firebase/auth'
    import { useCurrentUser, useFirebaseAuth } from 'vuefire'
    import router from '../router'
  
    const googleAuthProvider = new GoogleAuthProvider()
    const auth = useFirebaseAuth() // only exists on client side
    const error = {}
  
    function signinPopup() {
      error.value = null
      signInWithPopup(auth, googleAuthProvider).then((response) => {
          console.log("response: ", response)
          if(response){
            console.log("Programatic redirect :: ")
            router.push('/check-in')
          }
      }).catch((reason) => {
        console.error('Failed sign', reason)
        error.value = reason
      })
    }
  
    setTimeout( () => {
      const currentUser = useCurrentUser()
      console.log("currentUser: ", currentUser.value)
      if(currentUser.value !== null){
        router.push('/')
        return
      }
    }, 50)
  </script>