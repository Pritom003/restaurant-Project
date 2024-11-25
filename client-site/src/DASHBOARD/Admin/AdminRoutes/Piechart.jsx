import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const PieCharts = () => {
  const [paymentData, setPaymentData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/orders/payment-methods")
      .then((res) => res.json())
      .then((data) => {
        // Format the data to match PieChart requirements
        let cashCount = 0;
        let stripeCount = 0;

        // Loop through the returned data to separate the counts for each payment method
        data.forEach((item) => {
          if (item._id === "cash") {
            cashCount += item.count;
          } else if (item._id === "stripe") {
            stripeCount += item.count;
          }
        });

        // Format the data for the PieChart
        const formattedData = [
          { name: "Cash", value: cashCount },
          { name: "Stripe", value: stripeCount },
        ];

        // Set the state with the formatted data
        setPaymentData(formattedData);
      })
      .catch((error) => {
        console.error('Error fetching payment data:', error);
      });
  }, []);

  const COLORS = ["#0088FE", "#FFBB28"]; // Define colors for "Cash" and "Stripe"
  
  // If there is no data yet, you can show a loading message
  if (paymentData.length === 0) {
    return <div>Loading payment method statistics...</div>;
  }

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={paymentData}
        cx="50%"
        cy="50%"
        outerRadius={100}
        dataKey="value"
        label
      >
        {/* Color each segment based on the defined colors */}
        {paymentData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default PieCharts;
