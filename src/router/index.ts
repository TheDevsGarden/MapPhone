import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
const routes: Array<RouteRecordRaw> = [
  {
    path: "",
    redirect: "/Home",
  },
  {
    path: "/Home",
    name: "Home",
    component: () => import("../views/HomePage.vue"),
  },
  {
    path: "/folder/:id",
    name: "Folder",
    component: () => import("../views/FolderPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
