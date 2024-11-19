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
import useAuth from "../../Hooks/useAuth";

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(stripePublicKey);

const Cart = () => {
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector((state) => state);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe"); // Default to Stripe
  const { user } = useAuth();
  console.log(user?.email);
  const removeFromCart = (item) =>
    dispatch({ type: "REMOVE_FROM_CART", payload: item });

  const handlePlaceOrder = () => {
    if (paymentMethod === "stripe") {
      setShowPaymentForm(true); // Show Stripe payment form
    } else if (paymentMethod === "cash") {
      handleOrderCompletion(); // Complete the order directly for Cash on Delivery
    }
  };

  const handleOrderCompletion = async () => {
    const orderData = {
      chefEmail: "mkrefat5@gmail.com",
      userEmail: user?.email,
      items,
      totalPrice,
      // Pass the selected payment method
      paymentStatus: paymentMethod === "stripe" ? "success" : "pending", // Payment status for different methods
      paymentMethod,
    };
    console.log(orderData);
    try {
      // Send the order data to the backend
      await axios.post(`http://localhost:3000/api/orders`, orderData);
      setShowPaymentForm(false);
      Swal.fire(
        "Order Placed",
        `Your order has been placed with ${
          paymentMethod === "stripe" ? "Stripe" : "Cash on Delivery"
        }!`,
        "success"
      );
      dispatch({ type: "CLEAR_CART" });
    } catch (error) {
      console.error("Error placing order:", error.message);
      Swal.fire(
        "Error",
        "There was an issue placing your order. Please try again.",
        "error"
      );
    }
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
                key={item.name}
                className="flex justify-between items-center py-1"
              >
                <span className="flex-grow">
                  {item.name} {item.quantity > 1 && `(${item.quantity}x)`}
                </span>
                <span className="flex-shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
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
            <div className="mt-2 text-lg ">Total: ${totalPrice.toFixed(2)}</div>

            {/* Payment Method Selector */}
            <div className="mt-4 flex flex-wrap lg:flex-col lg:items-start lg:gap-4 items-center justify-between">
              {/* Stripe Option */}
              <label className="text-lg flex items-center text-black">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={paymentMethod === "stripe"}
                  onChange={() => setPaymentMethod("stripe")}
                  className="hidden" // Hide the default radio button
                />
                <span
                  className={`inline-block w-6 h-6 mr-2 border-2 border-gray-500 rounded-sm ${
                    paymentMethod === "stripe" ? "bg-red-950" : ""
                  } ${
                    paymentMethod === "stripe"
                      ? "border-blue-500"
                      : "border-gray-500"
                  }`}
                >
                  {paymentMethod === "stripe" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-white mx-auto mt-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </span>
                <span className="flex justify-center align-middle items-center gap-1">
                  <BsStripe className="text-2x" /> Stripe
                </span>
              </label>

              {/* Cash on Delivery Option */}
              <label className="text-lg flex items-center text-black">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                  className="hidden" // Hide the default radio button
                />
                <span
                  className={`inline-block w-6 h-6 mr-2 border-2 border-gray-500 rounded-sm ${
                    paymentMethod === "cash" ? "bg-red-950" : ""
                  } ${
                    paymentMethod === "cash"
                      ? "border-blue-500"
                      : "border-gray-500"
                  }`}
                >
                  {paymentMethod === "cash" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-white mx-auto mt-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </span>
                <span className="flex justify-center align-middle items-center gap-1">
                  <FaPoundSign /> Cash on Delivery
                </span>
              </label>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="text-lg text-gray-600 hover:text-red-950 hover:underline mt-2"
            >
              Place Order
            </button>
          </div>
        )}
      </div>

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
    </div>
  );
};

export default Cart;
