import { useState } from "react";
import { useForm } from "react-hook-form";
import useMenuData from "../../../Hooks/Menudatea"; // Adjust path as needed
import Swal from "sweetalert2";
import axios from "axios";
import AddSpecialmenu from "./AddSpecialmenu";

const AddMenuItem = () => {
  const { categories } = useMenuData(); // Use the hook to get categories
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  const { register, handleSubmit } = useForm();
  const [isSetMenu, setIsSetMenu] = useState(false);
  const [setMenuItems, setSetMenuItems] = useState([
    { name: "", price: "", itemsIncluded: [{ name: "", quantity: "" }] },
  ]);
  const [varieties, setVarieties] = useState([{ name: "", price: "" }]);
  const [spicyLevels, setSpicyLevels] = useState([{ name: "", price: "" }]);

  const onSubmit = async (data) => {
    const itemData = {
      category: isOtherCategory ? data.customCategory : data.category, // Use custom category if selected
      items: isSetMenu
        ? setMenuItems.map((item) => ({
            name: item.name,
            price: item.price,
         
            itemsIncluded: item.itemsIncluded,
          }))
        : [
            {
              name: data.itemName,
              descrpition:data.descrpition,
              price: data.price,
              varieties: varieties.filter(
                (variety) => variety.name && variety.price
              ), // Include varieties if any
              spicyLevels: spicyLevels.filter(
                (level) => level.name && level.price
              ), // Include spicy levels if any
            },
          ],
    };

    try {
      await axios.post(
        `http://localhost:3000/api/menu/${itemData.category}/item`,
        itemData
      );
      Swal.fire({
        title: "Success!",
        text: "Menu item added successfully!",
        icon: "success",
        confirmButtonText: "Okay",
      });

      // Reset form and state after submission
      setVarieties([{ name: "", price: "" }]);
      setSpicyLevels([{ name: "", price: "" }]);
      setIsOtherCategory(false);
      setIsSetMenu(false);
      setSetMenuItems([
        { name: "", price: "", itemsIncluded: [{ name: "", quantity: "" }] },
      ]);
    } catch (error) {
      console.error("Error adding item:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to add item. Please try again.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setIsOtherCategory(selectedCategory === "Others"); // Set state based on selection
    setIsSetMenu(selectedCategory === "Set Menu"); // Determine if it's a set menu
    if (selectedCategory !== "Set Menu") {
      setSetMenuItems([
        { name: "", price: "",itemsIncluded: [{ name: "", quantity: "" }] },
      ]); // Reset set menu items
    }
  };

  const handleAddIncludedItem = (index) => {
    setSetMenuItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index].itemsIncluded.push({ name: "", quantity: "" });
      return updatedItems;
    });
  };

  const handleSetMenuItemChange = (index, field, value) => {
    setSetMenuItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index][field] = value;
      return updatedItems;
    });
  };

  const handleIncludedItemChange = (itemIndex, includedIndex, field, value) => {
    setSetMenuItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[itemIndex].itemsIncluded[includedIndex][field] = value;
      return updatedItems;
    });
  };

  const handleAddVariety = () => {
    setVarieties((prevVarieties) => [
      ...prevVarieties,
      { name: "", price: "" },
    ]);
  };

  const handleVarietyChange = (index, field, value) => {
    setVarieties((prevVarieties) => {
      const updatedVarieties = [...prevVarieties];
      updatedVarieties[index][field] = value;
      return updatedVarieties;
    });
  };

  const handleAddSpicyLevel = () => {
    setSpicyLevels((prevLevels) => [...prevLevels, { name: "", price: "" }]);
  };

  const handleSpicyLevelChange = (index, field, value) => {
    setSpicyLevels((prevLevels) => {
      const updatedLevels = [...prevLevels];
      updatedLevels[index][field] = value;
      return updatedLevels;
    });
  };

  console.log("From Front End", spicyLevels);

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-lg mx-auto p-4 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Add Menu Item</h2>

        {/* Category Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">
            Select Category
          </label>
          <select
            {...register("category", { required: true })}
            onChange={handleCategoryChange}
            className="border rounded p-2 w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Custom Category Input */}
        {isOtherCategory && (
          <div className="mb-4">
            <label
              htmlFor="customCategory"
              className="block text-gray-700 font-medium"
            >
              Custom Category Name
            </label>
            <input
              type="text"
              id="customCategory"
              {...register("customCategory", { required: true })}
              className="border rounded p-2 bg-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Set Menu Item Handling */}
        {isSetMenu ? (
          setMenuItems.map((item, index) => (
            <div
              key={index}
              className="mb-4 p-4 border rounded bg-gray-50 shadow-sm"
            >
              <h3 className="text-lg font-semibold mb-2">Set Menu Item</h3>
              <input
                type="text"
                placeholder="Item Name"
                value={item.name}
                onChange={(e) =>
                  handleSetMenuItemChange(index, "name", e.target.value)
                }
                className="border rounded bg-white p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) =>
                  handleSetMenuItemChange(index, "price", e.target.value)
                }
                step="0.01"
                min="0"
                className="border rounded bg-white p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <h4 className="text-md font-medium mb-2">Included Items</h4>
              {item.itemsIncluded.map((includedItem, includedIndex) => (
                <div key={includedIndex} className="flex mb-2 space-x-2">
                  <input
                    type="text"
                    placeholder="Included Item Name"
                    value={includedItem.name}
                    onChange={(e) =>
                      handleIncludedItemChange(
                        index,
                        includedIndex,
                        "name",
                        e.target.value
                      )
                    }
                    className="border p-2 rounded flex-1"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={includedItem.quantity}
                    onChange={(e) =>
                      handleIncludedItemChange(
                        index,
                        includedIndex,
                        "quantity",
                        e.target.value
                      )
                    }
                    className="border p-2 rounded w-24"
                    required
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddIncludedItem(index)}
                className="underline mt-2"
              >
                Add Included Item +
              </button>
            </div>
          ))
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">
                Item Name
              </label>
              <input
                type="text"
                {...register("itemName", { required: true })}
                className="border rounded p-2 w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Price</label>
              <input
                type="number"
                {...register("price", { required: true })}
                step="0.01"
                min="0"
                className="border rounded p-2 w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
  <label className="block text-gray-700 font-medium">Description</label>
  <input
    type="text"
    {...register("descrpition", { required: true })}
    className="border rounded p-2 w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

          </>
        )}

        {/* Varieties */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Varieties</label>
          {varieties.map((variety, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="text"
                placeholder="Variety Name"
                value={variety.name}
                onChange={(e) =>
                  handleVarietyChange(index, "name", e.target.value)
                }
                className="border rounded p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Price"
                value={variety.price}
                onChange={(e) =>
                  handleVarietyChange(index, "price", e.target.value)
                }
                step="0.01"
                min="0"
                className="border rounded p-2 w-24 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddVariety}
            className="underline mt-2"
          >
            Add Variety +
          </button>
        </div>

        {/* Spicy Levels */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">
            Spicy Levels
          </label>
          {spicyLevels.map((level, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="text"
                placeholder="Spicy Level Name"
                value={level.name}
                onChange={(e) =>
                  handleSpicyLevelChange(index, "name", e.target.value)
                }
                className="border rounded p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Price"
                value={level.price}
                onChange={(e) =>
                  handleSpicyLevelChange(index, "price", e.target.value)
                }
                step="0.01"
                min="0"
                className="border rounded p-2 w-24 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSpicyLevel}
            className="underline mt-2"
          >
            Add Spicy Level +
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
      <AddSpecialmenu />
    </div>
  );
};

export default AddMenuItem;
