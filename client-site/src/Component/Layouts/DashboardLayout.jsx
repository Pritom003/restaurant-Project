import { Link, Outlet } from "react-router-dom";
import { useState } from 'react';
import { FaUser, FaPlus, FaTrash, FaHome } from 'react-icons/fa'; // Import the icons you want to use
import backgroundimg from '../../assets/—Pngtree—vintage yellow brown texture royal_1411071.jpg';
import Heading from "../../Pages/Home/MenuBox/Heading";
import { GrMoney } from "react-icons/gr";
import { RiMenuSearchFill } from "react-icons/ri";
const DashboardLayout = () => { 
  const [isExpanded, setIsExpanded] = useState(false);
  const role = "user";

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="grid lg:flex  min-h-screen bg-gray-100">
      <nav 
        style={{ backgroundImage: `url(${backgroundimg})`, position: 'relative' }}
        className={`bg-cover bg-no-repeat lg:w-[180px] 
          lg:min-h-[100vh] w-full h-auto p-4 transition-all 
          duration-300 ${isExpanded ? 'h-auto' : 'h-full'}`}
      >
        {/* Overlay for the background image */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <button 
          className="block lg:hidden p-2 text-white focus:outline-none z-10" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="text-2xl">&#9660;</span> {/* Down arrow icon */}
        </button>

        <div className="pt-5 flex justify-center items-center">
          <Heading customStyle='h-12' />
        </div>

        <ul className={`mt-4 relative z-10 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        <li className="flex items-center py-2">
                <FaHome className="text-white mr-2" /> {/* User icon */}
                <Link to="/" className="block text-white">Home</Link>
              </li>
              <li className="flex items-center py-2">
                <FaUser className="text-white mr-2" /> {/* User icon */}
                <Link to="" className="block text-white">Profile</Link>
              </li>
          {role === 'admin' ? (
            <>
          
              <li className="flex items-center py-2">
                <FaPlus className="text-white mr-2" /> {/* Plus icon */}
                <Link to="add-menu" className="block text-white">Add Menu</Link>
              </li>
              <li className="flex items-center py-2">
              <RiMenuSearchFill  className="text-white mr-2" />{/* Trash icon */}
                <Link to="menus" className="block text-white"> All Dishes</Link>
              </li>
              <li className="flex items-center py-2">
              <GrMoney  className="text-white mr-2" />{/* Trash icon */}
                <Link to="menus" className="block text-white">Orders </Link>
              </li>
            </>
          ) : role === 'user' ?(
            <>
             
            </>
          ) : <Link to='/' className='text-lg text-gray-600 hover:text-red-950 hover:underline'>
          Log in 
         </Link>}
        </ul>
      </nav>

      {/* Main content area */}
      <div className="flex-1 p-6 md:mt-0 mt-4">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
        </h2>
        <Outlet className="bg-gray-400" /> {/* Child routes will render here */}
      </div>
    </div>
  );
};

export default DashboardLayout;
