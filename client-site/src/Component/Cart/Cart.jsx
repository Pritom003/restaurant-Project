import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { PiTrashSimpleThin } from "react-icons/pi";
import Swal from "sweetalert2";
import { TiShoppingCart } from "react-icons/ti";
import { useState } from "react";
import PaymentForm from "./PaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { FaPoundSign } from "react-icons/fa";
import { BsStripe } from "react-icons/bs";
import OutOfRangeModal from "./OutofRangle";
import useAuth from "../../Hooks/useAuth";
import { useNavigate } from "react-router-dom";

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(stripePublicKey);

const Cart = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { items, totalPrice } = useSelector((state) => state);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [orderType, setOrderType] = useState(""); // Default to empty
  const [spiceLevel, setSpiceLevel] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const removeFromCart = (item) =>
    dispatch({ type: "REMOVE_FROM_CART", payload: item });

  const isInRange = true;

  const handlePlaceOrder = () => {
    if (paymentMethod === "stripe") {
      setShowPaymentForm(true); // Show payment form for Stripe
    } else if (paymentMethod === "cash") {
      handleOrderCompletion("cash", "pending"); // Complete order with Cash
    } else if (orderType === "pickup") {
      navigate("/pickup-order", {
        state: { items, totalPrice, spiceLevel, orderType },
      });
    }
  };

  const handleOrderCompletion = async (method, status) => {
    const orderData = {
      chefEmail: "mkrefat5@gmail.com",
      userEmail: user?.email || "guest@example.com", // Fallback email for testing
      items,
      totalPrice,
      paymentStatus: status,
      paymentMethod: method,
      orderType,
      spiceLevel,
    };

    try {
      await axios.post("http://localhost:3000/api/orders", orderData);
      setShowPaymentForm(false);
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
      console.error(error);
      Swal.fire(
        "Error",
        "There was an issue placing your order. Please try again.",
        "error"
      );
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method === paymentMethod ? "" : method); // Toggle method
  };

  const handleOrderTypeChange = (type) => {
    if (type === "online" && !isInRange) {
      setShowModal(true);
    } else {
      setOrderType(type);
      setPaymentMethod(""); // Reset payment method when switching order type
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="text-black">
      <h3 className="border border-l-2 pl-2 text-xl border-l-red-900 flex gap-2 text-black justify-between items-center">
        Cart <TiShoppingCart />
      </h3>
      <div className="mt-2 p-2 border min-h-36 border-gray-300">
        <ul className="text-xs">
          {items.length > 0 ? (
            items.map((item) => (
              <li
                key={item.key}
                className="flex justify-between items-center py-1"
              >
                <span className="flex-grow">
                  {item.name} {item.variant && `(${item.variant})`}{" "}
                  {item.quantity > 1 && `(${item.quantity}x)`}
                </span>
                <span className="flex-shrink-0">
                  £{(item.variantPrice || item.price) * item.quantity}
                </span>

                <button
                  onClick={() => removeFromCart(item)}
                  className="pl-2 hover:text-red-800"
                >
                  <PiTrashSimpleThin />
                </button>
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
            <div className="mt-2 text-lg">Total: £{totalPrice.toFixed(2)}</div>

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

            {/* Payment Method Selection */}
            {orderType === "online" ? (
              <div className="mt-4 flex flex-wrap lg:flex-col lg:items-start lg:gap-4 items-center justify-between">
                <label className="text-lg flex items-center text-black">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={paymentMethod === "stripe"}
                    onChange={() => handlePaymentMethodChange("stripe")}
                    className="hidden"
                  />
                  <span
                    className={`inline-block w-6 h-6 mr-2 border-2 border-gray-500 rounded-sm ${
                      paymentMethod === "stripe" ? "bg-red-950" : ""
                    }`}
                  ></span>
                  <span className="flex items-center gap-1">
                    <BsStripe /> Card Payment
                  </span>
                </label>

                <label className="text-lg flex items-center text-black">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={() => handlePaymentMethodChange("cash")}
                    className="hidden"
                  />
                  <span
                    className={`inline-block w-6 h-6 mr-2 border-2 border-gray-500 rounded-sm ${
                      paymentMethod === "cash" ? "bg-red-950" : ""
                    }`}
                  ></span>
                  <span className="flex items-center gap-1">
                    <FaPoundSign />
                    Cash Payment
                  </span>
                </label>
              </div>
            ) : (
              ""
            )}

            <button
              onClick={handlePlaceOrder}
              className="text-lg text-gray-600 hover:text-red-950 hover:underline mt-2"
            >
              Place Order
            </button>
          </div>
        )}
      </div>

      {/* Payment Form for Stripe */}
      {showPaymentForm && paymentMethod === "stripe" && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              Complete Your Payment
            </h2>
            <Elements stripe={stripePromise}>
              <PaymentForm
                totalPrice={totalPrice}
                handleOrderCompletion={handleOrderCompletion}
              />
            </Elements>
            <button
              onClick={() => setShowPaymentForm(false)}
              className="mt-4 text-gray-500 underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Out of Range Modal */}
      {showModal && <OutOfRangeModal onClose={closeModal} />}
    </div>
  );
};

export default Cart;
