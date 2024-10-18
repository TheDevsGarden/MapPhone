<template>
  <div class="tree-item" :style="{ paddingLeft: `${depth * 16}px` }">
    <ion-item id="treeItemWrapper">
      <ion-icon :icon="isOpen ? caretDownOutline : caretForwardOutline" v-if="isFolder" class="ion-padding-end"></ion-icon>
      <ion-input class="ionInputName" fill="outline" v-model="model.name"></ion-input>
      <ion-input id="menuNumber" fill="outline" v-model="model.menuNumber"></ion-input>
      <div id="addRemoveButtons">
        <ion-button><ion-icon :icon="addCircleOutline"></ion-icon></ion-button>
        <ion-button><ion-icon :icon="removeCircleOutline"></ion-icon></ion-button>
      </div>
    </ion-item>
    <ion-list v-if="isFolder">
      <EditTreeItem v-for="(child, index) in model.children" :key="index" :model="child" :depth="depth + 1" />
    </ion-list>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { IonItem, IonButtons, IonButton, IonInput, IonLabel, IonIcon, IonList } from "@ionic/vue";
import { caretForwardOutline, caretDownOutline, addCircleOutline, removeCircleOutline } from "ionicons/icons";
import EditTreeItem from "./EditTreeItem.vue";

const props = defineProps<{
  model: {
    name: string;
    children?: { name: string; menuNumber?: number }[];
    menuNumber?: number;
  };
  depth?: number;
}>();

const isOpen = ref(true);
const isFolder = computed(() => {
  return props.model.children && props.model.children.length;
});

function AddItem() {}
function removeItem() {}

const depth = props.depth || 0;
</script>

<style scoped>
.tree-item {
  transition: padding-left 0.2s ease;
}

#treeItemWrapper {
  display: flex;
  align-items: center;
}

#treeItemWrapper ion-input {
  flex: 1;
}

#treeItemWrapper .ionInputName {
  flex: 4;
}

#treeItemWrapper div {
  flex: 1;
}

#addRemoveButtons {
  display: flex;
  align-items: center;
  margin-left: 1rem;
}
</style>
