import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import MenuData from "../../../Hooks/Menudatea"; // Ensure this fetches correct menu data
import Loader from "../../../Component/Shared/Loader/Loader";
import Heading from "./Heading";
import { useDispatch } from "react-redux";
import axios from "axios";
import SpecialMenuModal from "./SpecialMenuModal";
import Swal from "sweetalert2";

const MenuBox = ({ addToCart }) => {
  const { menuData, loading, error } = MenuData();
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [isAllergiesExpanded, setIsAllergiesExpanded] = useState(false);
  const [specialMenuData, setSpecialMenuData] = useState([]);
  const [specialMenuCat, setSpecialcatMenuData] = useState([]);
  const [isSpecialMenuOpen, setIsSpecialMenuOpen] = useState(false); 


  const [isStillCantDecideOpen, setIsStillCantDecideOpen] = useState(false);
  const dispatch = useDispatch();
  const toggleCategory = (category) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };
      // Fetch Special Menu
  useEffect(() => {
    const fetchSpecialMenu = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/special-menu"); // Adjust the URL as needed
        setSpecialMenuData(response.data);
      } catch (err) {
        console.error("Failed to fetch special menu:", err);
      }
    };
    fetchSpecialMenu();
  }, []);

  // Find price of Mid Week Special Platter
    const SpecialMenuprice= specialMenuData.find(item => item.category === "Mid Week Special Platter")?.Price
    // console.log(specialMenuData,'here');
  // Handle opening modal with special menu data
  const currentDay = new Date().getDay();
  // const currentDay = 2
  // console.log(currentDay);
 

  const handleSpecialMenuClick = () => {
    const specialMenu = specialMenuData.find(
      (item) => item.category === "Mid Week Special Platter"
    );
    if (currentDay >= 1 && currentDay <= 4) {
      // Show the special menu if it's Monday to Thursday
      setSpecialcatMenuData(specialMenu.subcategories || []);
      setIsSpecialMenuOpen(true);
    } else {
      // If it's not Monday to Thursday, show the SweetAlert2 message
      Swal.fire({
        icon: "warning",
        title: "Sorry",
        text: "The Midweek Special Menu is only available from Monday to Thursday.",
        confirmButtonText: "Okay",
        confirmButtonColor: "#f44336",
      });
    }
  };
  const categories = specialMenuData.find(
    (item) => item.category === "Chef Choice"
  );
  // const cheCat=categories.category
  const handleStillCantDecideClick = () => {
 
    // console.log( ,'dehksjfeheuhehfrehfuhehe');
    setSpecialcatMenuData(categories.subcategories);
    setIsStillCantDecideOpen(true);
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
        
  
              {/* Special Menu Category */}
              
              <div
          className="flex justify-between items-center cursor-pointer p-2 bg-red-300 hover:bg-red-400"
          onClick={handleSpecialMenuClick}
        >
          <span className="text-xl font-semibold text-white">
            Special Menu - Mid Week Special Platter
          </span>
          <span className="text-xl text-white flex gap-2">
            £{SpecialMenuprice} <FaChevronDown />
          </span>
        </div>

        {/* Render SpecialMenuModal if the special menu is open */}
        {isSpecialMenuOpen && (
          <SpecialMenuModal
            onClose={() => setIsSpecialMenuOpen(false)}
            subcategories={specialMenuCat} // Pass the subcategories here
            price={SpecialMenuprice}
            onAddToCart={(platter) => {
              dispatch({ type: "ADD_TO_CART", payload: platter });
              setIsSpecialMenuOpen(false);
            }}
          />
        )}
                 

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
                            <span>{item.name}</span>
                            


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
                        <div className="mb-1 text-xl border-b-2 border-dotted py-4 border-red-900">
                          <ul className="text-red-900 font-semibold">
                            <div className="flex w-full justify-between">
                              {item.name}

                              {item.varieties.length > 0 && (
  <div className="text-xs grid justify-end gap-1 text-gray-600 mt-1">
    <select
  className="bg-white text-black  w-44"
      onChange={(e) => {
        const selectedVariety = item.varieties.find(
          (variety) => variety.name === e.target.value
        );
        
        const updatedItem = {
          ...item,
          variant: selectedVariety.name || null,
          variantPrice: selectedVariety ? selectedVariety.price : 0,
          // Track the variant name for removing specific item
          keyToRemove: selectedVariety ? selectedVariety.name : null,
        };

        // Dispatch to update cart
        dispatch({
          type: "ADD_TO_CART",
          payload: updatedItem,
        });
      }}
    >
      <option value="">Select a variety</option>
      {item.varieties.map((variety, idx) => (
        <option key={idx} value={variety.name} >
          {variety.name} - £{variety.price.toFixed(2)}
        </option>
      ))}
    </select>
  </div>
)}
                              <button
                                className="hover:underline"
                                onClick={() => addToCart(item)}
                                // Add item to cart
                              >
                                + £{item.price}
                              </button>
                            </div>

  




      
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                  
                </div>
              </div>
            </div>
          ))}

<div></div>
<div
          className="flex justify-between items-center cursor-pointer p-2 bg-red-300 hover:bg-red-400"
          onClick={handleStillCantDecideClick}
        >
          <span className="text-xl font-semibold text-white">
            still cant decide ?
          </span>
          <span className="text-xl text-white flex gap-2">
            £{SpecialMenuprice} <FaChevronDown />
          </span>
        </div>
        {/* still cant decide  */}
        

        {isStillCantDecideOpen && (
        <SpecialMenuModal
          onClose={() => setIsStillCantDecideOpen(false)}
  
          subcategories={specialMenuCat}
          price={specialMenuData?.find(item => item.category === "Mid Week Special Platter")?.Price}
          onAddToCart={(platter) => {
            // Ensure platter is an array and contains items
            if (Array.isArray(platter.items) && platter.items.length <= 2) {
              console.log(platter);
              dispatch({ type: "ADD_TO_CART", payload: platter });
              setIsStillCantDecideOpen(false);
            } else {
              Swal.fire({
                icon: "warning",
                title: "Limit Exceeded",
                text: "You can only select up to two items.",
              });
            }
          }}
          
          
          />
        )}

      </div>
    </div>
  );
};

export default MenuBox;