import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const PieCharts = () => {
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/v3/api/orders/order-type")
      .then((res) => res.json())
      .then((data) => {
        setOrderData(data); // Set the data for online vs pickup orders
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Define the colors for the Pie chart
  const COLORS = ["#856d1e", "#85631e"]; // Blue for online, yellow for pickup

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={orderData}
        cx="50%"
        cy="50%"
        outerRadius={100}
        dataKey="value"
        label
      >
        {orderData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default PieCharts;