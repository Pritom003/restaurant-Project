import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { FaUser, FaPlus, FaHome, FaSignOutAlt, FaCashRegister } from "react-icons/fa";
import { GrMoney } from "react-icons/gr";
import { RiMenuSearchFill, RiTruckFill } from "react-icons/ri";
import Heading from "../../Pages/Home/MenuBox/Heading";
import backgroundimg from "../../assets/vintage.jpg";
import { AuthContext } from "../../providers/AuthProviders";
import useRole from "../../Hooks/useRole.js";
import { ImStatsDots } from "react-icons/im";
const MenuItem = ({ to, icon, label }) => (
  <li className="flex items-center gap-2 text-xl text-white mr-2">
    {icon}
    <NavLink to={to} className="text-white mt-4">
      {label}
    </NavLink>
  </li>
);

const OrderSubMenu = ({ isOpen, toggleSubMenu }) => (
  isOpen && (
    <ul className="pl-6 mt-2 space-y-2 ">
      <MenuItem to="orderList/strip-order"
       icon={<FaCashRegister />} label="Strip Order" />
      <MenuItem to="orderList/cash-on-delivery" icon={<GrMoney />} label="Cash" />
      <MenuItem to="orderList/pickup" icon={<RiTruckFill />} label="Pickup" />
    </ul>
  )
);

const DashboardLayout = () => {
  const { logOut, user } = useContext(AuthContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [orderSubMenuOpen, setOrderSubMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [ role ]= useRole(); // Replace with dynamic role if needed

  const toggleMenu = () => setIsExpanded(!isExpanded);
  const toggleOrderSubMenu = () => setOrderSubMenuOpen(!orderSubMenuOpen);

  const handleLogout = async () => {
    try {
      await logOut();
      console.log("Logout successful");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <div className="lg:flex lg:min-h-screen h-full bg-gray-100">
      {/* Sidebar for large devices */}
      <nav
        style={{ backgroundImage: `url(${backgroundimg})` }}
        className="lg:fixed lg:flex lg:flex-col lg:min-h-screen
         pl-4 hidden lg:w-48 h-full bg-cover bg-center relative "
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black 
        opacity-60"></div>
        <div className="pt-10 z-10 relative">
          <Heading customStyle="h-12 text-white text-center" />
        </div>
        <ul className="mt-4 z-10 relative space-y-4 overflow-y-auto  mb-20">
          <MenuItem to="/" icon={<FaHome />} label="Home" />
          
          {role === "Admin" && (
            <>
              <MenuItem to="" icon={<ImStatsDots /> }
               label="Stats" />
              <MenuItem to="add-menu" icon={<FaPlus />}
               label="Add Menu" />
              <MenuItem to="dishes"
               icon={<RiMenuSearchFill />} 
               label="All Dishes" />
              <li>
                <div
                  onClick={toggleOrderSubMenu}
                  className="flex items-center cursor-pointer text-xl mt-4 text-white"
                >
                  <GrMoney className="mr-2 " />
                  Orders
                </div>
                <OrderSubMenu isOpen={orderSubMenuOpen} toggleSubMenu={toggleOrderSubMenu} />
              </li>
              <MenuItem to="user-list" icon={<FaUser />} label="All Users" />
            </>
          )}

          {user && (
            <li className="flex items-center">
              <FaSignOutAlt className="text-white mr-2" />
              <button
                onClick={handleLogout}
                className="focus:outline-none text-white"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* Navbar for medium and smaller devices */}
      <nav className="lg:hidden bg-gray-800 text-white p-4">
        <div className="flex justify-between items-center">
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="text-2xl focus:outline-none"
          >
            {isExpanded ? "▲" : "▼"}
          </button>
          <Heading customStyle="h-8 text-white" />
        </div>
        {isExpanded && (
          <ul className="flex justify-around mt-4 space-x-4">
            <MenuItem to="/" icon={<FaHome />} label="Home" />
            {role === "Admin" && (
              <>
                <MenuItem to="add-menu" icon={<FaPlus />} label="Add Menu" />
                <MenuItem to="dishes" icon={<RiMenuSearchFill />} label="Dishes" />
                <MenuItem to="user-list" icon={<FaUser />} label="Users" />
              </>
            )}
            {user && (
              <li>
                <button onClick={handleLogout} className="flex flex-col items-center">
                  <FaSignOutAlt />
                  <span className="text-sm">Logout</span>
                </button>
              </li>
            )}
          </ul>
        )}
      </nav>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 lg:ml-44">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {role === "Admin" ? "Admin Dashboard" : "User Dashboard"}
        </h2>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
