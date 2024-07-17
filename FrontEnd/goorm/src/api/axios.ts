import axios, { Axios } from "axios";

const client: Axios = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true
})

export default axios;