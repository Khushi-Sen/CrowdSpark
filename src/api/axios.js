// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://crowd-spark-backend.onrender.com/api', // 
  withCredentials: true,
});

export default instance;
