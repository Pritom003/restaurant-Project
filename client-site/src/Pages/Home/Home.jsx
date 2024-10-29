import background from '../../assets/—Pngtree—vintage yellow brown texture royal_1411071.jpg';
import Cart from './Cart/Cart';
import MenuBox from './MenuBox/MenuBox';

const Home = () => {
    return (
        <div 
            className="h-full font-sans w-screen grid lg:grid-cols-4 
            bg-cover bg-center bg-fixed px-10 py-20 text-5xl gap-2 items-center justify-center"
            style={{ backgroundImage: `url(${background})`, backgroundAttachment: 'fixed' }}
        >
            <div className='col-span-3 lg:min-w-[40vw] min-w-[80vw] overflow-y-auto'>
                <MenuBox />
            </div>
            <div>
              <Cart />
            </div>
        </div>
    );
};

export default Home;
