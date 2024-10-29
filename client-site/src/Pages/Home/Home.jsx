import { useState } from 'react';
import background from '../../assets/—Pngtree—vintage yellow brown texture royal_1411071.jpg';
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
            className="h-full font-sans w-screen grid lg:grid-cols-4 
            bg-cover bg-center bg-fixed 
            px-10 py-20 text-5xl gap-2 items-start justify-between"
            style={{ backgroundImage: `url(${background})`, backgroundAttachment: 'fixed' }}
        >
            <div className='col-span-3 lg:min-w-[40vw] min-w-[80vw] overflow-y-auto'>
                <MenuBox addToCart={addToCart} />
            </div>
            <div>
              <Cart items={cartItems} totalPrice={totalPrice} removeFromCart={removeFromCart} />
            </div>
        </div>
    );
};

export default Home;
