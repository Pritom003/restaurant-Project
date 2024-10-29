import { useState } from 'react';
import Cart from './Cart/Cart';
import MenuBox from './MenuBox/MenuBox';

const Home = () => {
    const [cartItems, setCartItems] = useState([]);

    // Function to add item to cart
    const addToCart = (item) => {
        setCartItems((prev) => [...prev, item]);
    };

    // Function to remove item from cart
    const removeFromCart = (itemToRemove) => {
        setCartItems((prev) => prev.filter(item => item.name !== itemToRemove.name));
    };

    // Calculate total price
    const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

    return (
        <div 
            className="h-full font-sans w-full grid lg:grid-cols-4 
            px-4 md:px-8 lg:px-10 py-10 lg:py-20 text-2xl md:text-4xl lg:text-5xl gap-4 items-start"
        >
            <div className='lg:col-span-3 lg:min-w-[50vw] min-w-[40vw] overflow-y-auto'>
                <div className="max-w-full lg:max-w-[900px] mx-auto p-4 text-black bg-[#e8e7e5]">
                    <MenuBox addToCart={addToCart} />
                </div>
            </div>
            <div className='grid gap-4 lg:col-span-1 mx-auto'>
                <div className='bg-[#e8e7e5] min-w-[90vw] lg:min-w-[20vw] px-4 pb-4 pt-4 w-full min-h-56 overflow-y-auto'>
                    <Cart items={cartItems} totalPrice={totalPrice} removeFromCart={removeFromCart} />
                </div>
                <div className='bg-[#e8e7e5] px-4 pb-4 pt-4 w-full'>
                    <h3 className='border border-l-2 pl-2 text-xl border-l-red-900'>Login</h3>
                    <div className='px-5'>
                        <button className='text-lg text-gray-600 hover:text-red-950 hover:underline'>
                            Log in 
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
