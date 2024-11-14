// Cart.js

import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { PiTrashSimpleThin } from "react-icons/pi";
import Swal from 'sweetalert2';
import { TiShoppingCart } from "react-icons/ti";
import { useState } from 'react';
import PaymentForm from './PaymentForm';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

const stripePromise = loadStripe(stripePublicKey);

const Cart = () => {
    const dispatch = useDispatch();
    const { items, totalPrice } = useSelector((state) => state);
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const removeFromCart = (item) => dispatch({ type: 'REMOVE_FROM_CART', payload: item });
    
    const handlePlaceOrder = () => setShowPaymentForm(true);

    const handleOrderCompletion = async () => {
        const orderData = {
            chefEmail: "mkrefat5@gmail.com",
            userEmail: "fariadamd55@gmail.com",
            items,
            totalPrice,
            paymentStatus: "success",
        };

        try {
            await axios.post(`http://localhost:3000/api/orders`, orderData);
            setShowPaymentForm(false);
            Swal.fire('Payment Successful', 'Your order has been placed!', 'success');
            dispatch({ type: 'CLEAR_CART' });
        } catch (error) {
            console.error('Error placing order:', error.message);
            Swal.fire('Error', 'There was an issue placing your order. Please try again.', 'error');
        }
    };

    return (
        <div>
            <h3 className='border border-l-2 pl-2 text-xl border-l-red-900 flex gap-2 text-black justify-between items-center'>
                Cart <TiShoppingCart />
            </h3>
            <div className="mt-2 p-2 border min-h-36 border-gray-300">
                <ul className='text-xs'>
                    {items.length > 0 ? (
                        items.map((item) => (
                            <li key={item.name} className="flex justify-between items-center py-1">
                                <span className="flex-grow">{item.name} {item.quantity > 1 && `(${item.quantity}x)`}</span>
                                <span className="flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                                <button onClick={() => removeFromCart(item)} className="pl-2 hover:text-red-800">
                                    <PiTrashSimpleThin />
                                </button>
                            </li>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">Your cart is empty. Please add items to your cart.</p>
                    )}
                </ul>

                {items.length > 0 && (
                    <div className="text-end">
                        <div className="mt-2 text-lg">Total: ${totalPrice.toFixed(2)}</div>
                        <button
                            onClick={handlePlaceOrder}
                            className='text-lg text-gray-600 hover:text-red-950 hover:underline'
                        >
                            Place Order
                        </button>
                    </div>
                )}
            </div>

            {showPaymentForm && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Complete Your Payment</h2>
                        <Elements stripe={stripePromise}>
                            <PaymentForm totalPrice={totalPrice} handleOrderCompletion={handleOrderCompletion} />
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
