import axios from "axios";

const service = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? "" : "https://apis.juhe.cn",
  timeout: 5000,
  withCredentials: false,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
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
