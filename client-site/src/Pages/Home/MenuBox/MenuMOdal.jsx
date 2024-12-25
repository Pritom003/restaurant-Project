/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";

const MenuModal = ({ item, onClose, }) => {
  const [selectedVariety, setSelectedVariety] = useState(null);
  const [selectedSpicyLevel, setSelectedSpicyLevel] = useState(null);

  const dispatch = useDispatch();
  const calculateTotalPrice = () => {
    let totalPrice = item.price || 0;
    if (selectedVariety) totalPrice += selectedVariety.price;
    if (selectedSpicyLevel) totalPrice += selectedSpicyLevel.price;
    return totalPrice.toFixed(2);
  };

  const handleAddToCart = () => {
    const totalPrice = calculateTotalPrice();

    const updatedItem = {
        ...item,
        spice: selectedSpicyLevel?.name || null,
        spicePrice: selectedSpicyLevel?.price || null,
        variant: selectedVariety?.name || null,
        variantPrice: 
        totalPrice
          || 0,
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


    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-4 w-11/12 max-w-md">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className=" font-bold text-red-950 text-2xl ">{item.name}</h2>
          <button onClick={onClose}>
            <FaTimes className="text-red-500" />
          </button>
        </div>
        <div className="space-y-4 flex gap-20 flex-wrap align-middle items-center">
        <div>   {item.varieties.length > 0 && (
            <div>
              <h3 className="font-medium mb-2 text-orange-700 text-lg">Select a Variety:</h3>
              {item.varieties.map((variety, idx) => (
                <label key={idx} className="block">
                  <input
                    type="radio"
                    name="variety"
                    value={variety.name}
                    onChange={() => setSelectedVariety(variety)}
                    className="mr-2"
                  />
                  {variety.name} - £{variety.price.toFixed(2)}
                </label>
              ))}
            </div>
          )}</div> 
        <div>  {item.spicyLevels.length > 0 && (
            <div>
              <h3 className="font-medium mb-2 text-red-900 text-xl">Select Spice Level:</h3>
              {item.spicyLevels.map((level, idx) => (
                <label key={idx} className="block">
                  <input
                    type="radio"
                    name="spice"
                    value={level.name}
                    onChange={() => setSelectedSpicyLevel(level)}
                    className="mr-2"
                  />
                  {level.name} - £{level.price.toFixed(2)}
                </label>
              ))}
            </div>
          )}</div>
        </div>
        <div className="mt-6 flex justify-between items-center">
          <span className="font-bold">Total: £{calculateTotalPrice()}</span> 
          {/* here i am getting the perfect toatal but in the cart iam only gettting the variety price calculateTotalPrice is correct but the price thta are adding to the cart is getting worngconst handleAddToCart = () => {
  */}
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuModal;
