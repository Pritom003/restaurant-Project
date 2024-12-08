/* eslint-disable react/prop-types */
// import { unix } from "moment/moment";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid"; 
const SpecialMenuModal = ({ onClose, subcategories, onAddToCart, priceId }) => {
  
  // console.log(priceId.index ,';sfefe');
  const [selectedItems, setSelectedItems] = useState({});
  const [totalSubcategoryPrice, setTotalSubcategoryPrice] = useState(0); // New State
const dispatch =useDispatch()
  const handleSelect = (subcategoryName, subcategoryPrice, item) => {
    setSelectedItems((prev) => ({ ...prev, [subcategoryName]: item }));

    // Update total price when a subcategory dish is selected
    setTotalSubcategoryPrice((prevTotal) => {
      // Subtract the previously selected subcategory's price (if any)
      if (selectedItems[subcategoryName]) {
        prevTotal -= subcategories?.find((sub) => sub.name === subcategoryName)?.price || 0;
      }
      return prevTotal + subcategoryPrice; // Add new subcategory's price
    });
  };
  // console.log(totalSubcategoryPrice,"LOOOK HWEW I AM RHW PRIXEWEEEE");
  const platter = Object.values(selectedItems);


 
  const handleSubmit = () => {
    const totalPrice = priceId + totalSubcategoryPrice;
    const platterWithCategory = {
      name: uuidv4(), // Ensure this is unique
      category: "Special Platter", 
      items: platter, 
      price: totalPrice,
    };
  
    onAddToCart(platterWithCategory); 
    // Dispatch the correct action with the unique platter ID or key
    dispatch({ type: "REMOVE_FROM_CART", payload: { keys: platterWithCategory.key } });
    onClose();
  };
  

  // console.log(selectedItems,'hey gpt see how am receiveing my data '); 



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
              <h3 className="text-lg font-semibold mb-2">{subcategory.name} - £{subcategory.price} </h3>
              <ul>
                {subcategory.dishes.map((item) => (
                  <li key={item.name} className="mb-4">
                    <label className="flex items-center text-sm">
                      <input
                        type="radio"
                        name={subcategory.name}
                        value={item.name}
                        checked={selectedItems[subcategory.name]?.name === item.name}
                        onChange={() => handleSelect(subcategory.name,subcategory.price, item)}
                        className="mr-3"
                      />
                      <span>{item.name}</span>
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
          disabled={platter.length==0}
          className="mt-6 p-3 w-44 text-green-700 text-xl border-2 disabled:bg-slate-600 border-green-950 rounded-lg hover:bg-green-500 hover:text-white transition duration-300"
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