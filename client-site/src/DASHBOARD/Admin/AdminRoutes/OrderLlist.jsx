

import { useEffect, useState } from 'react';
import axios from 'axios';
// import Ordertable from './ordertable';
import OrderTable from './ordertable';
const OrderLlist = () => {
    const [monthlyRevenue, setMonthlyRevenue] = useState(0);
    const [weeklyRevenue, setWeeklyRevenue] = useState(0);
  
    useEffect(() => {
      // Fetch monthly revenue from the backend
      axios.get('http://localhost:3000/api/revenue/monthly')  // Ensure the correct URL
        .then((response) => {
          setMonthlyRevenue(response.data.revenue);
        })
        .catch((error) => {
          console.error('Error fetching monthly revenue:', error);
        });
  
      // Fetch weekly revenue from the backend
      axios.get('http://localhost:3000/api/revenue/weekly')  // Ensure the correct URL
        .then((response) => {
          setWeeklyRevenue(response.data.revenue);
        })
        .catch((error) => {
          console.error('Error fetching weekly revenue:', error);
        });
    }, []);  // Empty dependency array ensures it runs only once on mount
  
    return (
   <div>


<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Monthly Revenue Card */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Monthly Revenue</h3>
          <p className="text-4xl font-bold text-green-500">${monthlyRevenue.toFixed(2)}</p>
        </div>
  
        {/* Weekly Revenue Card */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Weekly Revenue</h3>
          <p className="text-4xl font-bold text-blue-500">${weeklyRevenue?.toFixed(2)}</p>
        </div>
      </div>
      <div>
        <OrderTable></OrderTable>
      </div>
   </div>
    );
  };
    


export default OrderLlist;