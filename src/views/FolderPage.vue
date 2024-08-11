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
        <!-- <template v-for="(item, index) in flattenedTree" :key="item.id">
            <ion-item @click="toggleItem(item)" :style="{ paddingLeft: `${item.level * 20}px` }" button>
              <ion-label>
                <ion-icon :icon="item.expanded ? 'chevron-up-outline' : 'chevron-down-outline'" slot="start" v-if="item.hasChildren"></ion-icon>
              </ion-label>
              <h2>{{ index === 0 ? item.name : `menu option ${item.menuNumber}` }}</h2>
            </ion-item>
          </template> -->

        <!--         <div v-for="item in placeData" :key="item.id">
          <ion-list>
            <ion-item> {{ item.menuNumber }} | {{ item.name }} </ion-item>
          </ion-list>
        </div> -->

        <ul>
          <TreeItem class="item" :model="treeData"></TreeItem>
        </ul>
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

interface TreeItem1 {
  id: string;
  name: string;
  parentId: string | null;
  level: number;
  expanded: boolean;
  hasChildren: boolean;
  menuNumber: number;
}

const placeData = ref<TreeItem1[]>([]);

onMounted(async () => {
  try {
    const { data, error } = await supabase.from("map_phone_region_all_rows2").select("item_id, item_name, menu_number, parent_id, level, expanded, haschildren").eq("places_root_id", "ChIJj61dQgK6j4AR4GeTYWZsKWw").order("item_id"); //props.id

    console.log(data);

    if (error) throw error;

    placeData.value = data.map((item) => ({
      id: item.item_id.toString(),
      name: item.item_name || "",
      parentId: item.parent_id ? item.parent_id.toString() : null,
      level: item.level,
      expanded: Boolean(item.expanded),
      hasChildren: Boolean(item.haschildren),
      menuNumber: item.menu_number,
    }));

    console.log(placeData.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

const toggleItem = (item: TreeItem1) => {
  item.expanded = !item.expanded;
};

//tree item tests

const treeData = ref({
  name: "514-555-5555",
  children: [
    { name: "hello" },
    { name: "world" },
    {
      name: "child folder",
      children: [
        {
          name: "child folder",
          children: [{ name: "hello" }, { name: "world" }],
        },
        { name: "hello" },
        { name: "world" },
        {
          name: "child folder",
          children: [{ name: "hello" }, { name: "world" }],
        },
      ],
    },
  ],
});
</script>

<style scoped></style>
