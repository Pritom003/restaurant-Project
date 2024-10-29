import React from 'react';

const Cart = () => {
    return (
        <div className='bg-[#e8e7e5] px-2 pb-4 pt-4 w-[80vw] md:w-full min-h-56 overflow-y-auto'>
            <h3 className='border border-l-2 pl-2 text-xl border-l-red-900'>Cart</h3>
            <div className="mt-2 p-2 border border-gray-300">
                {/* Placeholder for selected items */}
                <ul className='text-xs'>
                    <li className="flex justify-between py-1 border-b border-gray-300">
                        <span>Sample Item 1</span>
                        <span>$10.00</span>
                    </li>
                    <li className="flex justify-between py-1 border-b border-gray-300">
                        <span>Sample Item 2</span>
                        <span>$15.50</span>
                    </li>
                </ul>
                {/* Placeholder for total price */}
                <div className="mt-2  text-lg">
                    Total: $25.50
                </div>
                {/* Message if no items are selected */}
                {/* You can toggle this later when functionality is added */}
                {/* <p className="text-center text-gray-500">Your cart is empty. Please add items to your cart.</p> */}
            </div>
        </div>
    );
};

export default Cart;
