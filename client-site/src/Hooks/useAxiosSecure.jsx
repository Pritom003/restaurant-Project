// hooks/useAxiosSecure.js
import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "https://restourantbackend.vercel.app/api", // Your backend URL
  // withCredentials: true // Uncomment if using cookies or sessions
});

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;
