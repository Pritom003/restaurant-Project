import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const AcceptOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending orders on component mount
  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/orders/pending");
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pending orders:", error);
        setLoading(false);
      }
    };
    fetchPendingOrders();
  }, []);

 // Handle adding preparation time and updating order status
 const handleUpdateOrder = async (orderId, time) => {
  // SweetAlert2 permission check before updating the order
  Swal.fire({
    title: 'Are you sure?',
    text: `Do you want to set the preparation time for Order #${orderId}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Update!',
    cancelButtonText: 'No, Cancel',
    reverseButtons: true
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ time, status: "Preparing" }),
        });

        if (response.ok) {
        await response.json();
          Swal.fire({
            title: 'Order Updated!',
            text: `Order #${orderId} status updated to Preparing.`,
            icon: 'success',
          });
          setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'There was an issue updating the order.',
            icon: 'error',
          });
        }
      } catch (error) {
        console.error("Error updating order status:", error);
        Swal.fire({
          title: 'Failed!',
          text: 'Failed to update order status.',
          icon: 'error',
        });
      }
    }
  });
};


  if (loading) {
    return <div>Loading pending orders...</div>;
  }

  return (
    <div className="p-4">
      <h3 className="text-2xl font-bold mb-4">Pending Orders</h3>
      {orders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 shadow-md bg-white"
            >
              <h4 className="text-xl font-semibold mb-2">Order #{order._id}</h4>
              <p><strong>User Email:</strong> {order.userEmail}</p>
              <p><strong>Total Price:</strong> £{order.totalPrice}</p>
              <p><strong>status</strong> £{order.status}</p>
              <h5 className="font-medium mt-3">Items:</h5>
              
                {order.items.map((item, index) => (
                  <span key={index}>
                    {item.name} (x{item.quantity}) - £{item.price}
                  </span>
                ))}
              
              <div className="mt-3">
                <h5 className="font-medium">Set Preparation Time:</h5>
                <div className="flex gap-3 flex-wrap space-x-2">
                  <button
                    onClick={() => handleUpdateOrder(order._id, 15)}
                    className="text-green-800 border-green-500 border-2 hover:border-blue-700 p-2"
                  >
                   15 min
                  </button>
                  <button
                    onClick={() => handleUpdateOrder(order._id, 25)}
                     className="text-green-800 border-green-500 border-2 hover:border-blue-700 p-2"
                  >
                    25 min
                  </button>
                  <button
                    onClick={() => handleUpdateOrder(order._id, 30)}
                     className="text-green-800 border-green-500 border-2 hover:border-blue-700 p-2"
                  >
                    30 min
                  </button>
                  <button
                    onClick={() => handleUpdateOrder(order._id, 45)}
                    className="text-green-800 border-green-500 border-2 hover:border-blue-700 p-2"
                  >
                    45 min
                  </button>
                  <button
                    onClick={() => handleUpdateOrder(order._id, 50)}
                    className="text-green-800 border-green-500 border-2 hover:border-blue-700 p-2"
                  >
                    50 min
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No pending orders found.</p>
      )}
    </div>
  );
};

export default AcceptOrder;
