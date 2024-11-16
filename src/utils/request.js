import axios from "axios";

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url 基础地址
  timeout: 5000, // 请求超时时间
  // 添加跨域配置
  withCredentials: true,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 可以在这里添加一些通用的请求头
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    // 处理请求错误
    console.log(error);
    return Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.log("err" + error);
    return Promise.reject(error);
  },
);

export default service;
