import { useState, useEffect } from "react";
import useAuth from "../../Hooks/useAuth";

const UpcomingOrders = () => {
  const { user } = useAuth(); // Assuming user data is stored in context
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return; // Ensure user email is available

    const fetchUserOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/orders/user?email=${user.email}`
        );
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

  // Filter out expired orders
  const filteredOrders = orders.filter(
    (order) => order.status !== "Expired" && order.status !== "Canceled"
  );
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

  // Handle canceling the order
  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/orders/${orderId}/cancel`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Canceled" }),
        }
      );

      if (response.ok) {
        await response.json();
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: "Canceled" } : order
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

  return (
    <div className="p-4 text-black">
      {loading && "loading ......."}
      <h3 className="text-2xl font-bold mb-4">Your Upcoming Orders</h3>
      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 justify-center align-middle items-center sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => {
            const remainingTime = calculateRemainingTime(
              order.updatedAt,
              order.time
            );
            const remainingMinutes = parseInt(remainingTime.split(":")[0]);
            const canCancel = remainingMinutes > 0;

            return (
              <div
                key={order._id}
                className="border rounded-lg p-4 shadow-md bg-orange-100 w-full"
              >
                <div className="mt-3 text-center">
                  {/* Show different messages based on order status */}
                  {order.status === "Preparing" && !order.time && (
                    <p className="text-lg font-medium">
                      Admin will soon accept your order
                    </p>
                  )}
                  {order.status === "Pending" && (
                    <p className="text-lg font-medium">Your order is pending</p>
                  )}
                  {order.status === "Rejected" && order.reason && (
                    <p className="text-lg font-medium text-black">
                      Reason: {order.reason}
                    </p>
                  )}
                  {order.status == "Preparing" &&
                    order.status !== "Pending" && (
                      <h5 className="font-medium text-4xl font-chewy text-green-600">
                        {remainingTime}
                      </h5>
                    )}
                  <p>{order.status}</p>
                </div>
                <p>
                  <strong>User Email:</strong> {order.userEmail}
                </p>

                <p>
                  <strong>Preparation Time:</strong> {order.time} minutes
                </p>
                <h5 className="font-medium mt-3">Items:</h5>
                {order.items.map((item, index) => (
                  <span className="flex text-xs flex-wrap gap-1" key={index}>
                    {item.subItems.length > 0 &&
                      item.subItems?.map((subItem) => subItem.name).join(", ")}
                    {item.name}{" "}
                    {item.subItems.map((subItem, idx) => (
                      <span className=" text-xs" key={idx}>
                        {subItem.name}
                      </span>
                    ))}
                    (x{item.quantity})
                  </span>
                ))}

                {order.status !== "Canceled" && canCancel ? (
                  <button
                    className="mt-4 p-2 bg-red-500 text-white rounded"
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    Cancel Order
                  </button>
                ) : (
                  order.status === "Rejected" && (
                    <button
                      className="mt-4 p-2 bg-red-500 text-white rounded"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      remove
                    </button>
                  )
                )}

                {/* {order.status === "Canceled" && (
                  <p className="mt-2 text-black">Order Canceled</p>
                )} */}
              </div>
            );
          })}
        </div>
      ) : (
        <div>No orders to display</div>
      )}
    </div>
  );
};

export default UpcomingOrders;
