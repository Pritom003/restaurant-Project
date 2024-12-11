import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const AcceptOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState("30");
  const [selectedReason, setSelectedReason] = useState("Out of Stock");

  // Fetch pending orders on component mount
  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/orders/pending"
        );
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

  // Accept order and set preparation time
  const handleAccept = async (orderId) => {
    if (!selectedTime) {
      alert("Please select a time before accepting!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/orders/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ time: selectedTime, status: "Preparing" }),
        }
      );

      if (response.ok) {
        const updatedOrder = await response.json();
        Swal.fire({
          title: "Order Updated!",
          text: `Order #${updatedOrder.orderNumber} status updated to Preparing.`,
          icon: "success",
        });
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== updatedOrder._id)
        );
      } else {
        Swal.fire({
          title: "Error!",
          text: "There was an issue updating the order.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      Swal.fire({
        title: "Failed!",
        text: "Failed to update order status.",
        icon: "error",
      });
    }
  };

  // Reject order with reason
  const handleReject = async (orderId) => {
    if (!selectedReason) {
      alert("Please select a reason for rejection!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/orders/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Rejected", reason: selectedReason }),
        }
      );

      if (response.ok) {
        const updatedOrder = await response.json();
        Swal.fire({
          title: "Order Rejected",
          text: `Order #${updatedOrder.orderNumber} has been rejected.`,
          icon: "info",
        });
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== updatedOrder._id)
        );
      } else {
        Swal.fire({
          title: "Error!",
          text: "There was an issue rejecting the order.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error rejecting order:", error);
      Swal.fire({
        title: "Failed!",
        text: "Failed to reject order.",
        icon: "error",
      });
    }
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
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>reason:</strong> {order.reason ? order.reason : ""}
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
              <div className="flex justify-between">
                {/* Accept Section */}
                <div className="w-1/2 border-r border-gray-300 pr-4">
                  <h2 className="text-lg font-semibold mb-2">Accept</h2>
                  <div className="flex flex-col gap-2 h-20 overflow-y-auto">
                    {["15", "30", "45", "50"].map((time) => (
                      <button
                        key={time}
                        className={`py-2 px-4 rounded-lg text-center ${
                          selectedTime === time
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 hover:bg-green-200"
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handleAccept(order._id)}
                    className="w-full mt-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
                  >
                    Accept
                  </button>
                </div>

                {/* Reject Section */}
                <div className="w-1/2 pl-4">
                  <h2 className="text-lg font-semibold mb-2">Reject</h2>
                  <div className="flex flex-col gap-2 h-20 overflow-y-auto">
                    {[
                      "Too Busy",
                      "Too Far",
                      "Out of Stock",
                      "Closed Today",
                      "Please Call",
                    ].map((reason) => (
                      <button
                        key={reason}
                        className={`py-2 px-4 rounded-lg text-center ${
                          selectedReason === reason
                            ? "bg-red-500 text-white"
                            : "bg-gray-100 hover:bg-red-200"
                        }`}
                        onClick={() => setSelectedReason(reason)}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handleReject(order._id)}
                    className="w-full mt-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
                  >
                    Reject
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
