import axios from "axios";
const http = axios.create({
  baseURL: process.env.ARVAN_BASE_URL,
});

http.interceptors.request.use(function (config) {
  config.headers.Authorization = process.env.ARVAN_API_KEY;
  return config;
});

export default http;
