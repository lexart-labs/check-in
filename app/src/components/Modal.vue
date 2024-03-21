<template>
    <transition >
      <div v-show="modalActive" >
        <transition >
          <div v-show="modalActive" class="modal">
              <v-card 
                  class="mx-auto check-in--card pa-4"
                  color="#36393f"
                  theme="dark"
                  width="820"
                  height="320"
                  variant="flat"
                  style="border:2px solid gray"
              >
              <slot />
              <div class="d-flex justify-space-around mt-8">
              <v-btn  @click="sendAndClose" >Send </v-btn>
              <v-btn @click="close" >Close</v-btn>
              </div>
            </v-card>
          </div>
        </transition>
      </div>
    </transition>
  </template>
  <script>
  export default {
    props: ["modalActive"],
    setup(props, { emit }) {
      const close = () => {
        emit("close");
      };
  
      const sendAndClose = () => {
        emit("send-and-close"); 
      };
  
      return { close, sendAndClose };
    },
  };
  </script>
    <style >
    .modal {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      width: 100vw;
      position: fixed;
      margin-left: 120px;
      top: 0;
      left: 0;
    }
    </style>