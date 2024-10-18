<template>
  <div class="tree-item" :style="{ paddingLeft: `${depth * 16}px` }">
    <ion-item>
      <ion-icon :icon="isOpen ? caretDownOutline : caretForwardOutline" v-if="isFolder" @click="toggle" class="ion-padding-end"></ion-icon>
      <ion-label @click="toggle"> {{ model.name }}: {{ model.menuNumber }} </ion-label>
    </ion-item>
    <ion-list v-show="isOpen" v-if="isFolder">
      <TreeItem v-for="(child, index) in model.children" :key="index" :model="child" :depth="depth + 1" />
    </ion-list>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { IonItem, IonLabel, IonIcon, IonList } from "@ionic/vue";
import { caretForwardOutline, caretDownOutline } from "ionicons/icons";

const props = defineProps<{
  model: {
    name: string;
    children?: { name: string; menuNumber?: number }[];
    menuNumber?: number;
  };
  depth?: number;
}>();

const isOpen = ref(false);
const isFolder = computed(() => {
  return props.model.children && props.model.children.length;
});

function toggle() {
  isOpen.value = !isOpen.value;
}

const depth = props.depth || 0;
</script>

<style scoped>
.tree-item {
  transition: padding-left 0.2s ease;
}
</style>
