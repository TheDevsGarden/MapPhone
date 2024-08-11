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

      <div id="supabase">
        <p>Data from Supabase:</p>
        <!-- <ul v-if="placeData.length">
          <li v-for="place in placeData" :key="place.place_name">
            <strong>{{ place.place_name }}</strong>
            <p>Types: {{ place.place_types }}</p>
          </li>
        </ul>
        <div v-else>
          <p>No data available, would you like to create it?</p>
          <ion-button>Add</ion-button>
        </div>

        //display drop down list for place in places -->

        <ion-list>
          <template v-for="item in flattenedTree" :key="item.id">
            <ion-item @click="toggleItem(item)" :style="{ paddingLeft: `${item.level * 20}px` }" button>
              <ion-label>
                <ion-icon :icon="item.expanded ? 'chevron-up-outline' : 'chevron-down-outline'" slot="start" v-if="item.hasChildren"></ion-icon>
              </ion-label>
              <h2>{{ item.name }}</h2>
            </ion-item>
          </template>
        </ion-list>
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

addIcons({
  "chevron-up": chevronUp,
  "chevron-down": chevronDown,
  "chevron-up-outline": chevronUpOutline,
  "chevron-down-outline": chevronDownOutline,
});

const route = useRoute();

const props = defineProps<{
  id: string;
  name?: string;
  phoneNumber?: string;
  address?: string;
}>();

//const placeData = ref<{ place_name: string; place_types: string }[]>([]);

/* onMounted(async () => {
  try {
    const { data, error } = await supabase.from("map_phone_region_all_rows2").select("place_name, place_types").eq("places_root_id", "ChIJj61dQgK6j4AR4GeTYWZsKWw"); //props.id

    console.log(data);

    if (error) throw error;
    placeData.value = data || [];
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}); */

interface TreeItem {
  id: string;
  name: string;
  parentId: string | null;
  level: number;
  expanded: boolean;
  hasChildren: boolean;
}

const placeData = ref<TreeItem[]>([]);

onMounted(async () => {
  try {
    const { data, error } = await supabase.from("map_phone_region_all_rows2").select("item_id, item_name, parent_id, level, expanded, haschildren").eq("places_root_id", "ChIJj61dQgK6j4AR4GeTYWZsKWw").order("item_id"); //props.id

    console.log(data);

    if (error) throw error;

    placeData.value = data.map((item) => ({
      id: item.item_id.toString(),
      name: item.item_name || "",
      parentId: item.parent_id ? item.parent_id.toString() : null,
      level: item.level,
      expanded: item.expanded || false,
      hasChildren: item.haschildren || false,
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

const flattenedTree = computed(() => {
  return placeData.value.filter((item) => item.parentId === null || placeData.value.find((parent) => parent.id === item.parentId)?.expanded);
});

const toggleItem = async (item: TreeItem) => {
  if (item.hasChildren) {
    item.expanded = !item.expanded;
    try {
      const { error } = await supabase.from("map_phone_region_all_rows2").update({ expanded: item.expanded }).eq("item_id", parseInt(item.id)).eq("places_root_id", "ChIJj61dQgK6j4AR4GeTYWZsKWw"); //props.id

      if (error) throw error;
    } catch (error) {
      console.error("Error updating item:", error);
    }
  }
};
</script>

<style scoped></style>
