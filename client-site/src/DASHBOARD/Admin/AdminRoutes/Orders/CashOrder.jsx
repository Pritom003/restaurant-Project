import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ReactToPrint from "react-to-print";
import { FaTrash, FaPrint, FaCheckCircle } from "react-icons/fa";

const CashOrder = () => {
  const [orders, setOrders] = useState([]);
  const [sortedOrders, setSortedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortOption, setSortOption] = useState("descending"); // Default sort option for newest first
  const orderDetailsRef = useRef();
  console.log(selectedOrder);

  // Fetch orders on component mount
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/orders/payment-methods?method=cash")
      .then((response) => {
        const fetchedOrders = response.data || [];
        setOrders(fetchedOrders);
        sortOrders(fetchedOrders, sortOption); // Sort immediately after fetching
      })
      .catch((error) => {
        console.error("Error fetching Cash on delivery orders:", error);
        Swal.fire(
          "Error",
          "Failed to fetch orders. Please try again later.",
          "error"
        );
      });
  }, [sortOption]);

  // Sort Orders Based on Sort Option
  const sortOrders = (orders, option) => {
    let sorted = [...orders];

    if (option === "ascending") {
      // Sort by ascending order of createdAt
      sorted = sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (option === "descending") {
      // Sort by descending order of createdAt
      sorted = sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    setSortedOrders(sorted);
  };

  // Handle sort option change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    sortOrders(orders, e.target.value);
  };

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

      {/* Sorting Dropdown */}
      <div className="flex items-center mb-4">
        <label htmlFor="sort" className="mr-4 font-medium">
          Sort By:
        </label>
        <select
          id="sort"
          value={sortOption}
          onChange={handleSortChange}
          className="p-2 border rounded-md"
        >
          <option value="descending">Date (Newest First)</option>
          <option value="ascending">Date (Oldest First)</option>
        </select>
      </div>

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
              {sortedOrders.length > 0 ? (
                sortedOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRowClick(order)}
                  >
                    <td className="px-4 py-2">
                      {formatDate(order?.createdAt)}
                    </td>
                    <td className="px-4 py-2">${order?.totalPrice}</td>
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
                  <td colSpan="5" className="text-center py-4 text-gray-500">
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
              style={{
                fontFamily: "monospace",
                width: "300px",
                margin: "auto",
                padding: "20px",
                border: "1px solid black",
                background: "#fff",
              }}
            >
              {/* Header */}
              <h2 style={{ textAlign: "center", margin: "0" }}>Deedar Uk</h2>
              <p className="text-center">Address:{selectedOrder?.address}</p>
              <p className="text-center">Zip Code:{selectedOrder?.zipcode}</p>
              <p className="text-center">Area:{selectedOrder?.area}</p>
              <p className="text-center">Contact No:{selectedOrder?.mobile}</p>
              <p
                style={{
                  textAlign: "center",
                  margin: "5px 0",
                  fontSize: "12px",
                }}
              ></p>
              <hr />

              {/* Order Details */}
              <h3 style={{ textAlign: "center", margin: "5px 0" }}>
                Order Number: {selectedOrder.orderNumber}
              </h3>
              <p style={{ fontSize: "12px", margin: "5px 0" }}>
                CreatedAt:
                {selectedOrder.createdAt} {selectedOrder.time}
              </p>
              <hr />

              {/* Items */}
              <table>
                <thead>
                  <tr>
                    <th>Quantity</th>
                    <th>Item Name</th>
                    <th>Sub Items</th>
                    <th style={{ textAlign: "right" }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      {/* Quantity */}
                      <td>{item.quantity}</td>

                      {/* Item Name */}
                      <td>{item.name}</td>

                      {/* Sub Items */}
                      <td>
                        {item.subItems && typeof item.subItems === "object" && (
                          <ul>
                            {Object.values(item.subItems).map(
                              (subItem, subIndex) => (
                                <li key={subIndex}>{subItem.name}</li>
                              )
                            )}
                          </ul>
                        )}
                      </td>

                      {/* Price */}
                      <td style={{ textAlign: "right" }}>£ {item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <hr />

              {/* Payment Details */}
              <p style={{ fontSize: "12px" }}>
                {selectedOrder.paymentMethod} {selectedOrder.paymentStatus}
              </p>
              <table style={{ width: "100%", fontSize: "12px" }}>
                <tbody>
                  <tr>
                    <td>Delivery Charge:</td>
                    <td style={{ textAlign: "right" }}>
                      £ {selectedOrder.extraCharge}
                    </td>
                  </tr>
                  <tr>
                    <td>Subtotal:</td>
                    <td style={{ textAlign: "right" }}>
                      £ {selectedOrder.totalPrice}
                    </td>
                  </tr>
                  <tr>
                    <td>Total:</td>
                    <td style={{ textAlign: "right", fontWeight: "bold" }}>
                      £ {selectedOrder.totalPrice}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p style={{ fontSize: "12px", marginTop: "10px" }}>
                Transaction Type: {selectedOrder.paymentMethod} <br />
                Authorization: {selectedOrder.paymentStatus} <br />
                {/* Payment Code: {selectedOrder.payment.paymentCode} <br /> */}
                Payment ID: {selectedOrder._id} <br />
              </p>
              <hr />

              {/* Tip Section */}
              <p style={{ fontSize: "12px", margin: "10px 0" }}>
                + Tip: _____________
              </p>
              <p style={{ fontSize: "12px", marginBottom: "10px" }}>
                = Total: _____________
              </p>
              <p style={{ textAlign: "center" }}>
                X _______________________________
              </p>
              <hr />

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
        )}
      </div>
    </div>
  );
};

export default CashOrder;
