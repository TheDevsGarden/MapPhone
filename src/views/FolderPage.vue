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
        <p>this is passed data through vue js</p>
        <strong class="capitalize">{{ name }}</strong>
        <p v-if="phoneNumber">Phone: {{ phoneNumber }}</p>
        <p v-if="address">Address: {{ address }}</p>
        <p>Google Maps ID: {{ id }}</p>
      </div>

      <div id="placeInfo" v-if="placeData">
        <h2>{{ placeData.name }}</h2>
        <p>Phone: {{ placeData.phoneNumber }}</p>
        <p>Address: {{ placeData.address }}</p>
        <p>Website: {{ placeData.website }}</p>
      </div>

      <div id="menuStructure" v-if="placeData">
        <h3>Menu Structure</h3>
        <TreeItem :model="placeData.menuStructure"></TreeItem>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonButton, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonIcon, IonItem, IonList, IonLabel } from "@ionic/vue";
import { useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { supabase } from "../shared/services/supabase";
import { chevronUp, chevronDown, chevronUpOutline, chevronDownOutline } from "ionicons/icons";
import { addIcons } from "ionicons";

//tree items from guide
import TreeItem from "../modules/ExtensionTree/components/TreeItem.vue";

const route = useRoute();

const props = defineProps<{
  id: string;
  name?: string;
  phoneNumber?: string;
  address?: string;
}>();

//tree item tests
interface MenuItem {
  name: string;
  menuNumber?: number;
  children?: MenuItem[];
}

interface PlaceData {
  id: number;
  placesId: string;
  name: string;
  displayName: string;
  types: string[];
  nationalPhoneNumber: string;
  internationalPhoneNumber: string;
  formattedAddress: string;
  addressComponents: any;
  country: string;
  stateProvince: string;
  city: string;
  plusCode: any;
  location: any;
  rating: number;
  googleMapsUri: string;
  websiteUri: string;
  regularOpeningHours: any;
  currentOpeningHours: any;
  businessStatus: string;
  userRatingCount: number;
  iconMaskBaseUri: string;
  iconBackgroundColor: string;
  editorialSummary: string;
  accessibilityOptions: any;
  menuStructure: MenuItem;
}

const placeData = ref<PlaceData | null>(null);

onMounted(async () => {
  try {
    const { data, error } = await supabase.from("places").select("id, places_id, name, types, phone_number, address, website, latitude, longitude, menu_structure").eq("places_id", "ChIJN1t_tDeuEmsRUsoyG83frY4").single(); //props.id

    if (error) throw error;

    if (data) {
      placeData.value = {
        id: data.id,
        placesId: data.places_id,
        name: data.name,
        types: data.types,
        phoneNumber: data.phone_number,
        address: data.address,
        website: data.website,
        latitude: data.latitude,
        longitude: data.longitude,
        menuStructure: data.menu_structure,
      };

      treeData.value = data.menu_structure;
      console.log(treeData.value);
    }

    console.log("Place data:", placeData.value);
    console.log("Tree data:", treeData.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

//before mounting or on ion view will enter, check if the props.id exists in supabase
// if it doesn't, call the places api and fill in a row except for the menu_strucutre, leave that null
</script>

<style scoped></style>
