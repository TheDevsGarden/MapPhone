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

      <div id="toggleShowTree" v-if="editMenuStructureBool === false">
        <div id="placeInfo" v-if="placeData">
          <!-- <h2>{{ placeData.name }}</h2> -->
          <h2>{{ placeData.name }}</h2>
          <p>Phone: {{ placeData.phoneNumber }}</p>
          <p>Address: {{ placeData.address }}</p>
          <p>Website: {{ placeData.website }}</p>
        </div>
        <div id="menuStructure" v-if="placeData">
          <h5>To navigate this phone line, use the following menu:</h5>
          <ion-button @click="toggleEditMenuStructureBool">Edit this menu</ion-button>
          <TreeItem :model="placeData.menuStructure"></TreeItem>
        </div>
      </div>

      <div id="editing" v-if="editMenuStructureBool === true">
        <div id="placeInfo" v-if="placeData">
          <!-- <h2>{{ placeData.name }}</h2> -->
          <h2>{{ placeData.name }}</h2>
          <p>Phone: {{ placeData.phoneNumber }}</p>
          <p>Address: {{ placeData.address }}</p>
          <p>Website: {{ placeData.website }}</p>
        </div>
        <div id="menuStructure" v-if="placeData">
          <h5>To navigate this phone line, use the following menu:</h5>
          <ion-button @click="toggleEditMenuStructureBool">Toggle Editing</ion-button>
          <ion-button @click="save" v-if="editMenuStructureBool === true">Save</ion-button>
          <!-- <ion-button @click="cancel" v-if="editMenuStructureBool === true">Cancel</ion-button> -->
          <EditTreeItem :model="placeData.menuStructure"></EditTreeItem>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonButton, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonIcon, IonItem, IonList, IonLabel, onIonViewWillEnter } from "@ionic/vue";
import { useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { supabase } from "../shared/services/supabase";
import { chevronUp, chevronDown, chevronUpOutline, chevronDownOutline } from "ionicons/icons";
import { addIcons } from "ionicons";

//tree items from guide
import TreeItem from "../modules/ExtensionTree/components/TreeItem.vue";
import EditTreeItem from "../modules/ExtensionTree/components/EditTreeItem.vue";

const route = useRoute();
const placeData = ref<PlaceData | null>(null);
const editMenuStructureBool = ref(true);
console.log(editMenuStructureBool);

function toggleEditMenuStructureBool() {
  editMenuStructureBool.value = !editMenuStructureBool.value;
  console.log("edit menu structure bool:" + editMenuStructureBool.value); //does not console log anything
}

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

function save() {
  if (placeData.value) {
    const updatedMenuStructure = placeData.value.menuStructure;
    console.log("Save clicked", updatedMenuStructure);

    // Update the menu structure in the database
    supabase
      .from("places")
      .update({ menu_structure: updatedMenuStructure })
      .eq("places_id", props.id)
      .then(({ data, error }) => {
        if (error) {
          console.error("Error updating menu structure:", error);
        } else {
          console.log("Menu structure updated successfully:", data);
          toggleEditMenuStructureBool(); // Exit edit mode
        }
      });
  }
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

function cancel() {
  // Implement cancel functionality here
  console.log("Cancel clicked");
}

async function checkAndFetchPlaceData() {
  try {
    // Check if the place exists in Supabase
    const { data, error } = await supabase.from("places").select("id").eq("places_id", props.id).single();
    editMenuStructureBool.value = false;

    if (error && error.code !== "PGRST116") {
      editMenuStructureBool.value = false;
      throw error;
    }

    if (!data) {
      // Call Google Places API
      const placeDetails = await fetchGooglePlaceDetails(props.id);

      // Prepare data for Supabase insertion
      const placeData = {
        places_id: props.id,
        name: placeDetails.name || null,
        display_name: placeDetails.displayName || null,
        types: placeDetails.types || null,
        national_phone_number: placeDetails.nationalPhoneNumber || null,
        international_phone_number: placeDetails.internationalPhoneNumber || null,
        formatted_address: placeDetails.formattedAddress || null,
        address_components: placeDetails.addressComponents || null,
        country: placeDetails.country || null,
        state_province: placeDetails.stateProvince || null,
        city: placeDetails.city || null,
        plus_code: placeDetails.plusCode || null,
        location: placeDetails.location || null,
        rating: placeDetails.rating || null,
        google_maps_uri: placeDetails.googleMapsUri || null,
        website_uri: placeDetails.websiteUri || null,
        regular_opening_hours: placeDetails.regularOpeningHours || null,
        current_opening_hours: placeDetails.currentOpeningHours || null,
        business_status: placeDetails.businessStatus || null,
        user_rating_count: placeDetails.userRatingCount || null,
        icon_mask_base_uri: placeDetails.iconMaskBaseUri || null,
        icon_background_color: placeDetails.iconBackgroundColor || null,
        editorial_summary: placeDetails.editorialSummary || null,
        accessibility_options: placeDetails.accessibilityOptions || null,
        phone_number: placeDetails.phoneNumber || null,
        address: placeDetails.address || null,
        website: placeDetails.website || null,
        latitude: placeDetails.latitude || null,
        longitude: placeDetails.longitude || null,
        menu_structure: null, // Leave menu_structure as null
      };

      // Insert data into Supabase
      const { data: insertedData, error: insertError } = await supabase.from("places").insert(placeData).select().single();

      if (insertError) throw insertError;

      // Update placeData.value with the inserted data
      if (insertedData) {
        placeData.value = {
          id: insertedData.id,
          placesId: insertedData.places_id,
          name: insertedData.name,
          types: insertedData.types,
          phoneNumber: insertedData.phone_number,
          address: insertedData.address,
          website: insertedData.website,
          latitude: insertedData.latitude,
          longitude: insertedData.longitude,
          menuStructure: insertedData.menu_structure,
        };
      }
    } else {
      // get the data from SQL table
      try {
        const { data, error } = await supabase.from("places").select("id, places_id, name, types, phone_number, address, website, latitude, longitude, menu_structure").eq("places_id", props.id).single(); //props.id

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

          //treeData.value = data.menu_structure;
          //console.log(treeData.value);
        }

        //console.log("Place data:", placeData.value);
        //console.log("Tree data:", treeData.value);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  } catch (error) {
    console.error("Error in checkAndFetchPlaceData:", error);
    // Handle the error appropriately (e.g., show an error message to the user)
  }
}

async function fetchGooglePlaceDetails(placeId: string) {
  // Replace 'YOUR_API_KEY' with your actual Google Places API key
  const apiKey = "AIzaSyDoHQQnw_Hl-i_NYkJyOa7tqUvMoHnvW5Y";
  //const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,geometry,website,types,rating,user_ratings_total&key=${apiKey}`;

  const url = `https://places.googleapis.com/v1/places/${placeId}?fields=id&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      const result = data.result;
      return {
        name: result.name,
        formattedAddress: result.formatted_address,
        phoneNumber: result.formatted_phone_number,
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        website: result.website,
        types: result.types,
        rating: result.rating,
        userRatingCount: result.user_ratings_total,
        // Add more fields as needed
      };
    } else {
      throw new Error(`Google Places API error: ${data.status}`);
    }
  } catch (error) {
    console.error("Error fetching place details:", error);
    throw error;
  }
}

onIonViewWillEnter(checkAndFetchPlaceData);
</script>

<style scoped></style>
