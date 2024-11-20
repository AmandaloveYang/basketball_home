import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 声明全局 WeixinJSBridge 对象
/* global WeixinJSBridge */

Vue.use(ElementUI);

// 检测是否在微信浏览器中打开
const isWeixinBrowser = () => {
  return /MicroMessenger/i.test(navigator.userAgent);
};

// 关闭微信浏览器
const closeWindow = () => {
  if (typeof WeixinJSBridge !== 'undefined') {
    WeixinJSBridge.call('closeWindow');
  } else {
    // 如果 WeixinJSBridge 未定义，等待加载完成
    document.addEventListener(
      'WeixinJSBridgeReady',
      function () {
        WeixinJSBridge.call('closeWindow');
      },
      false,
    );
  }
};

// 修改导航守卫逻辑
router.beforeEach((to, from, next) => {
  if (isWeixinBrowser()) {
    ElementUI.MessageBox.alert('请复制到浏览器中打开该网站', '提示', {
      confirmButtonText: '确定',
      callback: () => {
        closeWindow();
      },
    });
  } else {
    next();
  }
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
