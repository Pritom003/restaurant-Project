import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import MenuData from "../../../Hooks/Menudatea"; // Ensure this fetches correct menu data
import Loader from "../../../Component/Shared/Loader/Loader";
import Heading from "./Heading";
import { useDispatch } from "react-redux";

const MenuBox = ({ addToCart }) => {
  const { menuData, loading, error } = MenuData();
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [isAllergiesExpanded, setIsAllergiesExpanded] = useState(false);
  const dispatch = useDispatch();
  const toggleCategory = (category) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  return (
    <div>
      <div>
        <div className="flex justify-center mb-4 pt-8">
          <Heading />
        </div>
        <p className="text-xs text-center">
          “Serving Homestyle Authentic Indian & Bangladeshi Cuisine”
        </p>
      </div>

      <h2 className="text-2xl mb-4 text-center">Menu</h2>

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
            style={{ maxHeight: isAllergiesExpanded ? "200px" : "0px" }}
          >
            {isAllergiesExpanded && (
              <p className="text-xs text-center mt-2 px-4 w-full">
                If you have any food allergies or intolerances, please contact
                the takeaway before you place any order. We will try our best to
                accommodate your requirements. However, please be aware we cook
                a variety of menu items that contain allergens. Customers with
                severe allergies and intolerances, please be aware that there
                may be traces of a range of allergens in our food preparation
                areas. 01507 609898.
              </p>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center align-middle items-center">
            <Loader />
          </div>
        )}
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
                    ? `${menu.items.length * 80}px`
                    : "0px",
                }}
              >
                <div className="pl-4 pt-2">
                  {menu.items.map((item, index) => (
                    <div key={index} className="mb-2">
                      {menu.category === "Set Menu" ? (
                        <div className="border-b-2 border-dotted border-red-900 pb-2">
                          <div className="flex w-full text-xl justify-between">
                            {item.name}
                            <button
                              className="hover:underline"
                              onClick={() => addToCart(item)}
                            >
                              + £{item.price}
                            </button>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            <span className="font-semibold">
                              Included Items:
                            </span>
                            {item.itemsIncluded.length > 0 &&
                              item.itemsIncluded.map((includedItem, idx) => (
                                <span key={includedItem.name}>
                                  {includedItem.name} ({includedItem.quantity})
                                  {idx < item.itemsIncluded.length - 1
                                    ? ", "
                                    : ""}
                                </span>
                              ))}
                          </div>
                        </div>
                      ) : (
                        <div className="mb-1 text-xl border-b-2 border-dotted border-red-900">
                          <ul className="text-red-900 font-semibold">
                            <div className="flex w-full justify-between">
                              {item.name}
                              <button
                                className="hover:underline"
                                onClick={() => addToCart(item)} 
                                // Add item to cart
                              >
                                + £{item.price}
                              </button>
                            </div>

                            {item.varieties.length > 0 && (
                              <div className="text-xs grid justify-end gap-1 text-gray-600 mt-1">
                                {item.varieties.map((variety, idx) => (
                                  <li className="flex gap-2 justify-between" key={idx}>
                                    <span>{variety.name}</span>
                                    <button   
                                      className="hover:underline"
                                      onClick={() => {
                                        
                                        const updatedItem = {
                                          ...item,
                                          variant: variety.name || null,
                                          variantPrice: variety ? variety.price : 0,
                                          keyToRemove: idx,  // Set variant price if selected
                                        };
                                        dispatch({ type: 'ADD_TO_CART', payload: updatedItem });
                                        // addToCart(updatedItem); // Add item with updated price to cart
                                      }}
                                    >
                                      + £{variety.price.toFixed(2)} {/* Display variety price */}
                                    </button>
                                  </li>
                                ))}
                              </div>
                            )}
                          </ul>
                        </div>
                      )}
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
