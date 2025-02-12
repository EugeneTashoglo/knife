import { createRouter, createWebHistory } from "vue-router";
import ItemList from "@/components/ItemList.vue";
import KnifeDetail from "@/components/KnifeDetail.vue";
import Cart from "@/components/Cart.vue";
import Checkout from "@/components/Checkout.vue";
import AdminPanel from "@/components/Admin.vue"; // Добавляем админ-панель

const routes = [
  { path: "/", component: ItemList },
  { path: "/knife/:id", component: KnifeDetail, props: true },
  { path: "/cart", component: Cart },
  { path: "/checkout", component: Checkout },
  { path: "/admin", component: AdminPanel }, // ✅ Маршрут для админки
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
