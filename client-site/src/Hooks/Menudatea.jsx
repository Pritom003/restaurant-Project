import { useState, useEffect } from "react";
import useAxiosSecure from "./useAxiosSecure"; // Adjust path as needed

const MenuData = () => {
  const axiosSecure = useAxiosSecure();
  const [menuData, setMenuData] = useState([]);
  const [categories, setCategories] = useState([]); // Store unique categories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get("/menu"); // Ensure correct API route
      setMenuData(response.data);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(response.data.map((item) => item.category)),
      ];
      setCategories(uniqueCategories);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch menu data");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchMenuData();
  }, []);

  return { menuData, categories, loading, error,axiosSecure };
};

export default MenuData;
