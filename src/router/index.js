import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "@/views/HomeView.vue";
import GameView from "@/views/GameView.vue";
import RankView from "@/views/RankView.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "GameView",
    component: HomeView,
  },
  {
    path: "/game",
    name: "GameView",
    component: GameView,
  },
  {
    path: "/rank",
    name: "RankView",
    component: RankView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
