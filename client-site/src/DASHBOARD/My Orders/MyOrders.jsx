import { useEffect, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import TableRow from "./TableRow";

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    if (!user?.email) return; // Ensure user email is available

    fetch(`http://localhost:3000/api/orders/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data); // Set orders if data is an array
        } else {
          setOrders([]); // Fallback to empty array if not an array
        }
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setOrders([]); // Fallback to empty array in case of error
        setLoading(false); // Set loading to false after error
        setError("Failed to load orders. Please try again later.");
      });
  }, [user?.email]);

  if (loading) return <p>Loading...</p>; // Show loading state while fetching
  if (error) return <p className="text-red-600">{error}</p>; // Show error message if any

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal"
                  >
                    Your Email
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal"
                  >
                    Food Name
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal"
                  >
                    Food Price
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal"
                  >
                    Payment Method
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order._id} order={order} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
