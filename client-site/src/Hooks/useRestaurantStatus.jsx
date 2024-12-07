import { useState, useEffect } from 'react';

// Custom hook to check if the restaurant is open
const useRestaurantStatus = () => {
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(null); // Start with null while loading
  const [restaurantData, setRestaurantData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantStatus = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/restaurant/status');
        const data = await response.json();
        setRestaurantData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurant status:', error);
        setLoading(false);
      }
    };

    fetchRestaurantStatus();
  }, []);

  useEffect(() => {
    if (restaurantData) {
      const { openingTime, closingTime, isOpen } = restaurantData;

      // Get the current time in Bangladesh (Dhaka timezone)
      const bdTime = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' });
      const currentTime = new Date(bdTime);

      // Convert the opening and closing times to Date objects for comparison
      const [openingHours, openingMinutes] = openingTime.split(":").map(Number);
      const [closingHours, closingMinutes] = closingTime.split(":").map(Number);

      const openingDate = new Date(currentTime);
      openingDate.setHours(openingHours, openingMinutes, 0, 0);

      const closingDate = new Date(currentTime);
      closingDate.setHours(closingHours, closingMinutes, 0, 0);

      // Check if the current time is within the opening and closing times
      const isWithinTimeRange = currentTime >= openingDate && currentTime <= closingDate;

      // If isOpen is false or the current time is outside of open hours, the restaurant is closed
      if (isOpen && isWithinTimeRange) {
        setIsRestaurantOpen(true);
      } else {
        setIsRestaurantOpen(false);
      }
    }
  }, [restaurantData]);

  return { 
    isRestaurantOpen, 
    loading, 
    openingTime: restaurantData ? restaurantData.openingTime : null, 
    closingTime: restaurantData ? restaurantData.closingTime : null 
  };
};

export default useRestaurantStatus;
