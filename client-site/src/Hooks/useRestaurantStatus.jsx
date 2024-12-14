import { useState, useEffect } from "react";

// Custom hook to check if the restaurant is open based on time and isOpen status
const useRestaurantStatus = () => {
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(null); // Start with null while loading
  const [loading, setLoading] = useState(true);
  const [openingTime, setOpeningTime] = useState(null);
  const [closingTime, setClosingTime] = useState(null);

  useEffect(() => {
    const fetchRestaurantStatus = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/restaurant/status"
        );
        const data = await response.json();
        const { NewopeningTime, NewclosingTime, isOpen } = data;

        // Set opening and closing times to state
        setOpeningTime(NewopeningTime);
        setClosingTime(NewclosingTime);

        // Convert times to total minutes since midnight
        const [openingHours, openingMinutes] =
          NewopeningTime.split(":").map(Number);
        const [closingHours, closingMinutes] =
          NewclosingTime.split(":").map(Number);

        const openingTotalMinutes = openingHours * 60 + openingMinutes;
        const closingTotalMinutes = closingHours * 60 + closingMinutes;

        // Get the current time as total minutes since midnight
        const currentTime = new Date();
        const currentHours = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();
        const currentTotalMinutes = currentHours * 60 + currentMinutes;

        // Check if the current time is within the opening and closing times
        const isWithinTimeRange =
          currentTotalMinutes >= openingTotalMinutes &&
          currentTotalMinutes <= closingTotalMinutes;

        // If isOpen is true and the current time is within open hours, the restaurant is open
        setIsRestaurantOpen(isOpen && isWithinTimeRange);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurant status:", error);
        setLoading(false);
      }
    };

    fetchRestaurantStatus();
  }, []);

  return {
    isRestaurantOpen,
    loading,
    openingTime,
    closingTime,
  };
};

export default useRestaurantStatus;
