import { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2

const PreparingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders on component mount
  useEffect(() => {
    const fetchPreparingOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/orders/preparing"
        );
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching preparing orders:", error);
        setLoading(false);
      }
    };
    fetchPreparingOrders();
  }, []);

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
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // Auto-refresh timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((prevOrders) => [...prevOrders]); // Trigger re-render
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  const updateOrderStatus = async (orderId) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will mark the order as done",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Done it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/orders/${orderId}/expire`,
          {
            method: "PATCH",
          }
        );

        if (response.ok) {
          const updatedOrder = await response.json();
          console.log("Order status updated to Expired:", updatedOrder);
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === orderId ? { ...order, status: "Expired" } : order
            )
          );
          Swal.fire({
            title: "Order Expired!",
            text: "The order status has been updated to Expired.",
            icon: "error",
          });
        } else {
          console.error("Failed to update order status", await response.json());
        }
      } catch (error) {
        console.error("Error updating order status:", error);
      }
    }
  };
  // Add 5 more minutes to the order
  const addTimeToOrder = async (orderId) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Extend Time?",
      text: "Are you sure you want to add 5 more minutes to this order?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Add Time!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/orders/${orderId}`,
          {
            method: "PATCH",
            body: JSON.stringify({ time: 5 }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const updatedOrder = await response.json();
          console.log("5 minutes added:", updatedOrder);
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === orderId ? { ...order, time: order.time + 5 } : order
            )
          );
          Swal.fire({
            title: "Time Extended!",
            text: "5 minutes have been added to the preparation time.",
            icon: "success",
          });
        } else {
          console.error("Failed to update order time", await response.json());
        }
      } catch (error) {
        console.error("Error updating order time:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading preparing orders...</div>;
  }

  return (
    <div className="p-4 text-black">
      <h3 className="text-2xl font-bold mb-4">Preparing Orders</h3>
      {orders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 shadow-md bg-white"
            >
              <h4 className="text-xl font-semibold mb-2">
                Order #{order.orderNumber}
              </h4>
              <p>
                <strong>User Email:</strong> {order.userEmail}
              </p>
              <p>
                <strong>Total Price:</strong> £{order.totalPrice}
              </p>
              <p>
                <strong>Preparation Time:</strong> {order.time} minutes
              </p>
              <h5 className="font-medium mt-3">Items:</h5>
              <ul>
                {order.items.map((item, index) => (
                  <li className="text-xs" key={index}>
                    {item.subItems.length > 0 &&
                      item.subItems?.map((subItem) => subItem.name).join(", ")}
                    {item.items?.map((name) => name.name).join(", ")}
                    (x{item.quantity}) - £{item.price}
                  </li>
                ))}
              </ul>
              <div className="mt-3">
                <h5 className="font-medium text-red-500">
                  Remaining Time:{" "}
                  {calculateRemainingTime(order.updatedAt, order.time)}
                </h5>
                <p>{order.status}</p>
              </div>
              <div className="flex flex-wrap justify-between items-center">
                {/* Update status if time is 00:00 */}
                {/* {calculateRemainingTime(order.updatedAt, order.time) === "00:00" && ( */}
                <button
                  onClick={() => updateOrderStatus(order._id)}
                  className="mt-3 border-2 border-green-300 text-green-600 py-1 px-3 rounded"
                >
                  DONE
                </button>
                {/* )} */}

                {/* Show "+5 minutes" button if less than 5 minutes left */}
                {/* {calculateRemainingTime(order.updatedAt, order.time) !== "00:00" &&
                calculateRemainingTime(order.updatedAt, order.time).split(":")[0] < 5 && ( */}
                <button
                  onClick={() => addTimeToOrder(order._id)}
                  className="mt-3  border-2 border-blue-300 text-blue-600  py-1 px-3 rounded"
                >
                  +5 Minutes
                </button>
                {/* )} */}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No preparing orders found.</p>
      )}
    </div>
  );
};

export default PreparingOrders;
