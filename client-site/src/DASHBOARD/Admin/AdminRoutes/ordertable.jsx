import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const OrderTable = ({ updateRevenue }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    // Fetch orders from the backend
    axios.get('http://localhost:3000/api/orders')
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  }, []);

  // Handle order deletion with SweetAlert2 confirmation
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3000/api/orders/${id}`)
          .then(() => {
            setOrders(orders.filter(order => order._id !== id));
            Swal.fire('Deleted!', 'Order has been deleted.', 'success');
            updateRevenue();  // Call the function to update revenue after deletion
          })
          .catch((error) => {
            console.error('Error deleting order:', error);
            Swal.fire('Error!', 'Failed to delete order.', 'error');
          });
      }
    });
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleRowClick = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="overflow-x-auto mt-8">
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
              <td className="px-4 py-2">{formatDate(order.createdAt)}</td>
              <td className="px-4 py-2">${order.totalPrice?.toFixed(2)}</td>
              <td className="px-4 py-2">{order.paymentStatus ? 'Paid' : 'Pending'}</td>
              <td className="px-4 py-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
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
