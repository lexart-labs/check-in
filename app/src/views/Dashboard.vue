<template>
  <v-layout class="rounded rounded-md">
      <v-app-bar title="Check-in/Brb" theme="dark"></v-app-bar>
      <v-navigation-drawer permanent theme="dark">
          <v-list>
              <v-list-item title="CheckIn/Brb" @click="goTo('/check-in')"></v-list-item>
              <v-list-item title="Logout" @click="logOut"></v-list-item>
          </v-list>
      </v-navigation-drawer>
      <v-main class="d-flex align-center justify-center" style="min-height: 100vh;">
          <v-card 
              class="mx-auto check-in--card"
              color="#36393f"
              width="960"
              theme="dark"
              variant="flat"
          >
          <v-card-title class="d-flex align-center pe-2">
              <v-icon icon="mdi-clipboard-account"></v-icon> &nbsp;
              Colaborators
              <v-spacer></v-spacer>
              <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  density="compact"
                  label="Search"
                  single-line
                  flat
                  hide-details
                  variant="solo-filled"
              ></v-text-field>
          </v-card-title>
          <v-divider></v-divider>
          <v-data-table v-model:search="search" :items="items">
              <template v-slot:header.isCheckIn>
                  <div class="text-end">Status</div>
              </template>
                <template v-slot:item.isCheckIn="{ item }" >
                  <div class="text-end">
                      <v-btn
                      :color="item.isCheckIn ? '#08be35' : '#f19807'"
                      :text="item.isCheckIn ? 'Check-In' : 'brb'"
                      class="text-uppercase"
                      label
                      size="small"
                      @click="openModal(item)"
                      ></v-btn>
                  </div>
              </template>
          </v-data-table>
           <v-dialog v-model="modalActive"
           :style="{ marginLeft: '260px' }">
              <template v-slot:default>
                <v-card
                class="check-in--card mx-auto"
                color="#36393f"
                width="820"
                height="320"
                theme="dark"
                variant="flat">
                  <v-card-title class="d-flex align-center justify-center pe-2 my-2">
                    You want to change the user
                    &nbsp;
                    <span :style="{color:'#0096c7'}">
                      {{ modalUser.name }}
                    </span>
                    &nbsp;
                    status from
                    &nbsp;
                    <span :style="{color: modalUser.isCheckIn ? '#08be35' : '#f19807'}">
                      {{ modalUser.isCheckIn ? 'CHECKIN' : 'BRB' }}
                    </span>
                    &nbsp;
                    to 
                    &nbsp;
                    <span :style="{color: modalUser.isCheckIn ? '#f19807' : '#08be35'}">
                      {{ modalUser.isCheckIn ? 'BRB' : 'CHECKIN' }}
                    </span>?
                </v-card-title>
              <v-textarea
                  label="Reason"
                  v-model="reason"
                  hide-details
                  width="600"
                  class="mx-auto w-75 "
                  variant="solo-filled">
                </v-textarea>
                <div class="d-flex justify-end pa-2">
                  <v-btn
                text="close"
                size="small"
                class="mx-2"
                @click="modalActive = false"
                ></v-btn>
                <v-btn
                text="Send"
                size="small"
                class="mx-2"
                @click="makeChange"
                >
                </v-btn>
                </div>
                </v-card>
              </template>
              </v-dialog>
          </v-card>
      </v-main>
  </v-layout>
</template>
<script setup>

import { ref } from 'vue';
import utils from '@/utils';
import router from '@/router';
  import {
    getAuth,
    signOut
  } from 'firebase/auth';
import { TICKER_TIME } from '@/main';
import { statusChanged,sendReason } from '@/helpers/statusChanged';
import {db} from '@/main'
import {doc,setDoc,addDoc,collection,getDocs } from "firebase/firestore";
import { getCurrentUser } from 'vuefire';

const items = ref([])
const search = ref('')
const TABLE_NAME = 'checkin';
const reason = ref('')
const modalActive = ref(false);
const modalUser = ref('');

async function logOut(){
    const auth = await getAuth()
    await signOut(auth)
    router.push('/')
}
function goTo(route){
  utils.clearIntervallAll()
  router.push(route)
}

async function runner (){
  items.value = (await utils.activeUsersToday('checkin', {uniqueProp: 'email', condChain: () => true }, true)).users
}
runner()

let i = 1
window.INTERVAL_INT = setInterval( async () => {
  console.log("runner >> ", i)
  runner()
  i++
}, TICKER_TIME)

async function makeChange(){
  const firebaseFunctions = {doc,setDoc,addDoc,collection,getDocs,getCurrentUser}
  await statusChanged(modalUser.value,TABLE_NAME,db,firebaseFunctions);
  await sendReason(modalUser.value,reason.value,db,firebaseFunctions);

  modalActive.value =false;
  reason.value = ''
  runner()
}

function openModal(user){
  modalUser.value = {...user}
  modalActive.value = true;
}
</script>