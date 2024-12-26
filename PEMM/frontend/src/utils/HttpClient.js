import axios from "axios";
import join from "url-join";
import {
  apiUrl,
  NOT_CONNECT_NETWORK,
  NETWORK_CONNECTION_MESSAGE,
} from "../constants/index.js";

const isAbsoluteURLRegex = /^(?:\w+:)\/\//;

axios.interceptors.request.use(async (config) => {
  if (!isAbsoluteURLRegex.test(config.url)) {
    config.url = join(apiUrl, config.url);
  }
  config.timeout = 600000; // 10 Second
  return config;
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(JSON.stringify(error, undefined, 2));

    // จัดการกรณีที่ timeout
    if (error.code === 'ECONNABORTED') {
      console.error("Request timed out");
      return Promise.reject({
        code: 'TIMEOUT',
        message: "Request timed out after 10 seconds",
      });
    }

    // ตรวจสอบกรณีไม่มี response จาก server (เช่น network error)
    if (!error.response) {
      return Promise.reject({
        code: NOT_CONNECT_NETWORK,
        message: NETWORK_CONNECTION_MESSAGE,
      });
    }

    // จัดการกรณีเกิด error จาก server เช่น 404 หรือ 500
    return Promise.reject({
      code: error.response.status,
      message: error.response.data.message || 'An error occurred',
    });
  }
);


export const httpClient = axios;
