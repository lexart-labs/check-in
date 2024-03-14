<template>
  <v-card
    class="mx-auto check-in--card"
    color="#36393f"
    max-width="650"
    min-height="250"
    theme="dark"
    variant="flat"
  >
    <v-sheet color="#202225">
      <v-card-item>
        <template 
          v-slot:prepend
        >
          <v-card-title>
            <v-icon
              icon="mdi-clipboard-account"
              start
            ></v-icon>

            {{usr.displayName}}
          </v-card-title>
        </template>

        <v-divider vertical class="mx-2"></v-divider>

        <v-btn
          class="text-none text-subtitle-1"
          color="#08be35"
          size="small"
          variant="flat"
          v-if="isChechin"
        >
          I'm active
        </v-btn>
        <v-btn
          class="text-none text-subtitle-1"
          color="#f19807"
          size="small"
          variant="flat"
          v-if="!isChechin"
        >
          brb
        </v-btn>
      </v-card-item>
    </v-sheet>

    <v-card
      class="ma-4"
      color="#2f3136"
      rounded="lg"
      variant="flat"
    >
      <v-card-item>
        <v-card-title class="text-body-2 d-flex align-center">
          <v-icon
            :color="!isChechin ? colors['disabled'] : colors['checkIn']"
            :icon="isChechin ? 'mdi-clock-check' : 'mdi-coffee-to-go'"
            start
          ></v-icon>

          <span class="text-medium-emphasis font-weight-bold">{{ date }}</span>

          <v-spacer></v-spacer>

          <v-chip
            class="ms-2 text-medium-emphasis"
            color="grey-darken-4"
            prepend-icon="mdi-account-multiple"
            size="small"
            v-bind:text="activeUsers"
            variant="flat"
          ></v-chip>
        </v-card-title>

        <div class="py-2">
          <div class="text-h6">{{promoText.title}}</div>

          <div class="font-weight-light text-medium-emphasis">
            {{promoText.desc}}
          </div>
        </div>
      </v-card-item>

      <v-divider></v-divider>

      <div class="pa-4 d-flex align-center">

        <v-spacer></v-spacer>

        <v-btn
          class="me-2 text-none"
          :disabled="isSavingCheckIn"
          :color="isChechin ? colors['disabled'] : colors['checkIn']"
          prepend-icon="mdi-check"
          variant="flat"
          @click="doCheckIn"
        >
          Check-In
        </v-btn>

        <v-btn
          border
          :disabled="isSavingBrb"
          :color="!isChechin ? colors['disabled'] : colors['brb']"
          class="me-2 text-none"
          prepend-icon="mdi-coffee-to-go"
          variant="flat"
          @click="doBrb"
        >
          brb
        </v-btn>

        <LogoutButton
          :isAdminUser="isAdminUser"
          :doLogout="() => doLogout(isAdminUser, doBrb, getAuth, signOut, router)"
        />

        <v-btn
          border
          v-if="isAdminUser"
          class="me-2 text-none"
          color="blue"
          prepend-icon="mdi-view-dashboard"
          variant="flat"
          @click="goTo('/dashboard')"
        >
          Dashboard
        </v-btn>
      </div>
    </v-card>
  </v-card>
</template>

