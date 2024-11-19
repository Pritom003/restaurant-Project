import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import CategoryCards from './menus/Menucard';
import Pagination from './menus/pagination';

const AllMenuList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [editItem, setEditItem] = useState(null); // Track the item being edited

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/menu');
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleEditCategory = async (oldCategory, newCategory) => {
    try {
      const response = await axios.put('http://localhost:3000/api/menu/category', {
        oldCategory,
        newCategory,
      });
      Swal.fire('Success', response.data.message, 'success');
      fetchMenuItems();
    } catch (error) {
      Swal.fire('Error', 'Failed to update category.', 'error');
      console.error('Error updating category:', error);
    }
  };

  const handleEditItem = (category, item) => {
    setEditItem({ ...item, category }); // Set the item for editing
  };

  const handleInputChange = (field, value) => {
    setEditItem((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConfirmUpdate = async () => {
    try {
      const response = await axios.put('http://localhost:3000/api/menu/item', {
        category: editItem.category,
        name: editItem.name,
        updatedName: editItem.updatedName,
        updatedPrice: editItem.updatedPrice,
      });
      Swal.fire('Success', response.data.message, 'success');
      fetchMenuItems();
      setEditItem(null);
    } catch (error) {
      Swal.fire('Error', 'Failed to update item.', 'error');
      console.error('Error updating item:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditItem(null); // Clear edit state if canceled
  };

  const handleDelete = async (category, itemName) => {
    try {
      const response = await axios.delete('http://localhost:3000/api/menu/item', {
        data: { category, itemName },
      });
      Swal.fire('Success', response.data.message, 'success');
      fetchMenuItems(); // Refetch menu items after deletion
    } catch (error) {
      Swal.fire('Error', 'Failed to delete item.', 'error');
      console.error('Error deleting item:', error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedItems = menuItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 text-black">
      <h1 className="text-2xl font-bold mb-4">All Menu Items</h1>
      {paginatedItems.map((menu) => (
        <CategoryCards
          key={menu.category}
          category={menu.category}
          items={menu.items}
          onEditCategory={handleEditCategory}
          onEdit={handleEditItem}
          onDelete={handleDelete}
          editItem={editItem}
          handleInputChange={handleInputChange}
          handleConfirmUpdate={handleConfirmUpdate}
          handleCancelEdit={handleCancelEdit}
        />
      ))}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(menuItems.length / itemsPerPage)}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AllMenuList;
