<template>
    <v-layout class="rounded rounded-md">
        <v-app-bar title="Check-in/Brb" theme="dark"></v-app-bar>

        <v-navigation-drawer permanent theme="dark">
            <v-list>
                <v-list-item title="Logout"></v-list-item>
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
                        <v-chip
                        :color="item.isCheckIn ? '#08be35' : '#f19807'"
                        :text="item.isCheckIn ? 'Check-In' : 'brb'"
                        class="text-uppercase"
                        label
                        size="small"
                        ></v-chip>
                    </div>
                </template>
            </v-data-table>
            </v-card>
        </v-main>
    </v-layout>
  </template>
  <script setup>

  import { ref } from 'vue';
  import { db } from '@/main';
  import { useCollection } from 'vuefire';
  import { collection, getDocs } from "firebase/firestore";
  import lodash from 'lodash';
  import utils from '@/utils';

  const items = ref([])
  const search = ref('')

  async function runner (){
    items.value = (await utils.activeUsersToday('checkin', {uniqueProp: 'email', condChain: () => true }, true)).users
  }
  runner()
  
  </script>