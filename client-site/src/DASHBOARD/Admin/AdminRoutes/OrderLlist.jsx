import { useEffect, useState } from 'react';
import axios from 'axios';
import { Outlet } from 'react-router-dom';
// import OrderTable from './OrderTable';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/orders')
      .then((response) => setOrders(response.data))
      .catch((error) => console.error('Error fetching orders:', error));
  }, []);

  return (
    <div>
      <div className="overflow-x-auto mt-8">
        {/* <OrderTable orders={orders} /> */}
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default OrderList;
