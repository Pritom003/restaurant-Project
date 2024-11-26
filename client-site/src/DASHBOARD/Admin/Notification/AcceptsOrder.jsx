import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const AcceptOrder = () => {
  const location = useLocation();
  const order = location.state?.order;

  const [time, setTime] = useState(null);
  const [status, setStatus] = useState(order?.status || 'Pending');

  const handleTimeSelect = (time) => {
    setTime(time);
  };

  const handleConfirmOrder = async () => {
    if (!time) {
      alert('Please select a time');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/orders/${order._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ time, status: 'Confirmed' }),
      });

      const updatedOrder = await response.json();

      if (response.ok) {
        setStatus('Confirmed');
        alert('Order confirmed successfully!');
      } else {
        alert('Error confirming order');
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      alert('Failed to confirm order');
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">Accept Order</h3>
      {order ? (
        <div>
          <div className="mb-4">
            <h4 className="text-lg">Order Details</h4>
            <ul className="list-none">
              {order.items.map((item, index) => (
                <li key={index} className="mb-2">
                  <p>{item.name} (x{item.quantity}) - ${item.price}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h4 className="text-lg">Select Time</h4>
            <button onClick={() => handleTimeSelect(15)} className="mr-2">15 minutes</button>
            <button onClick={() => handleTimeSelect(20)} className="mr-2">20 minutes</button>
            <button onClick={() => handleTimeSelect(40)} className="mr-2">40 minutes</button>
          </div>

          <button onClick={handleConfirmOrder} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
            Confirm Order
          </button>
        </div>
      ) : (
        <p>Order not found</p>
      )}
    </div>
  );
};

export default AcceptOrder;
