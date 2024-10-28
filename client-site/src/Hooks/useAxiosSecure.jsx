// hooks/useAxiosSecure.js
import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "http://localhost:3000/api", // Your backend URL
  // withCredentials: true // Uncomment if using cookies or sessions
});

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;
