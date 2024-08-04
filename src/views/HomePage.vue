<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>MapPhone Directory</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar placeholder="Search entity or phone number" :debounce="300" @ionInput="handleSearch()"></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!--       <ion-list v-if="!loading">
        <ion-item v-for="entity in searchResults" :key="entity.id" @click="viewentityDetails(entity.id)">
          <ion-label>
            <h2>{{ entity.name }}</h2>
            <p>{{ entity.phoneNumber }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
      <ion-spinner v-if="loading"></ion-spinner>
      <ion-text v-if="!loading && searchResults.length === 0">
        <p class="ion-text-center">No results found</p>
      </ion-text> -->

      <!-- Gonna put a Map -->
      <div tappable id="map" style="width: 100%; height: 16rem; border: 1px solid grey"></div>
      <!-- Gonna put a list that refreshes alphabetically based on Radius -->
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonList, IonItem, IonLabel, IonButtons, IonMenuButton, IonSpinner, IonText, IonButton } from "@ionic/vue";

const router = useRouter();
const searchResults = ref([]);
const loading = ref(false);

const handleSearch = async () => {};

const viewentityDetails = (entityId: string) => {
  //router.push({ name: "entityDetails", params: { id: entityId } });
};

//the map

let map: google.maps.Map;
let center: google.maps.LatLngLiteral;

async function initMap() {
  const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;

  center = { lat: 37.4161493, lng: -122.0812166 };
  map = new Map(document.getElementById("map") as HTMLElement, {
    center: center,
    zoom: 11,
    mapId: "DEMO_MAP_ID",
  });
  findPlaces();
}

async function findPlaces() {
  const { Place } = (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;
  const { AdvancedMarkerElement } = (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;
  const request = {
    textQuery: "Tacos in Mountain View",
    fields: ["displayName", "location", "businessStatus"],
    includedType: "restaurant",
    locationBias: { lat: 37.4161493, lng: -122.0812166 },
    isOpenNow: true,
    language: "en-US",
    maxResultCount: 8,
    minRating: 3.2,
    region: "us",
    useStrictTypeFiltering: false,
  };

  const { places } = await Place.searchByText(request);

  if (places.length) {
    console.log(places);

    const { LatLngBounds } = (await google.maps.importLibrary("core")) as google.maps.CoreLibrary;
    const bounds = new LatLngBounds();

    places.forEach((place) => {
      const markerView = new AdvancedMarkerElement({
        map,
        position: place.location,
        title: place.displayName,
      });

      if (place.location) {
        bounds.extend(place.location);
      }
      console.log(place);
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds);
    }
  } else {
    console.log("No results");
  }
}

onMounted(() => {
  initMap();
});
</script>
<style scoped></style>
