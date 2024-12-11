/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import MenuData from "../../../Hooks/Menudatea"; // Ensure this fetches correct menu data
import Loader from "../../../Component/Shared/Loader/Loader";
import Heading from "./Heading";
import { useDispatch } from "react-redux";
import axios from "axios";
import SpecialMenuModal from "./SpecialMenuModal";
import Swal from "sweetalert2";
import useRestaurantStatus from "../../../Hooks/useRestaurantStatus";

const MenuBox = ({ addToCart }) => {
  const { menuData, loading, error } = MenuData();
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [isAllergiesExpanded, setIsAllergiesExpanded] = useState(false);
  const [specialMenuData, setSpecialMenuData] = useState([]);
  const [specialMenuCat, setSpecialcatMenuData] = useState([]);
  const [isSpecialMenuOpen, setIsSpecialMenuOpen] = useState(false);
  const { isRestaurantOpen, openingTime, closingTime, loadings } =
    useRestaurantStatus();
  const [isStillCantDecideOpen, setIsStillCantDecideOpen] = useState(false);
  const [isSpecialMenuExpanded, setIsSpecialMenuExpanded] = useState(false);
  const [SpecialMenuPriceId, setSpecialMenuPriceId] = useState();
  const [SpecePriceName, setSpicenameandprice] = useState({
    name: "",
    price: 0,
  });

  // Toggle function for special menu
  const toggleSpecialMenu = () => {
    setIsSpecialMenuExpanded((prev) => !prev);
  };
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
        const response = await axios.get(
          "http://localhost:3000/api/special-menu"
        ); // Adjust the URL as needed
        setSpecialMenuData(response.data);
      } catch (err) {
        console.error("Failed to fetch special menu:", err);
      }
    };
    fetchSpecialMenu();
  }, []);

  const SpecialMenuprice = specialMenuData.find(
    (item) => item.category === "Chef Choice"
  )?.Price;
  const currentDay = new Date().getDay();
  // const currentDay = 0;
  const handleSpecialMenuClick = (item) => {
    const specialMenu = specialMenuData.find(
      (items) =>
        items.category === "Mid Week Special Platter" && item.set === items.set
    );
    const specialMenuPrice = specialMenu?.Price;
    setSpecialMenuPriceId(specialMenuPrice);
    if (currentDay >= 1 && currentDay <= 4) {
      setSpecialcatMenuData(specialMenu.subcategories || []);
      setIsSpecialMenuOpen(true);
    } else {
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

  const calculateTotalPrice = (item) => {
    console.log(item);
    let totalPrice = item.price || 0;
    if (item.variantPrice) totalPrice += SpecePriceName.price; // Add variant price
    if (item.variantPrice)
      totalPrice = item.variantPrice + SpecePriceName.price; // Add spicy level price if selected
    console.log(totalPrice);
    return totalPrice;
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
        {loadings ? (
          <p className="text-xl text-center text-green-700">........</p>
        ) : isRestaurantOpen ? (
          <p className="text-xl text-center text-green-700">
            Online orders are available until: {closingTime} (UK Time)
          </p>
        ) : (
          <p className="text-xl text-center text-red-700">
            The restaurant is currently closed. Opening time: {openingTime},
            Closing time: {closingTime}.
          </p>
        )}
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
          className="flex justify-between items-center cursor-pointer  bg-gray-300  hover:bg-orange-400"
          onClick={toggleSpecialMenu}
        >
          <span className="text-xl font-semibold text-black">
            Mid Week Special Platters
          </span>
          <span className="text-xl text-white flex gap-2">
            <FaChevronDown />
          </span>
        </div>

        {isSpecialMenuExpanded &&
          (currentDay >= 1 && currentDay <= 4 ? (
            <div
              className="transition-all duration-500 ease-in-out py-10 overflow-hidden"
              style={{
                maxHeight: isSpecialMenuExpanded ? "[full]" : "0px",
              }}
            >
              <ul className="border-b-2 border-dotted pt-2 border-red-900 ">
                {specialMenuData.map(
                  (item, idx) =>
                    item.category === "Mid Week Special Platter" && (
                      <li key={idx}>
                        <div className=" flex justify-between align-middle items-center pb-2 text-xl">
                          <span
                            onClick={() => handleSpecialMenuClick(item, idx)}
                          >
                            {item.set ? item.set : "new set"}{" "}
                            <span className="text-xs text-gray-600">
                              (Tuesday, Wednesday & Thursday ONLY)
                            </span>
                          </span>
                          <span
                            onClick={() => handleSpecialMenuClick(item, idx)}
                          >
                            £{item.Price}
                          </span>
                        </div>
                        <li className="border-b-2 border-dotted flex flex-col items-start pb-2 text-xl">
                          <ul className="list-disc text-xs text-gray-800 ml-4 mt-2">
                            <li>1 Poppadom (plain OR spice)</li>
                            <li>1 Starter</li>
                            <li>1 Main dish</li>
                            <li>1 Side dish</li>
                            <li>1 Plain Naan</li>
                            <li>1 Rice</li>
                          </ul>
                        </li>
                      </li>
                    )
                )}
              </ul>
            </div>
          ) : (
            <>
              {/* Apply white opacity overlay with warning text */}

              <ul className="border-b-2 pt-2 border-dotted border-red-900 z-20">
                {specialMenuData.map((item, idx) =>
                  item.category === "Mid Week Special Platter" ? (
                    <li key={idx} className="relative overflow-hidden">
                      {/* Rotated Text */}
                      <div
                        className="absolute top-10 left-0 right-0 bottom-0 flex 
        justify-center items-center"
                      >
                        <p
                          className="bg-red-400 text-white text-xs w-full h-8
           text-center transform rotate-[-10deg] absolute top-0 left-0 
           right-0 bottom-0"
                        >
                          Available only from Monday to Thursday!
                        </p>
                      </div>
                      <div className="flex justify-between items-center pb-2 text-xl ">
                        <span onClick={() => handleSpecialMenuClick(item, idx)}>
                          {item.set ? item.set : "new set"}
                        </span>
                        <span onClick={() => handleSpecialMenuClick(item, idx)}>
                          £{item.Price}
                        </span>
                      </div>
                      <li className="border-b-2 border-dotted flex flex-col items-start pb-2 text-xl relative">
                        <ul className="list-disc text-xs text-gray-800 ml-4 mt-2">
                          <li>1 Poppadom (plain OR spice)</li>
                          <li>1 Starter</li>
                          <li>1 Main dish</li>
                          <li>1 Side dish</li>
                          <li>1 Plain Naan</li>
                          <li>1 Rice</li>
                        </ul>
                      </li>
                    </li>
                  ) : null
                )}
              </ul>
            </>
          ))}

        {/* Render SpecialMenuModal if the special menu is open */}
        {isSpecialMenuOpen && (
          <SpecialMenuModal
            onClose={() => setIsSpecialMenuOpen(false)}
            subcategories={specialMenuCat}
            priceId={SpecialMenuPriceId}
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
                              {item.spicyLevels.length > 0 && (
                                <div className="text-xs grid justify-end gap-1 text-gray-600 mt-1">
                                  <select
                                    className="bg-white text-black w-44"
                                    onChange={(e) => {
                                      const spice = item.spicyLevels.find(
                                        (level) => level.name === e.target.value
                                      );

                                      if (spice) {
                                        // Assuming `setSpicenameandprice` updates the spice name and price in the state
                                        setSpicenameandprice({
                                          name: spice.name,
                                          price: spice.price,
                                        });
                                      }
                                    }}
                                  >
                                    <option value="">
                                      Select a spicy level
                                    </option>
                                    {item.spicyLevels.map((spicy, idx) => (
                                      <option key={idx} value={spicy.name}>
                                        {spicy.name} - £{spicy.price.toFixed(2)}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}

                              {item.varieties.length > 0 ? (
                                <div className="text-xs grid justify-end gap-1 text-gray-600 mt-1">
                                  <select
                                    className="bg-white text-black  w-44"
                                    onChange={(e) => {
                                      const selectedVariety =
                                        item.varieties.find(
                                          (variety) =>
                                            variety.name === e.target.value
                                        );

                                      const updatedItem = {
                                        ...item,
                                        spice: SpecePriceName || null,
                                        variant: selectedVariety.name || null,
                                        variantPrice: selectedVariety
                                          ? selectedVariety.price
                                          : 0,
                                        // Track the variant name for removing specific item
                                        keyToRemove: selectedVariety
                                          ? selectedVariety.name
                                          : null,
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
                                      <option key={idx} value={variety.name}>
                                        {variety.name} - £
                                        {variety.price.toFixed(2)}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              ) : (
                                <button
                                  className="hover:underline"
                                  onClick={() => {
                                    const totalPrice =
                                      calculateTotalPrice(item);
                                    addToCart({
                                      ...item,
                                      spice: SpecePriceName.name || null,
                                      totalPrice,
                                    });
                                  }}
                                >
                                  + £{calculateTotalPrice(item)}
                                </button>
                              )}
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
            priceId={SpecialMenuprice}
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
