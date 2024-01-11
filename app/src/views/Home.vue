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

            {{usr.name}}
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
            color="#08be35"
            icon="mdi-clock-check"
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
          :color="isChechin ? colors['disabled'] : colors['checkIn']"
          prepend-icon="mdi-check"
          variant="flat"
          @click="doCheckIn"
        >
          Check-In
        </v-btn>

        <v-btn
          border
          :color="!isChechin ? colors['disabled'] : colors['brb']"
          class="me-2 text-none"
          prepend-icon="mdi-coffee-to-go"
          variant="flat"
          @click="doBrb"
        >
          brb
        </v-btn>
      </div>
    </v-card>
  </v-card>
</template>

<script setup>
  import { ref } from 'vue';
  const date = new Date()
  const isChechin = ref(false)
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
    name: 'Alex Casadevall'
  })
  const activeUsers = ref("0")

  const doCheckIn = function (){
    isChechin.value = true
  }

  const doBrb = function (){
    isChechin.value = false
  }
</script>

<style scoped>
  .check-in--card {
    margin-top: 2rem;
  }
</style>
