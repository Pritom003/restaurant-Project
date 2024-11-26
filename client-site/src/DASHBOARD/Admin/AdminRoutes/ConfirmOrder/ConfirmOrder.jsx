import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000'); // Replace with your backend URL

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch initial orders
    axios.get('/api/orders').then((response) => setOrders(response.data));

    // Listen for new orders via WebSocket
    socket.on('newOrder', (newOrder) => {
      setOrders((prevOrders) => [...prevOrders, newOrder]);
    });

    return () => socket.disconnect();
  }, []);

  const handleConfirmOrder = async (orderId, preparationTime) => {
    try {
      await axios.patch(`/api/orders/${orderId}`, {
        preparationTime,
        status: 'Confirmed',
      });

      socket.emit('orderConfirmed', { orderId, preparationTime });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: 'Confirmed', preparationTime }
            : order
        )
      );
    } catch (error) {
      console.error('Error confirming order:', error);
    }
  };

  return (
    <div>
      <h2>New Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            <p>Order ID: {order._id}</p>
            <p>Customer: {order.userEmail}</p>
            <p>Status: {order.status}</p>
            {order.status === 'Pending' && (
              <div>
                <button onClick={() => handleConfirmOrder(order._id, 15)}>
                  Confirm (15 min)
                </button>
                <button onClick={() => handleConfirmOrder(order._id, 30)}>
                  Confirm (30 min)
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminOrders;
