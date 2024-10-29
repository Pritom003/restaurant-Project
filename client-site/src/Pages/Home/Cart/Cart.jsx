import { PiTrashSimpleThin } from "react-icons/pi";
import { FaArrowRightLong } from "react-icons/fa6";

const Cart = ({ items = [], totalPrice, removeFromCart }) => { // Set default value for items
    return (
        <div className='bg-[#e8e7e5] px-2 pb-4 pt-4 w-[80vw] md:w-full min-h-56 overflow-y-auto'>
            <h3 className='border border-l-2 pl-2 text-xl border-l-red-900'>Cart</h3>
            <div className="mt-2 p-2 border min-h-36 border-gray-300">
                <ul className='text-xs'>
                    {items.length > 0 ? (
                        items.map((item) => (
                            <li key={item.name} className="flex justify-between items-center py-1">
                                <span className="flex-grow">{item.name}</span>
                                <span className="flex-shrink-0">${item.price.toFixed(2)}</span>
                                <button onClick={() => removeFromCart(item)} className=" pl-2 hover:text-red-800">
                                <PiTrashSimpleThin />
                                </button>
                            </li>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">Your cart is empty. Please add items to your cart.</p>
                    )}
                </ul>
                
                {/* Total price */}
                {items.length > 0 && (
                    <div className="text-end">
                        <div className="mt-2 text-lg">
                            Total: ${totalPrice.toFixed(2)}
                        </div>
                     <div className="flex justify-end  mt-2">
                     <button className="text-red-950 flex justify-end items-center gap-1 underline align-middle text-xs px-4 py-2 rounded">
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
