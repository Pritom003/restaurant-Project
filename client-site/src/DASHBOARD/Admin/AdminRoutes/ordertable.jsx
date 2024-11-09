import { useEffect, useState } from 'react';
import axios from 'axios';

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    // Fetch orders from the backend
    axios.get('http://localhost:3000/api/orders')
      .then((response) => {
        setOrders(response.data);  // Set the fetched orders in the state
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  }, []);

  // Handle order deletion
  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/api/orders/${id}`)
      .then((response) => {
        // Remove the deleted order from the state
        setOrders(orders.filter(order => order._id !== id));
        alert('Order deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting order:', error);
        alert('Failed to delete order');
      });
  };

  // Format the date in a readable format
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  // Show details of a specific order
  const handleRowClick = (order) => {
    setSelectedOrder(order);  // Set the selected order to display its details
  };

  return (
    <div className="overflow-x-auto mt-8">
      {/* Orders Table */}
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left">Order Date</th>
            <th className="px-4 py-2 text-left">Total</th>
            <th className="px-4 py-2 text-left">Payment Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b cursor-pointer" onClick={() => handleRowClick(order)}>
              <td className="px-4 py-2">{formatDate(order.createdAt)}</td> {/* Display formatted date */}
              <td className="px-4 py-2">${order.totalPrice?.toFixed(2)}</td>
              <td className="px-4 py-2">{order.paymentStatus ? 'Paid' : 'Pending'}</td>
              <td className="px-4 py-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();  // Prevent triggering row click when clicking delete
                    handleDelete(order._id);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="mt-8 p-6 bg-white shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Order Details</h3>
          <p><strong>User Email:</strong> {selectedOrder.userEmail}</p>
          <p><strong>Order Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
          <p><strong>Total Price:</strong> ${selectedOrder.totalPrice?.toFixed(2)}</p>
          <h4 className="font-semibold mt-4">Items:</h4>
          <ul className="list-disc pl-6">
            {selectedOrder.items.map((item, index) => (
              <li key={index}>
                <p>{item.name} - ${item.price?.toFixed(2)} x {item.quantity}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
