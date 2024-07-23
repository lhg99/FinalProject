import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://final-project-app-env.eba-xdjqmujd.ap-northeast-2.elasticbeanstalk.com/api',
  withCredentials: true,
  timeout: 10000, // 요청 시간 초과 설정 (10초)
});

export default axiosInstance;
