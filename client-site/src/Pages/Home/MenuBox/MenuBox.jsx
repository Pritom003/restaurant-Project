import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import MenuData from "./Menudatea";
// import useMenuData from "../hooks/useMenuData"; // Import the custom hook

const MenuBox = () => {
  const { menuData, loading, error } = MenuData(); // Use the custom hook
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  if (loading) return <p>Loading menu...</p>;
  if (error) return <p>Error loading menu: {error}</p>;

  return (
    <div className="min-h-[100vh] w-full p-4 text-black bg-[#e8e7e5]">
      <h2 className="text-2xl mb-4">Menu</h2>
      {menuData.map((menu) => (
        <div key={menu.category} className="mb-4">
          <div
            className="flex justify-between items-center cursor-pointer p-2 bg-gray-200 hover:bg-gray-300"
            onClick={() => toggleCategory(menu.category)}
          >
            <span className="text-xl">{menu.category}</span>
            {expandedCategory === menu.category ? (
              <FaChevronUp className="text-xl" />
            ) : (
              <FaChevronDown className="text-xl" />
            )}
          </div>
          {expandedCategory === menu.category && (
            <div className="pl-4 pt-2">
              {menu.items.map((item) => (
                <div key={item.name} className="flex justify-between mb-1 text-xl">
                  <span>{item.name}</span>
                  <span>${item.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MenuBox;
