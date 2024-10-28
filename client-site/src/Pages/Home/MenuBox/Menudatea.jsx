// hooks/useMenuData.js
import { useState, useEffect } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure"; // Update path as per your file structure

const MenuData = () => {
  const axiosSecure = useAxiosSecure(); // Get axios instance
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch menu data
  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get("/menu"); // Ensure this matches your API route
      setMenuData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch menu data");
    } finally {
      setLoading(false);
    }
  };

  // Function to post new menu data
  const addMenuData = async (data) => {
    try {
      const response = await axiosSecure.post("/menu", data); // Ensure this matches your API route
      setMenuData((prev) => [...prev, response.data.menuItem]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add new menu item");
    }
  };

  // Fetch menu data on component mount
  useEffect(() => {
    fetchMenuData();
  }, []);

  return { menuData, loading, error, addMenuData };
};

export default MenuData;
