import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000, // 요청 시간 초과 설정 (10초)
});

export default axiosInstance;
