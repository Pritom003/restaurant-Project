import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import MenuData from "./Menudatea";
import Loader from "../../../Component/Shared/Loader/Loader";
import Heading from "./Heading";

const MenuBox = ({ addToCart }) => { // Accept addToCart as a prop
  const { menuData, loading, error } = MenuData();
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [isAllergiesExpanded, setIsAllergiesExpanded] = useState(false);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="max-w-[80vw] lg:max-w-[900px] mx-auto p-4 text-black bg-[#e8e7e5] ">
      {/* heading */}
      <div>
        <div className="flex justify-center mb-4 pt-8">
          <Heading />
        </div>
        <p className="text-xs text-center">
          “Serving Homestyle Authentic Indian & Bangladeshi Cuisine”
        </p>
      </div>

      {/* menu heading */}
      <h2 className="text-2xl mb-4 text-center">Menu</h2>

      {/* Allergies notice */}
      <div className="">
        <div className="mb-4">
          <div
            className="flex justify-between items-center cursor-pointer p-2 bg-gray-200 hover:bg-gray-300"
            onClick={() => setIsAllergiesExpanded(!isAllergiesExpanded)}
          >
            <span className="text-xl font-semibold text-red-900 hover:underline">
              ALLERGIES
            </span>
            {isAllergiesExpanded ? (
              <FaChevronUp className="text-xl" />
            ) : (
              <FaChevronDown className="text-xl" />
            )}
          </div>
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden`}
            style={{ maxHeight: isAllergiesExpanded ? '200px' : '0px' }}
          >
            {isAllergiesExpanded && (
              <p className="text-xs text-center mt-2 px-4 w-full">
                If you have any food allergies or intolerances, please contact the
                takeaway before you place any order. We will try our best to
                accommodate your requirements. However, please be aware we cook a
                variety of menu items that contain allergens. Customers with severe
                allergies and intolerances, please be aware that there may be traces
                of a range of allergens in our food preparation areas. 01507 609898.
              </p>
            )}
          </div>
        </div>

        {/* menu */}
        {loading && <div className="flex justify-center align-middle items-center"><Loader /></div>}
        {error && <p>Error loading menu: {error}</p>}
        {!loading &&
          !error &&
          menuData.map((menu) => (
            <div key={menu.category} className="mb-4">
              <div
                className="flex justify-between items-center cursor-pointer p-2 bg-gray-200 hover:bg-gray-300"
                onClick={() => toggleCategory(menu.category)}
              >
                <span className="text-xl">{menu.category}</span>
                {expandedCategories.includes(menu.category) ? (
                  <FaChevronUp className="text-xl" />
                ) : (
                  <FaChevronDown className="text-xl" />
                )}
              </div>
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden`}
                style={{
                  maxHeight: expandedCategories.includes(menu.category)
                    ? `${menu.items.length * 50}px` // Keep dynamic height based on items
                    : '0px',
                }}
              >
                <div className="pl-4 pt-2">
                  {menu.items.map((item, index) => (
                    <div
                      key={item.name}
                      className={`flex py-2 justify-between mb-1 text-xl ${index !== menu.items.length - 1 ? 'border-b-2 border-dotted border-red-900' : ''}`}
                    >
                      <span className="text-red-900 font-semibold">
                        {item.name}
                      </span>
                      <button 
                        className="hover:underline" 
                        onClick={() => addToCart(item)} // Add item to cart
                      >
                        + ${item.price}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MenuBox;
