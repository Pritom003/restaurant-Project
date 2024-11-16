import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { FaCalendarDay, FaCalendarWeek, FaCalendarAlt } from 'react-icons/fa';

const AdminProfile = () => {
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [yearlyRevenue, setYearlyRevenue] = useState(0);

  const fetchRevenueData = async () => {
    try {
      // Fetch daily, weekly, monthly, and yearly revenue
      const dailyResponse = await axios.get('http://localhost:3000/api/revenue/daily');
      const weeklyResponse = await axios.get('http://localhost:3000/api/revenue/weekly');
      const monthlyResponse = await axios.get('http://localhost:3000/api/revenue/monthly');
      const yearlyResponse = await axios.get('http://localhost:3000/api/revenue/yearly');

      // Set state based on API responses
      setDailyRevenue(dailyResponse.data.revenue || []);
      setWeeklyRevenue(weeklyResponse.data.revenue || 0);
      setMonthlyRevenue(monthlyResponse.data.revenue || []);
      setYearlyRevenue(yearlyResponse.data.revenue || 0);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  // Format daily data with weekdays
  const dailyLabels = Array.isArray(dailyRevenue) && dailyRevenue.length > 0 
    ? dailyRevenue?.map((day) => {
        const date = new Date(day.date);
        return `${date.toLocaleDateString('en-US', { weekday: 'short' })}, ${date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })}`;
      })
    : [];

  // Line chart data for daily trends
  const dailyChartData = {
    labels: dailyLabels,
    datasets: [
      {
        label: 'Daily Revenue',
        data: Array.isArray(dailyRevenue) && dailyRevenue.length > 0 
          ? dailyRevenue?.map((day) => day.totalRevenue)
          : [],
        borderColor: '#4CAF50',
        tension: 0.4,
        fill: true,
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
      },
    ],
  };

  // Line chart data for weekly trends
  const weeklyChartData = {
    labels: ['Week 1'],  // Single label for week
    datasets: [
      {
        label: 'Weekly Revenue',
        data: [weeklyRevenue || 0],  // Default to 0 if no data
        borderColor: '#2196F3',
        tension: 0.4,
        fill: true,
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
      },
    ],
  };

  // Line chart data for monthly trends
  const monthlyChartData = {
    labels: Array.isArray(monthlyRevenue) && monthlyRevenue.length > 0 
      ? monthlyRevenue?.map((month) => month.monthName)
      : [],
    datasets: [
      {
        label: 'Monthly Revenue',
        data: Array.isArray(monthlyRevenue) && monthlyRevenue.length > 0 
          ? monthlyRevenue?.map((month) => month.totalRevenue)
          : [],
        borderColor: '#FFC107',
        tension: 0.4,
        fill: true,
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
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

  return (
    <div className="p-6">
      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaCalendarDay className="text-4xl text-blue-500 mr-4" />
          <div>
            <h4 className="text-lg font-semibold text-gray-700">Daily Revenue</h4>
            <p className="text-2xl font-bold text-green-500">
              ${Array.isArray(dailyRevenue) && dailyRevenue.length > 0 
                ? dailyRevenue?.reduce((sum, day) => sum + day.totalRevenue, 0).toFixed(2)
                : '0.00'}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaCalendarWeek className="text-4xl text-indigo-500 mr-4" />
          <div>
            <h4 className="text-lg font-semibold text-gray-700">Weekly Revenue</h4>
            <p className="text-2xl font-bold text-green-500">
              ${weeklyRevenue ? weeklyRevenue.toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaCalendarAlt className="text-4xl text-yellow-500 mr-4" />
          <div>
            <h4 className="text-lg font-semibold text-gray-700">Monthly Revenue</h4>
            <p className="text-2xl font-bold text-green-500">
              ${Array.isArray(monthlyRevenue) && monthlyRevenue.length > 0
                ? monthlyRevenue?.reduce((sum, month) => sum + month.totalRevenue, 0).toFixed(2)
                : '0.00'}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaCalendarAlt className="text-4xl text-red-500 mr-4" />
          <div>
            <h4 className="text-lg font-semibold text-gray-700">Yearly Revenue</h4>
            <p className="text-2xl font-bold text-green-500">${yearlyRevenue?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Daily Trends</h4>
          <Line data={dailyChartData} options={options} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Weekly Trends</h4>
          <Line data={weeklyChartData} options={options} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Monthly Trends</h4>
          <Line data={monthlyChartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
