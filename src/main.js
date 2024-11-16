import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

// 修改导航守卫逻辑
router.beforeEach((to, from, next) => {
  // 如果路由存在，直接通过
  next();
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