<script setup>
  import { ref } from 'vue';
  import { getCurrentUser } from 'vuefire';
  import { EMAIL_PREFIX, db } from '@/main';
  import { signOut, getAuth } from 'firebase/auth'
  import { collection, addDoc, doc, getDoc, setDoc, getDocs } from "firebase/firestore";
  import utils from '@/utils'
  import router from '@/router';
  import { doCheckInIfJustLoggedIn } from '@/helpers/onLoginAction';
  import { doLogout } from '@/helpers/doLogoutFunction';
  import LogoutButton from '@/components/LogoutButton.vue'

  const TABLE_NAME = 'checkin';
  const date = ref(new Date())
  const isChechin = ref(false)
  const isSavingCheckIn = ref(false)
  const isSavingBrb     = ref(false)
  const isAdminUser     = ref(false)
  const docId           = ref({
    checkIn: "", 
    brb: ""
  })
  const items = ref([])

  console.log("window.INTERVAL_INT: ", window.INTERVAL_INT)
  // clear

  const promoText = {
    title: 'Check-In/Brb',
    desc: 'This software helps Lexart business and management to understand availability.'
  }
  const colors = {
    'checkIn': '#08be35',
    'brb': '#f19807',
    'disabled': '#4f545c'
  }
  const usr = ref({
    displayName: ''
  })
  const activeUsers = ref("0")

  function goTo(route){
    router.push(route)
  }

  const doCheckIn = async function (){
    let isEditDoc = false
    console.log("docId.checkIn.value: ", docId.value.checkIn)
    if(docId.value.checkIn !== "" && isChechin.value === false){
      // get data by ID
      const docRef  = await doc(db, TABLE_NAME, docId.value.checkIn)
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("docRef CHECKIN :: ", docSnap.data());
        isEditDoc = true
      }
      const docRefEdit = await setDoc(docRef, {
        date: +new Date(),
        email: usr.value?.email,
        isOtpValid: true,
        tenant: 'lexart',
        timeBrb: null,
        timeCheckin: +new Date(),
        username: usr.value?.displayName,
        _rawDate: new Date()
      });

      // store ID in docId value
      isSavingCheckIn.value = false
      isChechin.value       = true
      date.value            = new Date()
    }
    if(isChechin.value === false && !isEditDoc){
      isSavingCheckIn.value = true
      const docRef = await addDoc(collection(db, TABLE_NAME), {
        date: +new Date(),
        email: usr.value?.email,
        isOtpValid: true,
        tenant: 'lexart',
        timeBrb: null,
        timeCheckin: +new Date(),
        username: usr.value?.displayName,
        _rawDate: new Date()
      });
      console.log("CHECKIN: Document written with ID: ", docRef.id);
      // store ID in docId value
      docId.value.checkIn   = docRef.id
      isSavingCheckIn.value = false
      isChechin.value       = true
      date.value            = new Date()
    }
    await runner()
  }

  const doBrb = async function (){
    if(docId.value.checkIn !== "" && isChechin.value === true){
      isSavingBrb.value = true
      // get data by ID
      const docRef  = await doc(db, TABLE_NAME, docId.value.checkIn)
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("docRef CHECKIN :: ", docSnap.data());
      }
      const docRefEdit = await setDoc(docRef, {
        date: +new Date(),
        email: usr.value?.email,
        isOtpValid: true,
        tenant: 'lexart',
        timeBrb: +new Date(),
        timeCheckin: null,
        username: usr.value?.displayName,
        _rawDate: new Date()
      });
      isSavingBrb.value = false
      isChechin.value   = false
    }

    await runner()
  }

  // Get all active users
  async function getMyStatus(user){
    const activeUsersFilter = await utils.activeUsersToday("checkin", {
      uniqueProp: 'email',
      condChain: (a, b) => {
        return a.email == b.email
      }
    }, {email: usr.value.email})

    return activeUsersFilter.users.length > 0 ? activeUsersFilter.users[0] : false
  }

  // Runner
  async function runner () {
    const fbUser = await getCurrentUser()
    usr.value   = {...fbUser}

    try {
      const adminUser = JSON.parse(usr.value?.reloadUserInfo?.customAttributes)
      isAdminUser.value = adminUser.admin ? adminUser.admin : false
    } catch (e){
      console.log("error admin :: ", e)
    }
    console.log("currentUser: ", usr)
    
    // if not whitelist email
    if(!usr.value?.email.includes(EMAIL_PREFIX)){
      const auth = await getAuth()
      await signOut(auth)
      router.push('/')
    }

    const myStatus = await getMyStatus(usr)
    if(myStatus){
      isChechin.value     = myStatus.isCheckIn
      date.value          = isChechin.value ? new Date(myStatus.checkin) : new Date(myStatus.brb)
      docId.value.checkIn = myStatus.docId
    }
    console.log("myStatus: ", myStatus)
    // Only active users 
    let activeCheckins = await utils.activeUsersToday("checkin", {
      uniqueProp: 'email',
      condChain: () => true
    })
    activeCheckins = activeCheckins.users.filter( item => item.isCheckIn)
    activeUsers.value = (activeCheckins.length).toString()
    utils.clearIntervallAll()
    
    //Do checkin if just logged in
    await doCheckInIfJustLoggedIn(doCheckIn);
  }
  runner()

</script>

<style scoped>
  .check-in--card {
    margin-top: 2rem;
  }
</style>
