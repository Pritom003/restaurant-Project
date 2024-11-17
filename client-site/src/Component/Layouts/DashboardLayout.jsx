import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { FaUser, FaPlus,  FaHome, FaSignOutAlt } from "react-icons/fa";
import backgroundimg from "../../assets/vintage.jpg";
import Heading from "../../Pages/Home/MenuBox/Heading";
import { GrMoney } from "react-icons/gr";
import { RiMenuSearchFill } from "react-icons/ri";
import { AuthContext } from "../../providers/AuthProviders";
// import { AuthContext } from "../../context/AuthProvider"; // Import AuthContext
import useRole from '../../Hooks/useRole.js';
const DashboardLayout = () => {
  const { logOut, user } = useContext(AuthContext); // Access logOut and user from AuthContext
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const role = "Admin"; // Replace with dynamic role if needed
  // const[role] = useRole()
console.log(role,'from dashboard');
  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      console.log("Logout successful");
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <div className="grid lg:flex bg-gray-100">
      <nav
        style={{ backgroundImage: `url(${backgroundimg})`, position: "relative" }}
        className={`bg-cover bg-no-repeat lg:w-[180px] 
          lg:h-screen w-full h-auto p-4 transition-all 
          duration-300 ${isExpanded ? "h-auto" : "h-full"}`}
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
          <Heading customStyle="h-12" />
        </div>

        <ul className={`mt-4 relative z-10 ${isExpanded ? "block" : "hidden lg:block"}`}>
          <li className="flex items-center py-2">
            <FaHome className="text-white mr-2" />
            <Link to="/" className="block text-white">
              Home
            </Link>
          </li>
          <li className="flex items-center py-2">
            <FaUser className="text-white mr-2" />
            <Link to="" className="block text-white">
              Profile
            </Link>
          </li>
          {role === "Admin" ? (
            <>
              <li className="flex items-center py-2">
                <FaPlus className="text-white mr-2" />
                <Link to="add-menu" className="block text-white">
                  Add Menu
                </Link>
              </li>
              <li className="flex items-center py-2">
                <RiMenuSearchFill className="text-white mr-2" />
                <Link to="menus" className="block text-white">
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
              {/* Add user-specific links here */}
            </>
          ) : (
            <Link
              to="/"
              className="text-lg text-gray-600 hover:text-red-950 hover:underline"
            >
              Log in
            </Link>
          )}

          {/* Logout button */}
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

      {/* Main content area */}
      <div className="flex-1 p-6 md:mt-0 mt-4">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {role === "Admin" ? "Admin Dashboard" : "User Dashboard"}
        </h2>
        <Outlet className="bg-gray-400" /> {/* Child routes will render here */}
      </div>
    </div>
  );
};

export default DashboardLayout;
