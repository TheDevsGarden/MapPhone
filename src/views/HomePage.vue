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
        <ion-searchbar placeholder="Search entity or phone number" :debounce="1000" @ionInput="handleSearch($event)"></ion-searchbar>
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
      <div tappable id="map" style="width: 100%; height: 45%; border: 1px solid grey"></div>
      <!-- Gonna put a list that refreshes alphabetically based on Radius -->
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonList, IonItem, IonLabel, IonButtons, IonMenuButton, IonSpinner, IonText, IonButton } from "@ionic/vue";
import { Geolocation } from "@capacitor/geolocation";

const router = useRouter();
const searchResults = ref([]);
const loading = ref(false);
const searchTerm = ref("");

const handleSearch = async (event: CustomEvent) => {
  try {
    loading.value = true;
    searchTerm.value = event.detail.value;
    searchResults.value = [];

    const request = {
      textQuery: searchTerm.value,
      fields: ["displayName", "location", "internationalPhoneNumber"],
      isOpenNow: true,
      maxResultCount: 3,
      useStrictTypeFiltering: false,
    };

    await findPlaces(request);
  } catch (error) {
    console.error("Error during search:", error);
    searchResults.value = [];
  } finally {
    loading.value = false;
  }
};

const viewentityDetails = (entityId: string) => {
  //router.push({ name: "entityDetails", params: { id: entityId } });
};

//the map

let map: google.maps.Map;
let center: google.maps.LatLngLiteral;

async function initMap() {
  const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;

  const getCurrentPosition = async () => {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      center = { lat: coordinates.coords.latitude, lng: coordinates.coords.longitude };
    } catch (error) {
      console.error("Error getting location", error);
      center = { lat: 37.4161493, lng: -122.0812166 };
    }
  };

  await getCurrentPosition();
  map = new Map(document.getElementById("map") as HTMLElement, {
    center: center,
    zoom: 11,
    mapId: "DEMO_MAP_ID",
  });
  findPlaces();
}

async function findPlaces(request: google.maps.places.TextSearchRequest) {
  const { Place } = (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;
  const { AdvancedMarkerElement } = (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;

  try {
    const { places } = await Place.searchByText(request);

    if (places.length) {
      const { LatLngBounds } = (await google.maps.importLibrary("core")) as google.maps.CoreLibrary;
      const bounds = new LatLngBounds();
      console.log("latlongbnds");

      // Clear existing markers (if any)
      //map.clear();

      places.forEach((place) => {
        const markerView = new AdvancedMarkerElement({
          map,
          position: place.location,
          title: place.displayName,
        });

        if (place.location) {
          bounds.extend(place.location);
        }
        console.log(place.internationalPhoneNumber);
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds);
        console.log("fitbounds");
      }
    } else {
      console.log("No results");
    }
  } catch (error) {
    console.error("Error searching for places:", error);
  }
}

onMounted(() => {
  initMap();
});
</script>
<style scoped></style>
