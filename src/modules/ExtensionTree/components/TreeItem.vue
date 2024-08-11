<template>
  <li>
    <div :class="{ bold: isFolder }" @click="toggle" @dblclick="changeType">
      {{ model.name }}
      <span v-if="isFolder">[{{ isOpen ? "-" : "+" }}]</span>
    </div>
    <ul v-show="isOpen" v-if="isFolder">
      <TreeItem class="item" v-for="(child, index) in model.children" :key="index" :model="child" />
      <li class="add" @click="addChild">+</li>
    </ul>
    <li v-else class="add" @click="addChild">+</li>
  </li>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { IonButton } from "@ionic/vue";

const props = defineProps<{
  model: {
    name: string;
    children?: { name: string }[];
  };
}>();
/* const props = defineProps({
  model: Object
}) */

const isOpen = ref(false)
const isFolder = computed(() => {
  return props.model.children && props.model.children.length
})

function toggle() {
  isOpen.value = !isOpen.value
}

function changeType() {
  if (!isFolder.value) {
    props.model.children = []
    addChild()
    isOpen.value = true
  }
}

function addChild() {
  props.model.children.push({ name: 'new stuff' })
}
</script>
