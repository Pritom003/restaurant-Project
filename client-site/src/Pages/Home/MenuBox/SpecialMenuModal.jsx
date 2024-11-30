import { useState } from "react";

const SpecialMenuModal = ({ onClose, subcategories, onAddToCart, price }) => {
  const [selectedItems, setSelectedItems] = useState({});

  const handleSelect = (subcategory, item) => {
    setSelectedItems((prev) => ({ ...prev, [subcategory]: item }));
  };

  const handleSubmit = () => {
    // Gather all selected items for each subcategory
    const platter = Object.values(selectedItems);

    // Create a platter object with category and selected items
    const platterWithCategory = {
      category: "Special Platter", // Add the category name
      items: platter, // Keep the selected items
      price: price,  // Pass the price from prop
    };

    // Log the platter object in a readable format
    console.log("Platter with Category and Items:", platterWithCategory);

    onAddToCart(platterWithCategory); // Pass the platter to the parent component
    onClose(); // Close the modal after submitting
  };

  return (
    <div className="fixed grid inset-0 bg-black bg-opacity-50 z-[52] justify-center items-center">
      <div className="bg-white pt-8 px-6 rounded-lg shadow-xl w-full max-w-4xl h-[80vh]">
        <h2 className="text-3xl mb-6 text-center font-semibold">Create Your Platter</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-scroll pr-4">
          {subcategories?.map((subcategory) => (
            <div key={subcategory.name} className="border-b pb-4">
              <h3 className="text-xl font-semibold mb-2">{subcategory.name}</h3>
              <ul>
                {subcategory.dishes.map((item) => (
                  <li key={item.name} className="mb-4">
                    <label className="flex items-center text-sm">
                      <input
                        type="radio"
                        name={subcategory.name}
                        value={item.name}
                        checked={selectedItems[subcategory.name]?.name === item.name}
                        onChange={() => handleSelect(subcategory.name, item)}
                        className="mr-3"
                      />
                      <span>{item.name} - <span className="font-bold">${item.price}</span></span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-2 sticky pb-4 bg-white px-6 max-w-4xl w-full">
        <button
          onClick={handleSubmit}
          className="mt-6 p-3 w-44 text-green-700 text-xl border-2 border-green-950 rounded-lg hover:bg-green-500 hover:text-white transition duration-300"
        >
          Add to Cart
        </button>
        <button
          onClick={onClose}
          className="mt-6 p-3 w-44 text-green-700 text-xl border-2 border-green-950 rounded-lg hover:bg-green-500 hover:text-white transition duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SpecialMenuModal;
