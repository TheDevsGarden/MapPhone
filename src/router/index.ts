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
    name: "FolderPage",
    component: () => import("../views/FolderPage.vue"),
    props: (route) => ({
      id: route.params.id,
      ...route.query,
    }),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
