import axios from 'axios';
const baseURL = import.meta.env.VITE_BASE_URL;
const axiosSecure = axios.create({
  baseURL: baseURL,
  withCredentials: true, // Include credentials with the requests
});

export default axiosSecure;