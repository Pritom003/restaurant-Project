import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import Swal
import { FaPen, FaTrash } from 'react-icons/fa';
import Specialmenulist from './Specialmenulist';

const AllMenuList = () => {
  const [menu, setMenu] = useState([]); // Default to an empty array
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage, setCategoriesPerPage] = useState(3); // Change this value to show 3 categories per page
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null); // State to track the item being edited
  const [updatedName, setUpdatedName] = useState('');
  const [updatedPrice, setUpdatedPrice] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);  // State to track the category being edited
const [updatedCategoryName, setUpdatedCategoryName] = useState('');


  // Fetch menu data
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/menu');
        setMenu(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    };

    fetchMenu();
  }, []);

  // Handle item deletion with confirmation
  const handleDelete = async (category, name) => {
    // Show confirmation dialog before deleting
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${name} from the ${category} category.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/menu/${category}/item/${name}`);
        setMenu(prevMenu =>
          prevMenu.map(cat =>
            cat.category === category
              ? { ...cat, items: cat.items.filter(item => item.name !== name) }
              : cat
          )
        );
        Swal.fire('Deleted!', `${name} has been deleted.`, 'success');
      } catch (error) {
        console.error('Error deleting item:', error);
        Swal.fire('Error!', 'There was an issue deleting the item.', 'error');
      }
    }
  };

  // Handle update click to enter edit mode
  const handleUpdateClick = (item) => {
    setEditingItem(item);
    setUpdatedName(item.name);
    setUpdatedPrice(item.price);
  };

  // Handle update submission with confirmation
  const handleUpdate = async (category) => {
    const updatedItem = {
      name: updatedName,
      price: updatedPrice,
    };

    // Show confirmation dialog before updating
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to update ${updatedName}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.put(`http://localhost:3000/api/menu/${category}/${editingItem.name}`, updatedItem);

        if (response.status === 200) {
          // Update the menu state after successful update
          setMenu(prevMenu =>
            prevMenu.map(cat =>
              cat.category === category
                ? {
                    ...cat,
                    items: cat.items.map(i =>
                      i.name === editingItem.name ? { ...i, ...updatedItem } : i
                    ),
                  }
                : cat
            )
          );
          setEditingItem(null); // Exit edit mode
          Swal.fire('Updated!', `${updatedName} has been updated.`, 'success');
        }
      } catch (error) {
        console.error('Error updating item:', error);
        Swal.fire('Error!', 'There was an issue updating the item.', 'error');
      }
    }
  };
const handleCategoryUpdate = async (oldCategoryName) => {
  const updatedCategory = { newCategoryName: updatedCategoryName };

  // Show confirmation dialog before updating category
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: `You are about to update the category name to ${updatedCategoryName}.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, update it!',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    try {
      const response = await axios.put(`http://localhost:3000/api/menu/category/${oldCategoryName}`, updatedCategory);
      if (response.status === 200) {
        // Update the menu state after successful update
        setMenu((prevMenu) =>
          prevMenu.map((cat) =>
            cat.category === oldCategoryName
              ? { ...cat, category: updatedCategoryName }
              : cat
          )
        );
        setEditingCategory(null); // Exit edit mode
        Swal.fire('Updated!', `Category name has been updated to ${updatedCategoryName}.`, 'success');
      }
    } catch (error) {
      console.error('Error updating category name:', error);
      Swal.fire('Error!', 'There was an issue updating the category name.', 'error');
    }
  }
};

  // Pagination logic
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const slicedCategories = menu.slice(indexOfFirstCategory, indexOfLastCategory); // Slice categories for pagination
  const totalPages = Math.ceil(menu.length / categoriesPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
  <div className=' flex flex-wrap gap -4 text-black'>
      <div className="container mx-auto py-8 text-black">
      <h2 className=' text-center text-4xl font-chewy underline text-red-950 pt-10 '>
      Regular Menus
    </h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        slicedCategories.map((category) => (
          <div key={category.category} className="mb-8">
            <h3 className=" font-semibold p-4 text-3xl text-orange-400">{category.category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items.map((item) => (
                <div key={item.name} className="bg-white border p-4 rounded shadow-md">
                  {editingItem && editingItem.name === item.name ? (
                    <div>
                      <input
                        type="text"
                        value={updatedName}
                        onChange={(e) => setUpdatedName(e.target.value)}
                        className="border px-2  bg-white py-1 mb-2 w-full"
                      />
                      <input
                        type="number"
                        value={updatedPrice}
                        onChange={(e) => setUpdatedPrice(e.target.value)}
                        className="border px-2 py-1 mb-2 bg-white w-full"
                      />
                      <div className="flex space-x-2 mt-4">
                        <button
                          onClick={() => handleUpdate(category.category)}
                          className="bg-green-500 text-white px-2 py-1 rounded"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setEditingItem(null)}
                          className="bg-gray-500 text-white px-2 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-semibold text-lg">{item.name}</h4>
                      <p>Price:£{item.price}</p>
                      <div className="flex space-x-2 mt-4">
                        <button
                          onClick={() => handleDelete(category.category, item.name)}
                          className="text-red-600 px-2 py-1 rounded"
                        >
                          <FaTrash></FaTrash>
                        </button>
                        <button
                          onClick={() => handleUpdateClick(item)}
                          className="text-blue-600  px-2 py-1 rounded"
                        >
                          <FaPen></FaPen>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
      {/* Pagination */}
      <div className="grid justify-center items-center align-middle text-center mt-6">
       <div className="flex  gap-10 text-2xl justify-center mt-6">
       <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 border"
        >
          Prev
        </button>
        
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 border"
        >
          Next
        </button>
       </div>

        <span className="mx-4">Page {currentPage} of {totalPages}</span>
        
      </div>
     
    </div>
    <hr className=' text-black'></hr>
   <div className=' bg-orange-200 p-10 '>
    <h2 className=' text-center text-3xl font-chewy underline text-red-950 pt-10 '>
      Special Platter Menus 
    </h2>
   <Specialmenulist></Specialmenulist>
   </div>
  </div>
  );
};

export default AllMenuList;