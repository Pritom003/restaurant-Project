import { useState, useEffect } from "react";

// Custom hook to check if the restaurant is open
const useRestaurantStatus = () => {
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(null); // Start with null while loading
  const [restaurantData, setRestaurantData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantStatus = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/restaurant/status"
        );
        const data = await response.json();
        setRestaurantData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurant status:", error);
        setLoading(false);
      }
    };

    fetchRestaurantStatus();
  }, []);
  useEffect(() => {
    if (restaurantData) {
      const { NewopeningTime, NewclosingTime, isOpen } = restaurantData;

      // Get the current time in Bangladesh (Dhaka timezone)
      const bdTime = new Date().toLocaleString("en-GB", {
        timeZone: "Asia/Dhaka",
      });
      const currentTime = new Date(bdTime);

      // Extract hours and minutes from opening and closing time strings
      const [openingHours, openingMinutes] =
        NewopeningTime.split(":").map(Number);
      const [closingHours, closingMinutes] =
        NewclosingTime.split(":").map(Number);

      // Create Date objects for opening and closing times on the current date
      const openingDate = new Date(currentTime);
      openingDate.setHours(openingHours, openingMinutes, 0, 0); // Set opening time with current date

      const closingDate = new Date(currentTime);
      closingDate.setHours(closingHours, closingMinutes, 0, 0); // Set closing time with current date

      // Check if the current time is within the opening and closing times
      const isWithinTimeRange =
        currentTime >= openingDate && currentTime <= closingDate;

      // If isOpen is true and the current time is within open hours, the restaurant is open
      if (isOpen && isWithinTimeRange) {
        setIsRestaurantOpen(true);
      } else {
        setIsRestaurantOpen(false);
      }
    }
  }, [restaurantData]);

  return {
    isRestaurantOpen,
    loadings: loading,
    openingTime: restaurantData ? restaurantData.NewopeningTime : null,
    closingTime: restaurantData ? restaurantData.NewclosingTime : null,
  };
};

export default useRestaurantStatus;
