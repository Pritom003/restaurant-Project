import { useState, useEffect } from "react";
import useAxiosSecure from "./useAxiosSecure"; // Adjust path if needed

const useMenuData = () => {
  const axiosSecure = useAxiosSecure();
  const [menuData, setMenuData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get("/menu");
      const fetchedData = response.data;

      setMenuData(fetchedData);
      console.log(fetchedData);

      // Ensure we only list unique categories
      const uniqueCategories = fetchedData.map((menu) => menu.category);
      setCategories(uniqueCategories);
      console.log(uniqueCategories);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch menu data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  return { menuData, categories, loading, error };
};

export default useMenuData;
