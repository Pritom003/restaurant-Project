import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ReactToPrint from "react-to-print";
import { FaTrash, FaPrint, FaCheckCircle } from "react-icons/fa";

const CashOrder = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const orderDetailsRef = useRef();

  // Fetch Stripe orders on component mount

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/orders/payment-methods?method=cash")
      .then((response) => {
        setOrders(response.data || []);
      })
      .catch((error) => {
        console.error("Error fetching Cash on delivery orders:", error);
        Swal.fire(
          "Error",
          "Failed to fetch orders. Please try again later.",
          "error"
        );
      });
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3000/api/orders/${id}`)
          .then((response) => {
            if (response.status >= 200 && response.status < 300) {
              setOrders((prevOrders) =>
                prevOrders.filter((order) => order._id !== id)
              );
              Swal.fire("Deleted!", "Order has been deleted.", "success");
              // updateRevenue();
            } else {
              throw new Error("Unexpected response from server");
            }
          })
          .catch((error) => {
            console.error("Error deleting order:", error);
            Swal.fire("Error!", "Failed to delete order.", "error");
          });
      }
    });
  };

  const handleUpdatePaymentStatus = (id) => {
    axios
      .patch(`http://localhost:3000/api/orders/${id}/payment-status`, {
        paymentStatus: "success",
      })
      .then(() => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === id ? { ...order, paymentStatus: "success" } : order
          )
        );
        Swal.fire("Updated!", "Payment status has been updated.", "success");
      })
      .catch((error) => {
        console.error("Error updating payment status:", error);
        Swal.fire("Error!", "Failed to update payment status.", "error");
      });
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleRowClick = (order) => setSelectedOrder(order);

  return (
    <div className="overflow-x-auto mt-8 text-black">
      <h2 className="text-2xl font-semibold mb-4">COD Orders</h2>
      <div className="flex gap-6">
        {/* Table Section */}
        <div className="flex-1">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Order Date</th>
                <th className="px-4 py-2 text-left">Total</th>
                <th className="px-4 py-2 text-left">Payment Status</th>
                <th className="px-4 py-2 text-left">Spicy Level</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRowClick(order)}
                  >
                    <td className="px-4 py-2">
                      {formatDate(order?.createdAt)}
                    </td>
                    <td className="px-4 py-2">
                      ${order?.totalPrice?.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">{order?.paymentStatus}</td>
                    <td className="px-4 py-2">{order?.spiceLevel}</td>
                    <td className="px-4 py-2 flex space-x-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(order._id);
                        }}
                        className="text-red-500 hover:text-red-600"
                        title="Delete Order"
                      >
                        <FaTrash size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                        className="text-blue-500 hover:text-blue-600"
                        title="Print Order"
                      >
                        <FaPrint size={18} />
                      </button>
                      {order.paymentStatus === "pending" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdatePaymentStatus(order._id);
                          }}
                          className="text-green-500 hover:text-green-600"
                          title="Confirm Payment"
                        >
                          <FaCheckCircle size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Print Preview Section */}
        {selectedOrder && (
  <div>
    <div
      ref={orderDetailsRef}
      className="flex-1 p-6 bg-white shadow-lg rounded-lg mt-8 md:mt-0 text-gray-800"
    >
      {/* Order Details Header */}
      <div className="border-b pb-4 mb-4">
        <h3 className="text-2xl font-bold text-center mb-2">Order Receipt</h3>
        <p className="text-sm text-center">Order ID: {selectedOrder?._id}</p>
      </div>

      {/* User Information */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold">Customer Information</h4>
        <p>
          <strong>User Email:</strong> {selectedOrder?.userEmail}
        </p>
        <p>
          <strong>Order Date:</strong> {formatDate(selectedOrder?.createdAt)}
        </p>
      </div>

      {/* Items List */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold">Order Items</h4>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4">Item Name</th>
              <th className="py-2 px-4">Price</th>
              <th className="py-2 px-4">Quantity</th>
              <th className="py-2 px-4">Total</th>
            </tr>
          </thead>
          <tbody>
            {selectedOrder?.items?.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{item?.name}</td>
                <td className="py-2 px-4">${item?.price?.toFixed(2)}</td>
                <td className="py-2 px-4">{item?.quantity}</td>
                <td className="py-2 px-4">
                  ${(item?.price * item?.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Summary */}
      <div className="mt-4 border-t pt-4">
        <p className="flex justify-between">
          <span className="font-semibold">Total Price:</span>
          <span>${selectedOrder?.totalPrice?.toFixed(2)}</span>
        </p>
        {/* <p className="flex justify-between">
          <span className="font-semibold">Payment Status:</span>
          <span
            className={`font-bold ${
              selectedOrder?.paymentStatus === "success"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {selectedOrder?.paymentStatus === "success" ? "Paid" : "Pending"}
          </span>
        </p> */}
      </div>
    </div>

    {/* Print Button */}
    <ReactToPrint
      trigger={() => (
        <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          Print Order
        </button>
      )}
      content={() => orderDetailsRef.current}
      documentTitle={`Order_${selectedOrder?._id}`}
    />
  </div>
)}
      </div>
    </div>
  );
};

export default CashOrder;
