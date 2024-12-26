/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";

const MenuModal = ({ item, onClose }) => {
  // Array to track selected varieties (multiple selections allowed)
  const [selectedVarieties, setSelectedVarieties] = useState([]);
  // Single selection for spice level (radio button)
  const [selectedSpicyLevel, setSelectedSpicyLevel] = useState(null);

  const dispatch = useDispatch();

  const calculateTotalPrice = () => {
    let totalPrice = item.price || 0;

    // Calculate the total price for selected varieties
    selectedVarieties.forEach((variety) => {
      totalPrice += variety.price || 0;
    });

    // Add the price for the selected spice level (if any)
    if (selectedSpicyLevel) {
      totalPrice += selectedSpicyLevel.price || 0;
    }

    return totalPrice.toFixed(2);
  };

  const handleAddToCart = () => {
    const updatedItems = selectedVarieties.map((variety) => ({
      ...item,
      variant: variety.name,
      variantPrice: variety.price || 0,
      keyToRemove: variety.name,
    }));

    // Add spice level to each selected variety
    if (selectedSpicyLevel) {
      updatedItems.forEach((updatedItem) => {
        updatedItem.spice = selectedSpicyLevel.name;
        updatedItem.spicePrice = selectedSpicyLevel.price || 0;
      });
    }

    // Dispatch to update cart with multiple items
    updatedItems.forEach((updatedItem) => {
      dispatch({
        type: "ADD_TO_CART",
        payload: updatedItem,
      });
    });

    onClose();
  };

  const handleVarietyChange = (variety) => {
    setSelectedVarieties((prevVarieties) => {
      // Toggle variety selection (add or remove)
      if (prevVarieties.includes(variety)) {
        return prevVarieties.filter((v) => v !== variety);
      } else {
        return [...prevVarieties, variety];
      }
    });
  };

  const handleSpicyLevelChange = (level) => {
    // Set only one spicy level (radio button behavior)
    setSelectedSpicyLevel(level);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-4 w-11/12 max-w-md">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="font-bold text-red-950 text-2xl">{item.name}</h2>
          <button onClick={onClose}>
            <FaTimes className="text-red-500" />
          </button>
        </div>

        <div className="space-y-4 flex gap-20 flex-wrap align-middle items-center">
          {/* Variety selection */}
          {item.varieties.length > 0 && (
            <div>
              <h3 className="font-medium mb-2 text-orange-700 text-lg">Select Varieties:</h3>
              {item.varieties.map((variety, idx) => (
                <label key={idx} className="block">
                  <input
                    type="checkbox"
                    value={variety.name}
                    onChange={() => handleVarietyChange(variety)}
                    className="mr-2"
                  />
                  {variety.name} - £{variety.price.toFixed(2)}
                </label>
              ))}
            </div>
          )}

          {/* Spice level selection */}
          {item.spicyLevels.length > 0 && (
            <div>
              <h3 className="font-medium mb-2 text-red-900 text-xl">Select Spice Level:</h3>
              {item.spicyLevels.map((level, idx) => (
                <label key={idx} className="block">
                  <input
                    type="radio"
                    name="spice"
                    value={level.name}
                    checked={selectedSpicyLevel?.name === level.name}
                    onChange={() => handleSpicyLevelChange(level)}
                    className="mr-2"
                  />
                  {level.name} - £{level.price.toFixed(2)}
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <span className="font-bold">Total: £{calculateTotalPrice()}</span>
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
