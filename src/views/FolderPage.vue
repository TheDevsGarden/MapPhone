<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ name }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ name }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <strong class="capitalize">{{ name }}</strong>
        <p v-if="phoneNumber">Phone: {{ phoneNumber }}</p>
        <p v-if="address">Address: {{ address }}</p>
        <p>Google Maps ID: {{ id }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from "@ionic/vue";
import { useRoute } from "vue-router";

const route = useRoute();

/* const props = defineProps<{
  id: string;
  name?: string;
  displayName?: { text: string };
  internationalPhoneNumber?: string;
  formattedAddress?: string;
}>(); */
const props = defineProps<{
  id: string;
  name?: string;
  phoneNumber?: string;
  address?: string;
}>();
</script>

<style scoped></style>
