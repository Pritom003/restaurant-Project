import background from '../../assets/italian-cuisine-2378729_1280.jpg';
import Cart from './Cart/Cart';
import MenuBox from './MenuBox/MenuBox';

const Home = () => {
    return (
        <div
            className="h-screen w-screen grid lg:grid-cols-4 
            bg-cover bg-center px-10 text-red-700 text-5xl gap-2 items-center justify-center"
            style={{ backgroundImage: `url(${background})` }}
        >
            <div className='col-span-3'>
                <MenuBox></MenuBox>
            </div>
            <div>
              <Cart></Cart>
            </div>
        </div>
    );
};

export default Home;
