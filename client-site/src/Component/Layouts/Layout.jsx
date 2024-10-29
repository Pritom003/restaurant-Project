import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer';
import background from '../../assets/—Pngtree—vintage yellow brown texture royal_1411071.jpg';

const Layout = () => {
    return (
        <div 
            className="min-h-screen flex flex-col bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url(${background})`, backgroundAttachment: 'fixed' }}
        >
            {/* Main content area that takes remaining vertical space */}
            <div className="flex-grow">
                <Outlet />
            </div>
            {/* Sticky Footer */}
            <Footer />
        </div>
    );
};

export default Layout;
