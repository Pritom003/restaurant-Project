import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useMenuData from '../../../Hooks/Menudatea'; // Adjust path as needed
import Swal from 'sweetalert2';

const AddMenuItem = () => {
  const { categories, axiosSecure } = useMenuData(); // Use the custom hook to get categories
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  const { register, handleSubmit } = useForm();
  const [isSetMenu, setIsSetMenu] = useState(false);
  const [setMenuItems, setSetMenuItems] = useState([{ name: '', price: '', itemsIncluded: [{ name: '', quantity: '' }] }]);

  const onSubmit = async (data) => {
    const itemData = {
      category: isOtherCategory ? data.customCategory : data.category, // Use custom category if selected
      items: isSetMenu
        ? setMenuItems.map(item => ({
            name: item.name,
            price: item.price,
            itemsIncluded: item.itemsIncluded
          }))
        : [{ name: data.itemName, price: data.price }]
    };

    try {
      await axiosSecure.post(`/menu/${itemData.category}/item`, itemData);
      Swal.fire({
        title: 'Success!',
        text: 'Menu item added successfully!',
        icon: 'success',
        confirmButtonText: 'Okay'
      });
      setIsOtherCategory(false); // Reset state if needed
    } catch (error) {
      console.error('Error adding item:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add item. Please try again.',
        icon: 'error',
        confirmButtonText: 'Okay'
      });
    }
  };

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setIsOtherCategory(selectedCategory === 'Others'); // Set state based on selection
    setIsSetMenu(selectedCategory === 'Set Menu'); // Determine if it's a set menu
    if (selectedCategory !== 'Set Menu') {
      setSetMenuItems([{ name: '', price: '', itemsIncluded: [{ name: '', quantity: '' }] }]); // Reset set menu items
    }
  };

  const handleAddIncludedItem = (index) => {
    setSetMenuItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[index].itemsIncluded.push({ name: '', quantity: '' });
      return updatedItems;
    });
  };

  const handleSetMenuItemChange = (index, field, value) => {
    setSetMenuItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[index][field] = value;
      return updatedItems;
    });
  };

  const handleIncludedItemChange = (itemIndex, includedIndex, field, value) => {
    setSetMenuItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[itemIndex].itemsIncluded[includedIndex][field] = value;
      return updatedItems;
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Menu Item</h2>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Select Category</label>
        <select
          {...register('category', { required: true })}
          onChange={handleCategoryChange}
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
          <option value="Others">Others</option>
        </select>
      </div>
      {isOtherCategory && (
        <div className="mb-4">
          <label htmlFor="customCategory" className="block text-gray-700 font-medium">Custom Category Name</label>
          <input
            type="text"
            id="customCategory"
            {...register('customCategory', { required: true })}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
      {isSetMenu ? (
        <>
          {setMenuItems.map((item, index) => (
            <div key={index} className="mb-4 p-4 border rounded bg-gray-50 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Set Menu Item</h2>
              <input
                type="text"
                placeholder="Item Name"
                value={item.name}
                onChange={(e) => handleSetMenuItemChange(index, 'name', e.target.value)}
                className="border rounded p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) => handleSetMenuItemChange(index, 'price', e.target.value)}
                className="border rounded p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <h3 className="text-md font-medium mb-1">Included Items</h3>
              {item.itemsIncluded.map((includedItem, includedIndex) => (
                <div key={includedIndex} className="flex mb-2">
                  <input
                    type="text"
                    placeholder="Included Item Name"
                    value={includedItem.name}
                    onChange={(e) => handleIncludedItemChange(index, includedIndex, 'name', e.target.value)}
                    className="border rounded p-2 mr-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Quantity"
                    value={includedItem.quantity}
                    onChange={(e) => handleIncludedItemChange(index, includedIndex, 'quantity', e.target.value)}
                    className="border rounded p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              ))}
              <button type="button" 
                onClick={() => handleAddIncludedItem(index)}
                 className=" underline rounded p-2 mt-2">
                Add items +
              </button>
            </div>
          ))}
        </>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Item Name</label>
            <input
              type="text"
              {...register('itemName', { required: true })}
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter item name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Price</label>
            <input
              type="number"
              {...register('price', { required: true })}
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter item price"
            />
          </div>
        </>
      )}

      <button type="submit" className="bg-green-500 text-white rounded p-2 w-full">
        Submit
      </button>
    </form>
  );
};

export default AddMenuItem;
