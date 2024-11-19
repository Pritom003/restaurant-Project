import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { FaUser, FaPlus, FaHome, FaSignOutAlt } from "react-icons/fa";
import backgroundimg from "../../assets/vintage.jpg";
import Heading from "../../Pages/Home/MenuBox/Heading";
import { GrMoney } from "react-icons/gr";
import { RiMenuSearchFill } from "react-icons/ri";
import { AuthContext } from "../../providers/AuthProviders";
import useRole from "../../Hooks/useRole.js";
import Footer from "../Footer/Footer.jsx";

const DashboardLayout = () => {
  const { logOut, user } = useContext(AuthContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const role = "user"; // Replace with dynamic role if needed

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

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
    <div className="lg:flex lg:h-screen h-full bg-gray-100">
      {/* Sidebar for large devices */}
      <nav
        style={{ backgroundImage: `url(${backgroundimg})` }}
        className="lg:fixed lg:flex pl-4 lg:flex-col hidden top-0 left-0 h-full w-44 bg-cover bg-repeat relative"
      >
        {/* Overlay for background */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Sidebar content */}

        <div className="pt-10 pl-1 flex justify-center  items-center z-10 relative">
          <Heading customStyle="h-12 " />
        </div>
        <ul className="mt-4 relative z-10">
          <li className="flex items-center py-2">
            <FaHome className="text-white mr-2" />
            <Link to="/" className="block text-white">
              Home
            </Link>
          </li>
          
          {role === "Admin" ? (
            <>
            <li className="flex items-center py-2">
            <FaUser className="text-white mr-2" />
            <Link to="" className="block text-white">
              Profile
            </Link>
          </li>
              <li className="flex items-center py-2">
                <FaPlus className="text-white mr-2" />
                <Link to="add-menu" className="block text-white">
                  Add Menu
                </Link>
              </li>
              <li className="flex items-center py-2">
                <RiMenuSearchFill className="text-white mr-2" />
                <Link to="dishes" className="block text-white">
                  All Dishes
                </Link>
              </li>
              <li className="flex items-center py-2">
                <GrMoney className="text-white mr-2" />
                <Link to="orderList" className="block text-white">
                  Orders
                </Link>
              </li>
              <li className="flex items-center py-2">
                <FaUser className="text-white mr-2" />
                <Link to="user-list" className="block text-white">
                  All Users
                </Link>
              </li>
            </>
          ) : role === "user" ? (
            <>
              <li className="flex items-center py-2">
                <FaUser className="text-white mr-2" />
                <Link to="my-orders" className="block text-white">
                  My Orders
                </Link>
              </li>
            </>
          ) : (
            <Link
              to="/"
              className="text-lg text-gray-600 hover:text-red-950 hover:underline"
            >
              Log in
            </Link>
          )}
          {user && (
            <li className="flex items-center py-2">
              <FaSignOutAlt className="text-white mr-2" />
              <button
                onClick={handleLogout}
                className="block text-white focus:outline-none"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* Top Navbar for medium devices and smaller */}
      <nav className="lg:hidden block bg-gray-800 text-white p-4">
        <div className="flex justify-between items-center">
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="text-2xl focus:outline-none"
          >
            {isExpanded ? "▲" : "▼"} {/* Toggle arrow */}
          </button>
          <Heading customStyle="h-8 text-white" />
        </div>
        {isExpanded && (
          <ul className="flex justify-around mt-4">
            <li>
              <Link to="/" className="flex flex-col items-center">
                <FaHome />
                <span className="text-sm">Home</span>
              </Link>
            </li>
            <li>
              <Link to="" className="flex flex-col items-center">
                <FaUser />
                <span className="text-sm">Profile</span>
              </Link>
            </li>
            {role === "Admin" && (
              <>
                <li>
                  <Link to="add-menu" className="flex flex-col items-center">
                    <FaPlus />
                    <span className="text-sm">Add Menu</span>
                  </Link>
                </li>
                <li>
                  <Link to="menus" className="flex flex-col items-center">
                    <RiMenuSearchFill />
                    <span className="text-sm">Dishes</span>
                  </Link>
                </li>
                <li>
                  <Link to="orderList" className="flex flex-col items-center">
                    <GrMoney />
                    <span className="text-sm">Orders</span>
                  </Link>
                </li>
                <li>
                  <Link to="user-list" className="flex flex-col items-center">
                    <FaUser />
                    <span className="text-sm">Users</span>
                  </Link>
                </li>
              </>
            )}
            {user && (
              <li>
                <button
                  onClick={handleLogout}
                  className="flex flex-col items-center"
                >
                  <FaSignOutAlt />
                  <span className="text-sm">Logout</span>
                </button>
              </li>
            )}
          </ul>
        )}
      </nav>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto p-6 lg:ml-44">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {role === "Admin" ? "Admin Dashboard" : "User Dashboard"}
        </h2>
        <Outlet /> {/* Child routes */}
      </div>
    </div>
  );
};

export default DashboardLayout;
