import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { PiTrashSimpleThin } from "react-icons/pi";
import { FaArrowRightLong } from "react-icons/fa6";
import Swal from 'sweetalert2';

const Cart = () => {
    const dispatch = useDispatch();
    const { items, totalPrice } = useSelector((state) => state);

    const removeFromCart = (item) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: item });
    };

    const handlePlaceOrder = async () => {
        const chefEmail = "njahanpritom65@gmail.com";
        const orderData = {
            chefEmail,
            userEmail: "fariadamd55@gmail.com", 
            items: items,
            totalPrice: totalPrice,
        };
    
        try {
            const response = await axios.post('http://localhost:3000/api/orders', orderData); // Forward to your backend
            console.log(response.data); // Handle response as needed

            // Show success message with SweetAlert2
            Swal.fire({
                title: 'Success!',
                text: 'Your order has been placed successfully!',
                icon: 'success',
                confirmButtonText: 'Okay'
            });

            // Optionally, clear the cart after successful order placement
            dispatch({ type: 'CLEAR_CART' }); // If you have a CLEAR_CART action
        } catch (error) {
            console.error('Error placing order:', error.message);

            // Show error message with SweetAlert2
            Swal.fire({
                title: 'Error!',
                text: 'There was an issue placing your order. Please try again.',
                icon: 'error',
                confirmButtonText: 'Okay'
            });
        }
    };
    return (
        <div>
            <h3 className='border border-l-2 pl-2 text-xl border-l-red-900'>Cart</h3>
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
                        <div className="flex justify-end mt-2">
                            <button
                                className="text-red-950 flex justify-end items-center gap-1 underline align-middle text-xs px-4 py-2 rounded"
                                onClick={handlePlaceOrder}
                            >
                                Place Order <FaArrowRightLong />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
