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
                <template v-slot:item.isCheckIn="{ item }">
                    <div class="text-end">
                        <v-btn
                        :color="item.isCheckIn ? '#08be35' : '#f19807'"
                        :text="item.isCheckIn ? 'Check-In' : 'brb'"
                        class="text-uppercase"
                        label
                        size="small"
                        @click="doChange(item)"
                        ></v-btn>
                    </div>
                </template>
            </v-data-table>
            </v-card>
        </v-main>
        <Modal :modalActive="modalActive" @close="closeModal" @send-and-close="statusChanged">
      <div class="modal-content">
        <v-card-title v-if="modalUser" class="d-flex align-center justify-center pe-2 my-2">
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
      </div>
    </Modal>
    </v-layout>
  </template>
  <script setup>

  import { ref } from 'vue';
  import utils from '@/utils';
  import router from '@/router';
  import {db} from '@/main'
    import {
      getAuth,
      signOut
    } from 'firebase/auth';
  import { TICKER_TIME } from '@/main';
  import {doc,setDoc,addDoc,collection,getDocs } from "firebase/firestore";
  import Modal from '@/components/Modal';
  import { getCurrentUser } from 'vuefire';

  const items = ref([])
  const search = ref('')
  const TABLE_NAME = 'checkin';
  const TABLE_NAME_CHANGED_CHECKIN ='changedCheckin'
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

  function closeModal(){
  modalActive.value = false;
}

async function sendReason(){
  const user = modalUser.value
  const adm = await getCurrentUser()
  const docRef = collection(db,TABLE_NAME_CHANGED_CHECKIN)
  const docSnap = await getDocs(docRef);
  let exist = false;
  let docId = null;
  docSnap.docs.forEach((i)=>{
    let item = i.data()
    if(item.devEmail===user.email){
      exist = true
      docId = i.id
    }
  })
  const newDoc = {
    date: +new Date(),
    admEmail:adm.email,
    admName:adm.displayName,
    devName:user.name,
    devEmail:user.email,
    reason:reason.value,
    _rawDate: new Date()
  }
  if(exist){
    const docUser = await doc(db,TABLE_NAME_CHANGED_CHECKIN,docId)
    await setDoc(docUser, {...newDoc});
  }else{
    await addDoc(collection(db,TABLE_NAME_CHANGED_CHECKIN),{...newDoc})
  }
  reason.value = ''
  modalUser.value=''
}

  async function statusChanged(){
    const user = modalUser.value
    const docRef  = await doc(db, TABLE_NAME, user.docId)
    await setDoc(docRef, {
    date: +new Date(),
    email: user.email,
    isOtpValid: true,
    tenant: 'lexart',
    timeBrb: user.isCheckIn? +new Date():null,
    timeCheckin:  user.isCheckIn? null:+new Date(),
    username: user.name,
    _rawDate: new Date()
    });
    await sendReason();
    runner()
    closeModal();
  }

  function doChange(user){
    modalUser.value = {...user}
    modalActive.value = true;
  }
  </script>