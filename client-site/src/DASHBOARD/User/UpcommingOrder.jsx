import { useState, useEffect } from 'react';
import useAuth from '../../Hooks/useAuth';

const UpcomingOrders = () => {
  const { user } = useAuth(); // Assuming user data is stored in context
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return; // Ensure user email is available
    
    const fetchUserOrders = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/orders/user?email=${user.email}`);
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user orders:", error);
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [user?.email]);

  // Filter orders with 'prepare' status
  const filteredOrders = orders.filter(order => order.status === 'Preparing');

  // Calculate remaining time in mm:ss format
  const calculateRemainingTime = (updatedAt, preparationTime) => {
    const now = new Date();
    const updatedTime = new Date(updatedAt);
    const totalSeconds = preparationTime * 60;
    const elapsedSeconds = Math.floor((now - updatedTime) / 1000);
    const remainingSeconds = totalSeconds - elapsedSeconds;

    if (remainingSeconds <= 0) {
      return "00:00"; // Time expired
    }

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // Handle canceling the order
  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Canceled' }),
      });

      if (response.ok) {
        await response.json();
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: 'Canceled' } : order
          )
        );
      }
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  // This effect will handle the countdown refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prevOrders) => {
        return prevOrders.map((order) => ({
          ...order,
          remainingTime: calculateRemainingTime(order.updatedAt, order.time),
        }));
      });
    }, 1000); // Update every second

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [orders]);

  if (loading) {
    return <div>Loading your orders...</div>;
  }

  return (
    <div className="p-4 text-black">
      <h3 className="text-2xl font-bold mb-4">Your Upcoming Orders</h3>
      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 justify-center align-middle items-center sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => {
            const remainingTime = calculateRemainingTime(order.updatedAt, order.time);
            const remainingMinutes = parseInt(remainingTime.split(':')[0]);
            const canCancel = remainingMinutes > 0;

            return (
              <div
                key={order._id}
                className="border rounded-lg p-4 shadow-md bg-orange-100 w-full"
              >
                <div className="mt-3 text-center">
                  Remaining Time:{" "}
                  <h5 className="font-medium text-4xl font-chewy text-green-600">
                    {remainingTime}
                  </h5>
                  <p>{order.status}</p>
                </div>
                <p><strong>User Email:</strong> {order.userEmail}</p>
                
                <p><strong>Preparation Time:</strong> {order.time} minutes</p>
                <h5 className="font-medium mt-3">Items:</h5>
                <ul>
                {/* <h5 className="font-medium mt-3">Items: {order?.item?.name}</h5> */}
              
              {order.items.map((item, index) => (
                <ul key={index}>
<li> {item?.name} </li>
  <li className="text-xs font-bold" >
<span className='text-lg'>    special Platter</span>
    {item.subItems.length > 0 &&
      item.subItems?.map((subItem) => subItem.name).join(", ")}
    {item.items?.map((name) => name.name).join(", ")}
    (x{item.quantity}) - £{item.price ? Number(item.price).toFixed(2) : 0}
  </li></ul>
))} <p className='text-xl text-end'><strong>Total Price:</strong> £{(order.totalPrice)?.toFixed(2)}</p></ul>

                

                {order.status !== 'Canceled' && canCancel && (
                  <button
                    className="mt-4 p-2 bg-red-500 text-white rounded"
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    Cancel Order
                  </button>
                )}
                {order.status === 'Canceled' && (
                  <p className="mt-2 text-red-500">Order Canceled</p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p>No upcoming orders found.</p>
      )}
    </div>
  );
};

export default UpcomingOrders;
