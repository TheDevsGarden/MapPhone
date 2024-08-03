<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ $route.path.slice(1) }}</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar placeholder="Search Name or Number" :debounce="1000" @ionInput="handleInput($event)"></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true"
      ><ion-list>
        <ion-item v-for="result in results">
          <ion-label>{{ result }}</ion-label>
        </ion-item>
      </ion-list></ion-content
    >
  </ion-page>
</template>

<script setup lang="ts">
import { IonSearchbar, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from "@ionic/vue";
import { ref } from "vue";

const data = ["Amsterdam", "Buenos Aires", "Cairo", "Geneva", "Hong Kong", "Istanbul", "London", "Madrid", "New York", "Panama City"];

//so we know that there will be a collection of businesses or phone numbers on Firebase, I am thinking of doing location based but not yet

//a collection will have all the id phone number, title business, and tree of numbers, so let's work on adding a biz

//we want to have a tree for the list of options
//for some numbers, the same number can have multiple trees, based on location and language

//we want to get the number from the google maps or places api, if a business updates its number, we may want to trickle that down or have a user enabled modify function with review

const results = ref(data);

function handleInput(event: Event) {
  const target = event.target;
  const query = target.value?.toLowerCase() || "";
  results.value = data.filter((d) => d.toLowerCase().indexOf(query) > -1);
}
</script>
