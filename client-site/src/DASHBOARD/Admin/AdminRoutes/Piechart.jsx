import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const PieCharts = () => {
  const [paymentData, setPaymentData] = useState([]);

  useEffect(() => {
    fetch(" http://localhost:3000/api/orders/payment-methods")
      .then(res => res.json())
      .then(data => {
        const formattedData = data.map(item => ({
          name: item._id, // 'Cash' or 'Stripe'
          value: item.count
        }));
        setPaymentData(formattedData);
      });
  }, []);
  

  const COLORS = ["#0088FE", "#FFBB28"];

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
