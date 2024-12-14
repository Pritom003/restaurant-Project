import { useState, useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";
import Swal from "sweetalert2"; // Import SweetAlert2

const PreparingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const orderDetailsRef = useRef();
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
    try {
      // Optimistically remove the item immediately from the state
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );

      const response = await fetch(
        `http://localhost:3000/api/orders/${orderId}/expire`,
        {
          method: "PATCH",
        }
      );

      if (response.ok) {
        const updatedOrder = await response.json();
        console.log("Order status updated to Expired:", updatedOrder);
        Swal.fire({
          title: "Order Done!",
          text: "The order status has been updated to Done.",
          icon: "success",
        });
      } else {
        console.error("Failed to update order status", await response.json());
        // Rollback if API call fails
        setOrders((prevOrders) => [...prevOrders, { _id: orderId }]);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      // Rollback if an error occurs
      setOrders((prevOrders) => [...prevOrders, { _id: orderId }]);
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

  const handleRowClick = (order) => setSelectedOrder(order);

  if (loading) {
    return <div>Loading preparing orders...</div>;
  }
  console.log(selectedOrder);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div className="p-4 text-black">
        <h3 className="text-2xl font-bold mb-4">Preparing Orders</h3>
        {orders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
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
                  <strong>Total Price:</strong> £
                  {order.totalPrice ? Number(order.totalPrice).toFixed(2) : 0}
                </p>
                <p>
                  <strong>Preparation Time:</strong> {order.time} minutes
                </p>
                <h5 className="font-medium mt-3">Items:</h5>
                {order.items.map((item, index) => (
                  <div className="flex text-xs flex-wrap gap-1" key={index}>
                    {item.subItems.length > 0 &&
                      item.subItems?.map((subItem) => subItem.name).join(", ")}
                    {item.name}{" "}
                    {item.subItems.map((subItem, idx) => (
                      <div key={idx}>
                        <span className="text-xs">
                          {subItem.name}
                          {/* <span>{subItem?.name}</span> */}
                        </span>
                      </div>
                    ))}
                    (x{item.quantity})
                  </div>
                ))}
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
                  <button
                    onClick={() => handleRowClick(order)}
                    className="mt-3 border-2 border-green-300 text-green-600 py-1 px-3 rounded"
                  >
                    PRINT
                  </button>
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

      <div className="min-w-44 mt-16">
        {selectedOrder ? (
          <div>
            <div
              ref={orderDetailsRef}
              style={{
                fontFamily: "monospace",
                width: "350px",
                margin: "auto",
                padding: "20px",
                border: "1px solid #ddd",
                background: "#fff",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Header */}
              <h2
                style={{ textAlign: "center", margin: "0", fontSize: "18px" }}
              >
                Deedar Uk
              </h2>
              <p className="text-center" style={{ fontSize: "12px" }}>
                Address: {selectedOrder?.address}
              </p>
              <p className="text-center" style={{ fontSize: "12px" }}>
                Zip Code: {selectedOrder?.zipcode}
              </p>
              <p className="text-center" style={{ fontSize: "12px" }}>
                Area: {selectedOrder?.area}
              </p>
              <p className="text-center" style={{ fontSize: "12px" }}>
                Contact No: {selectedOrder?.mobile}
              </p>
              <hr style={{ margin: "10px 0" }} />

              {/* Order Details */}
              <h3
                style={{
                  textAlign: "center",
                  margin: "10px 0",
                  fontSize: "16px",
                }}
              >
                Order Number: {selectedOrder.orderNumber}
              </h3>
              <p style={{ fontSize: "12px", margin: "5px 0" }}>
                CreatedAt: {selectedOrder.createdAt} {selectedOrder.time}
              </p>
              <hr style={{ margin: "10px 0" }} />

              {/* Items */}
              <table
                style={{
                  width: "100%",
                  fontSize: "12px",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "5px" }}>
                      Quantity
                    </th>
                    <th style={{ textAlign: "left", padding: "5px" }}>
                      Item Name
                    </th>
                    <th style={{ textAlign: "left", padding: "5px" }}>
                      Sub Items
                    </th>
                    <th style={{ textAlign: "right", padding: "5px" }}>
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td style={{ padding: "5px" }}>{item.quantity}</td>
                      <td style={{ padding: "5px" }}>
                        {item.name} -{item?.spiceName}
                      </td>
                      <td style={{ padding: "5px" }}>
                        {item.subItems && typeof item.subItems === "object" && (
                          <ul style={{ paddingLeft: "15px", fontSize: "11px" }}>
                            {Object.values(item.subItems).map(
                              (subItem, subIndex) => (
                                <li key={subIndex}>{subItem.name}</li>
                              )
                            )}
                          </ul>
                        )}
                      </td>
                      <td style={{ textAlign: "right", padding: "5px" }}>
                        £{" "}
                        {isNaN(parseFloat(item.price))
                          ? "N/A"
                          : parseFloat(item.price).toFixed(2)}{" "}
                        {item?.spicePrice}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <hr style={{ margin: "10px 0" }} />

              {/* Payment Details */}
              <p style={{ fontSize: "12px", marginBottom: "5px" }}>
                {selectedOrder.paymentMethod} {selectedOrder.paymentStatus}
              </p>
              <table
                style={{
                  width: "100%",
                  fontSize: "12px",
                  marginBottom: "10px",
                }}
              >
                <tbody>
                  <tr>
                    <td>Delivery Charge:</td>
                    <td style={{ textAlign: "right" }}>
                      £{" "}
                      {isNaN(parseFloat(selectedOrder.extraCharge))
                        ? "N/A"
                        : parseFloat(selectedOrder.extraCharge).toFixed(2)}
                    </td>
                  </tr>

                  <tr>
                    <td>Spicy Charge:</td>
                    {selectedOrder.items.map((item, index) => (
                      <td key={index}>
                        {item.spicePrice && (
                          <span style={{ textAlign: "left" }}>
                            £{" "}
                            {isNaN(parseFloat(item.spicePrice))
                              ? "N/A"
                              : parseFloat(item.spicePrice).toFixed(2)}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td>Subtotal:</td>
                    <td style={{ textAlign: "right" }}>
                      £{" "}
                      {isNaN(parseFloat(selectedOrder.totalPrice))
                        ? "N/A"
                        : parseFloat(selectedOrder.totalPrice).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>Total:</td>
                    <td style={{ textAlign: "right", fontWeight: "bold" }}>
                      £{" "}
                      {isNaN(parseFloat(selectedOrder.totalPrice))
                        ? "N/A"
                        : parseFloat(selectedOrder.totalPrice).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p style={{ fontSize: "12px", marginTop: "10px" }}>
                Transaction Type: {selectedOrder.paymentMethod} <br />
                Authorization: {selectedOrder.paymentStatus} <br />
                Payment ID: {selectedOrder._id} <br />
              </p>
              <hr style={{ margin: "10px 0" }} />

              {/* Tip Section */}
              <p style={{ fontSize: "12px", margin: "10px 0" }}>
                + Tip: _____________
              </p>
              <p style={{ fontSize: "12px", marginBottom: "10px" }}>
                = Total: _____________
              </p>
              <p style={{ textAlign: "center", fontSize: "12px" }}>
                X _______________________________
              </p>
              <hr style={{ margin: "10px 0" }} />

              {/* Footer */}
              <p
                style={{
                  textAlign: "center",
                  fontSize: "12px",
                  marginTop: "10px",
                }}
              >
                Customer Copy <br />
                Thanks for visiting <br />
                {selectedOrder.restaurantName}
              </p>
            </div>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <ReactToPrint
                trigger={() => (
                  <button
                    className="bg-red-500"
                    style={{ padding: "10px 20px" }}
                  >
                    Print
                  </button>
                )}
                content={() => orderDetailsRef.current}
              />
            </div>
          </div>
        ) : (
          <span className="text-xl mt-16 text-center font-bold">
            Your Print Preview Will Appear Here
          </span>
        )}
      </div>
    </div>
  );
};

export default PreparingOrders;
