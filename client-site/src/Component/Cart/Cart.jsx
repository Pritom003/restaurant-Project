  // eslint-disable-next-line no-unused-vars
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { PiTrashSimpleThin } from "react-icons/pi";
import Swal from "sweetalert2";
import { TiShoppingCart } from "react-icons/ti";
import { useState } from "react";

import OutOfRangeModal from "./OutofRangle";
import useAuth from "../../Hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useRestaurantStatus from "../../Hooks/useRestaurantStatus";

const DELIVERY_CHARGE = 0.0;

const Cart = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { items, totalPrice } = useSelector((state) => state);
  const [orderType, setOrderType] = useState(""); 
  const [spiceLevel, setSpiceLevel] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { isRestaurantOpen} = useRestaurantStatus();
  console.log(items);
  const removeFromCart = (item) =>
    dispatch({ type: "REMOVE_FROM_CART", payload: { key: item.key} });

  const isInRange = true;

  const formattedItems = items.map((item) => ({
    name: item.name,
    price: item.variantPrice || item.price,
    quantity: item.quantity,
    variant: item.variant || null,
    category: item.category,
    subItems: item.items || [], 
  }));


  // eslint-disable-next-line no-unused-vars
  const handleOrderCompletion = async (method, status) => {
    const orderData = {
      chefEmail: "mkrefat5@gmail.com",
      userEmail: user?.email || "guest@example.com", // Fallback email for testing
      totalPrice: getTotalPrice(),
      items: formattedItems,
      paymentStatus: status,
      paymentMethod: method,
      orderType,
      spiceLevel,
    };
    // console.log("Order data", orderData);
    try {
      await axios.post("http://localhost:3000/api/orders", orderData);
      // setShowPaymentForm(false);
      Swal.fire(
        "Order Placed",
        `Your order has been placed with ${
          method === "stripe"
            ? "Stripe"
            : method === "cash"
            ? "Cash on Delivery"
            : "Pick Up"
        }!`,
        "success"
      );
      dispatch({ type: "CLEAR_CART" });
    } catch (error) {
  
      Swal.fire(
        "Error",
        `There was an issue placing your order. Please try again ${error}.`,
        "error"
      );
    }
  };

  const handlePlaceOrder = () => {
    if (!isRestaurantOpen) {
      // If restaurant is closed, show an alert
      Swal.fire({
        icon: "warning",
        title: "Sorry",
        text: "The restaurant is currently closed. Please try again later.",
        confirmButtonText: "Okay",
        confirmButtonColor: "#f44336",
      })
    }else if (isRestaurantOpen){
    if (orderType) {
      navigate("/pickup-order", {
        state: {
          items: formattedItems,
          totalPrice: getTotalPrice(),
          spiceLevel,
          orderType,
        },
      });
    }}
  };
  // console.log(items)

  const handleOrderTypeChange = (type) => {
    if (type === "online" && !isInRange) {
      setShowModal(true);
    } else {
      setOrderType(type);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const getTotalPrice = () => {
    return orderType === "online" ? totalPrice + DELIVERY_CHARGE : totalPrice;
  };

  return (
    <div className="text-black">
      <h3 className="border border-l-2 pl-2 text-xl border-l-red-900 flex gap-2 text-black justify-between items-center">
        Cart <TiShoppingCart />
      </h3>
      <div className="mt-2 p-2 border min-h-36 border-gray-300">
        <ul className="text-xs ">
          {items.length > 0 ? (
            items.map((item) => (
              <li
                key={item.key}
                className="flex justify-between items-center border-gray-600border-b  py-2 border-2"
              >
              
                <span className="flex-grow">
               
                  <button
  onClick={() =>
    dispatch({
      type: 'INCREMENT_QUANTITY',
      payload: { key: item.key }, // Pass key, not id
    })
  }
  className="text-gray-600 text-xs border-2 border-gray-400 p rounded-full px-2"
>
  +
</button>
                  {item.name} {item.variant && `(${item.variant})`}{" "}{item.spicelevel && `(${item.spicelevel})`}
                  {item.quantity > 1 && `(${item.quantity}x)`}
                  {/* Display special menu platter items under the category name */}
                  {item.category === "Special Platter" &&  (
                    <span className="text-sm text-gray-600">
                      {" "}
                      {item.name=''}
                      {item.category}
                      ({item.items.map((subItem) => subItem.name).join(", ")})
                    </span>
                  )}
      
                </span>

                <span className="flex-shrink-0">
  £{(item.spicelevel ? (item.variantPrice + item.spiceprice || item.price + item.spiceprice) : (item.variantPrice || item.price)) * item.quantity}
</span>

                {
                  item.quantity >1?  <button
                  onClick={() =>
                    dispatch({
                      type: 'DECREMENT_QUANTITY',
                      payload: { key: item.key }, // Pass key, not id
                    })
                  }
                  className="text-gray-600 text-xs border-2 border-gray-400 p rounded-full px-2"
                >
                  -
                </button>  :<button
                  onClick={() => removeFromCart(item)}
                  className="pl-2 hover:text-red-800"
                >
                  <PiTrashSimpleThin />
                </button>
                }
 
                
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">
              Your cart is empty. Please add items to your cart.
            </p>
          )}
        </ul>

        {items.length > 0 && (
          <div className="text-end">
            <div className="mt-2 text-lg">
              Subtotal: £{totalPrice.toFixed(2)}
            </div>

            <div className="mt-2 text-lg">
              Total: £{getTotalPrice().toFixed(2)}
            </div>

            <div className="mt-4">
              <label className="block text-sm">
                Add a Note (e.g., Spice Level)
              </label>
              <input
                type="text"
                value={spiceLevel}
                onChange={(e) => setSpiceLevel(e.target.value)}
                className="border rounded p-1 w-full text-sm"
                placeholder="Add a note (e.g., Hot, More Spicy)"
              />
            </div>

            {/* Order Type Selection */}
            <div className="mt-4 flex gap-4">
              <label className="text-lg flex items-center text-black">
                <input
                  type="radio"
                  name="orderType"
                  value="online"
                  checked={orderType === "online"}
                  onChange={() => handleOrderTypeChange("online")}
                  className="hidden"
                />
                <span
                  className={`inline-block w-6 h-6 mr-2 border-2 border-gray-500 rounded-sm ${
                    orderType === "online" ? "bg-red-950" : ""
                  }`}
                ></span>
                <span>Delivery</span>
              </label>

              <label className="text-lg flex items-center text-black">
                <input
                  type="radio"
                  name="orderType"
                  value="pickup"
                  checked={orderType === "pickup"}
                  onChange={() => handleOrderTypeChange("pickup")}
                  className="hidden"
                />
                <span
                  className={`inline-block w-6 h-6 mr-2 border-2 border-gray-500 rounded-sm ${
                    orderType === "pickup" ? "bg-red-950" : ""
                  }`}
                ></span>
                <span>Pick Up</span>
              </label>
            </div>

            <button
  onClick={handlePlaceOrder}
  className="text-lg text-gray-600 hover:text-red-950 hover:underline mt-2 disabled:no-underline disabled:text-gray-700"
  disabled={getTotalPrice().toFixed(2) === '0.00'}
>
  Place Order
</button>

          </div>
        )}
      </div>

      {/* Out of Range Modal */}
      {showModal && <OutOfRangeModal onClose={closeModal} />}
    </div>
  );
};

export default Cart;
