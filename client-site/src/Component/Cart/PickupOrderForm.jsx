/* eslint-disable react/prop-types */
import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Swal from "sweetalert2";
import axios from "axios";

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(stripePublicKey);

const PickupOrderForm = () => {
  const location = useLocation();
  const { items, totalPrice, spiceLevel, orderType } = location.state || {};
  console.log(items);
  const [formData, setFormData] = useState({
    email: "",
    address: "",
    zipcode: "",
    paymentMethod: "pickup",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.paymentMethod === "online") {
      setIsProcessing(true);
    } else {
      await handleOrderSubmission("cash");
    }
  };

  const handleOrderSubmission = async (paymentStatus) => {
    const orderData = {
      email: formData.email,
      address: formData.address,
      zipcode: formData.zipcode,
      items,
      totalPrice,
      paymentMethod: 'pickup',
      paymentStatus,
      status: "x",
      spiceLevel,
      orderType,
      chefEmail: "a",
      userEmail: "b",
      time: 1,
    };
    console.log(orderData);
    try {
      await axios.post("http://localhost:3000/api/orders", orderData);
      Swal.fire(
        "Success",
        "Your order has been placed successfully!",
        "success"
      );
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Failed to place your order. Please try again.",
        "error"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4">
      <form className="max-w-xl p-5 bg-white mx-auto" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6">Pickup Order Details</h2>

        {/* Email Field */}
        <InputField
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />

        {/* Address Field */}
        <InputField
          label="Address"
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          required
        />

        {/* Zip Code Field */}
        <InputField
          label="Zip Code"
          type="text"
          name="zipcode"
          value={formData.zipcode}
          onChange={handleInputChange}
          required
        />

        {/* Payment Method Selection */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Payment Method</label>
          <div className="flex gap-4">
            <RadioButton
              label="Cash Payment"
              name="paymentMethod"
              value="cash"
              checked={formData.paymentMethod === "cash"}
              onChange={handleInputChange}
            />
            <RadioButton
              label="Online Payment"
              name="paymentMethod"
              value="online"
              checked={formData.paymentMethod === "online"}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {formData.paymentMethod === "online" && (
          <Elements stripe={stripePromise}>
            <StripePaymentForm
              totalPrice={totalPrice}
              onPaymentSuccess={(paymentMethodId) =>
                handleOrderSubmission("success", paymentMethodId)
              }
            />
          </Elements>
        )}

        <button
          type="submit"
          className={`mt-4 text-white bg-blue-700 hover:bg-blue-800 rounded px-5 py-2.5 ${
            isProcessing ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isProcessing}
        >
          {isProcessing
            ? "Processing..."
            : formData.paymentMethod === "online"
            ? `Pay £${totalPrice.toFixed(2)}`
            : "Place Order"}
        </button>
      </form>
    </div>
  );
};

const StripePaymentForm = ({ totalPrice, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleStripeSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.error("Stripe error:", error);
      Swal.fire(
        "Error",
        "Failed to process payment. Please try again.",
        "error"
      );
    } else {
      Swal.fire("Success", "Payment processed successfully!", "success");
      onPaymentSuccess(paymentMethod.id);
    }
  };

  return (
    <form>
      <CardElement
        options={{
          style: {
            base: { fontSize: "16px", color: "#424770" },
            invalid: { color: "#9e2146" },
          },
        }}
      />
      <button
        type="submit"
        className="mt-4 text-white bg-green-600 hover:bg-green-700 rounded px-4 py-2"
        disabled={!stripe}
        onClick={handleStripeSubmit}
      >
        Pay £{totalPrice.toFixed(2)}
      </button>
    </form>
  );
};

const InputField = ({ label, ...props }) => (
  <div className="relative z-0 w-full mb-5 group">
    <input
      {...props}
      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
      placeholder=" "
    />
    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
      {label}
    </label>
  </div>
);

const RadioButton = ({ label, ...props }) => (
  <label className="flex items-center">
    <input type="radio" {...props} className="mr-2" />
    {label}
  </label>
);

export default PickupOrderForm;