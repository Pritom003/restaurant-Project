import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import Calendar from 'react-calendar'; // Import the calendar component
import 'react-calendar/dist/Calendar.css'; // Import default styles

const AdminProfile = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [weeklyRevenue, setWeeklyRevenue] = useState(0);
  const [yearlyRevenue, setYearlyRevenue] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyRevenue, setDailyRevenue] = useState(null);

  const updateRevenue = () => {
    // Fetch updated monthly revenue
    axios.get('http://localhost:3000/api/revenue/monthly')
      .then((response) => {
        setMonthlyRevenue(response.data.revenue);
      })
      .catch((error) => {
        console.error('Error fetching monthly revenue:', error);
      });

    // Fetch updated weekly revenue
    axios.get('http://localhost:3000/api/revenue/weekly')
      .then((response) => {
        setWeeklyRevenue(response.data.revenue);
      })
      .catch((error) => {
        console.error('Error fetching weekly revenue:', error);
      });

    // Fetch updated yearly revenue
    axios.get('http://localhost:3000/api/revenue/yearly')
      .then((response) => {
        setYearlyRevenue(response.data.revenue);
      })
      .catch((error) => {
        console.error('Error fetching yearly revenue:', error);
      });
  };

  // Fetch daily revenue for the selected date
  const fetchDailyRevenue = (date) => {
    const formattedDate = date.toISOString().split('T')[0]; // Format the date (YYYY-MM-DD)
    axios.get(`http://localhost:3000/api/revenue/daily/${formattedDate}`)
      .then((response) => {
        setDailyRevenue(response.data.revenue);
      })
      .catch((error) => {
        console.error('Error fetching daily revenue:', error);
      });
  };

  useEffect(() => {
    // Initial fetch of revenue data
    updateRevenue();
  }, []);

  // Line chart data with exact dates
  const lineChartData = {
    labels: ['2024', '2024-11', '2024-11-14'], // Example date labels (replace with dynamic date data)
    datasets: [
      {
        label: 'Revenue',
        data: [yearlyRevenue, monthlyRevenue, weeklyRevenue], // Replace with real revenue data
        fill: false,
        borderColor: '#36A2EB',
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Handle date selection from the calendar
  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchDailyRevenue(date); // Fetch revenue for the selected day
  };

  return (
    <div>
   <div className='flex'>
   <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Revenue Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center">
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Yearly Revenue</h4>
            <p className="text-4xl font-bold text-green-500">${yearlyRevenue?.toFixed(2)}</p>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Monthly Revenue</h4>
            <p className="text-4xl font-bold text-green-500">${monthlyRevenue?.toFixed(2)}</p>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Weekly Revenue</h4>
            <p className="text-4xl font-bold text-blue-500">${weeklyRevenue?.toFixed(2)}</p>
          </div>
        </div>
    
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Select a Date</h3>
        <div className="flex justify-center mb-4">
          <Calendar
            onChange={handleDateChange} 
            value={selectedDate}
          />
        </div>
        {dailyRevenue !== null && (
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Revenue for {selectedDate.toLocaleDateString()}</h4>
            <p className="text-4xl font-bold text-red-500">${dailyRevenue?.toFixed(2)}</p>
          </div>
        )}
      </div>


   </div>




      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Revenue Trend (Line Chart)</h3>
        <div className="flex justify-center">
          <Line data={lineChartData} options={options} />
        </div>
      </div>

    
    </div>
  );
};

export default AdminProfile;
