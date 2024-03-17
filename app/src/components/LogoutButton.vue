<template>
  <v-btn
    border
    v-if="!isAdminUser"
    class="me-2 text-none"
    color="red"
    prepend-icon="mdi-logout"
    variant="flat"
    @click="doLogout"
  >
    Logout
  </v-btn>
</template>

<script setup>
  import { ref } from "vue";

  const props = defineProps({
    isAdminUser: Boolean,
    doLogout: Function,
  });
</script>
