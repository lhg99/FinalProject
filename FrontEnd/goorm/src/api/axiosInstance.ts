import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://final-project-app-env.eba-xdjqmujd.ap-northeast-2.elasticbeanstalk.com/api',
  timeout: 10000, 
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`, // 로컬 스토리지에서 토큰을 가져와 헤더에 포함
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default axiosInstance;