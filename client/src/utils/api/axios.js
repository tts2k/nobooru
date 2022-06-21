import axios from "axios";

const client = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL + "/api",
  timeout: 1000,
  withCredentials: true
})

export default client;
