import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import Swal
import { FaPen, FaTrash } from "react-icons/fa";
import Specialmenulist from "./Specialmenulist";

const AllMenuList = () => {
  const [menu, setMenu] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage, setCategoriesPerPage] = useState(3);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedPrice, setUpdatedPrice] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [updatedCategoryName, setUpdatedCategoryName] = useState("");
  const [editingVariety, setEditingVariety] = useState(null); // Track variety being edited
  const [updatedVarietyPrice, setUpdatedVarietyPrice] = useState("");

  // Fetch menu data
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/menu");
        setMenu(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    fetchMenu();
  }, []);

  // Handle item deletion with confirmation
  const handleDelete = async (category, name) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${name} from the ${category} category.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:3000/api/menu/${category}/item/${name}`
        );
        setMenu((prevMenu) =>
          prevMenu.map((cat) =>
            cat.category === category
              ? {
                  ...cat,
                  items: cat.items.filter((item) => item.name !== name),
                }
              : cat
          )
        );
        Swal.fire("Deleted!", `${name} has been deleted.`, "success");
      } catch (error) {
        console.error("Error deleting item:", error);
        Swal.fire("Error!", "There was an issue deleting the item.", "error");
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

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to update ${updatedName}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.put(
          `http://localhost:3000/api/menu/${category}/${editingItem.name}`,
          updatedItem
        );

        if (response.status === 200) {
          setMenu((prevMenu) =>
            prevMenu.map((cat) =>
              cat.category === category
                ? {
                    ...cat,
                    items: cat.items.map((i) =>
                      i.name === editingItem.name ? { ...i, ...updatedItem } : i
                    ),
                  }
                : cat
            )
          );
          setEditingItem(null);
          Swal.fire("Updated!", `${updatedName} has been updated.`, "success");
        }
      } catch (error) {
        console.error("Error updating item:", error);
        Swal.fire("Error!", "There was an issue updating the item.", "error");
      }
    }
  };

  // Handle variety update click
  const handleVarietyUpdateClick = (category, itemName, variety) => {
    setEditingVariety({ category, itemName, variety });
    setUpdatedVarietyPrice(variety.price);
  };

  // Handle variety update submission
  const handleVarietyUpdate = async () => {
    const { category, itemName, variety } = editingVariety;

    const updatedVariety = {
      name: variety.name,
      price: updatedVarietyPrice,
    };

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to update the price of ${variety.name}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.put(
          `http://localhost:3000/api/menu/${category}/${itemName}/variety/${variety.name}`,
          updatedVariety
        );

        if (response.status === 200) {
          setMenu((prevMenu) =>
            prevMenu.map((cat) =>
              cat.category === category
                ? {
                    ...cat,
                    items: cat.items.map((item) =>
                      item.name === itemName
                        ? {
                            ...item,
                            varieties: item.varieties.map((v) =>
                              v.name === variety.name
                                ? { ...v, price: updatedVarietyPrice }
                                : v
                            ),
                          }
                        : item
                    ),
                  }
                : cat
            )
          );
          setEditingVariety(null);
          Swal.fire(
            "Updated!",
            `${variety.name}'s price has been updated.`,
            "success"
          );
        }
      } catch (error) {
        console.error("Error updating variety:", error);
        Swal.fire(
          "Error!",
          "There was an issue updating the variety's price.",
          "error"
        );
      }
    }
  };

  // Pagination logic
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const slicedCategories = menu.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );
  const totalPages = Math.ceil(menu.length / categoriesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-wrap gap-4 text-black">
      <div className="container mx-auto py-8 text-black">
        <h2 className="text-center text-4xl font-chewy underline text-red-950 pt-10">
          Regular Menus
        </h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          slicedCategories.map((category) => (
            <div key={category.category} className="mb-8">
              <h3 className="font-semibold p-4 text-3xl text-orange-400">
                {category.category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.items.map((item) => (
                  <div
                    key={item.name}
                    className="bg-white border p-4 rounded shadow-md"
                  >
                    {editingItem && editingItem.name === item.name ? (
                      <div>
                        <input
                          type="text"
                          value={updatedName}
                          onChange={(e) => setUpdatedName(e.target.value)}
                          className="border px-2 bg-white py-1 mb-2 w-full"
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
                        <p>Price: £{item.price}</p>
                        {item.varieties && item.varieties.length > 0 && (
                          <div className="mt-4">
                            <h5 className="font-medium text-base text-gray-700">
                              Varieties:
                            </h5>
                            <ul className="ml-4 list-disc">
                              {item.varieties.map((variety) => (
                                <li key={variety.name} className="text-sm">
                                  {variety.name} - £{variety.price}
                                  {editingVariety &&
                                  editingVariety.variety.name ===
                                    variety.name ? (
                                    <div className="mt-2">
                                      <input
                                        type="number"
                                        value={updatedVarietyPrice}
                                        onChange={(e) =>
                                          setUpdatedVarietyPrice(e.target.value)
                                        }
                                        className="border px-2 py-1 w-full"
                                      />
                                      <button
                                        onClick={handleVarietyUpdate}
                                        className="bg-green-500 text-white px-2 py-1 mt-2 rounded"
                                      >
                                        Update
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        handleVarietyUpdateClick(
                                          category.category,
                                          item.name,
                                          variety
                                        )
                                      }
                                      className="text-blue-600 px-2 py-1 mt-2 rounded"
                                    >
                                      <FaPen />
                                    </button>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="flex space-x-2 mt-4">
                          <button
                            onClick={() =>
                              handleDelete(category.category, item.name)
                            }
                            className="text-red-600 px-2 py-1 rounded"
                          >
                            <FaTrash />
                          </button>
                          <button
                            onClick={() => handleUpdateClick(item)}
                            className="text-blue-600 px-2 py-1 rounded"
                          >
                            <FaPen />
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
        <div className="grid justify-center items-center align-middle text-center mt-6">
          <div className="flex gap-10 text-2xl justify-center mt-6">
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

          <span className="mx-4">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>
      <hr className="text-black"></hr>
      <div className="bg-orange-200 p-10">
        <h2 className="text-center text-3xl font-chewy underline text-red-950 pt-10">
          Special Platter Menus
        </h2>
        <Specialmenulist></Specialmenulist>
      </div>
    </div>
  );
};

export default AllMenuList;
