import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AddSpecialmenu = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      category: "Mid Week Special Platter",
      Price: 0, 
      set: "", 
      subcategories: [], 
    },
  });
  const [setOptions, setSetOptions] = useState([]); 
  const [subcategories, setSubcategories] = useState([]);
  const [customSet, setCustomSet] = useState(false); // Track if the custom set is selected
  useEffect(() => {
    const fetchSetOptions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/special-menu/sets');
        setSetOptions(response.data.sets);
      } catch (error) {
        console.error('Error fetching set options:', error);
      }
    };
    fetchSetOptions();
  }, []);
  const handleAddSubcategory = () => {
    setSubcategories([...subcategories, { name: "", price: 0, subquantity:0,dishes: [] }]);
  };

  const handleAddItem = (index) => {
    const updatedSubcategories = [...subcategories];
    updatedSubcategories[index].dishes.push({ name: "" });
    setSubcategories(updatedSubcategories);
  };

  const onSubmit = async (data) => {
    if (data.Price <= 0) {
      alert("Please fill in a valid price greater than 0.");
      return;
    }
  // If custom set name is provided, override the 'set' field with the custom set value
  if (data.setCustom) {
    data.set = data.setCustom;
  }

    const formattedData= {
      ...data,
      subcategories: subcategories
        .map((subcategory) => {
          if (!subcategory.name ||!subcategory.subquantity|| !subcategory.price || subcategory.price <= 0) {
            alert("Please fill in valid subcategory details.");
            return null;
          }
          return {
            name: subcategory.name,
            price: parseFloat(subcategory.price),
            subquantity: subcategory.subquantity,
            
            dishes: subcategory.dishes
              .map((dish) => {
                if (!dish.name) {
                  alert("Please fill in the dish name.");
                  return null;
                }
                return { name: dish.name };
              })
              .filter((dish) => dish !== null),
          };
        })
        .filter((subcategory) => subcategory !== null),
    };

    try {
   await axios.put(
        `http://localhost:3000/api/special-menu/${encodeURIComponent(data.category)}`,
        formattedData
      );
     
      Swal.fire({
        title: "Success!",
        text: "Menu item added successfully!",
        icon: "success",
        confirmButtonText: "Okay",
      });
      reset();
      setSubcategories([]); 
    } catch (error) {
      console.error("Error updating menu:", error.message);
      alert("Failed to update menu. Please try again.");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-3/4 mt-20 shadow-lg bg-green-50">
      <h2 className="text-2xl font-bold mb-6">Add Special Menu</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Category selection */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Category</span>
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            className="select bg-white text-black select-bordered w-full max-w-md"
          >
            <option value="Mid Week Special Platter">Mid Week Special Platter</option>
            <option value="Chef Choice">Chef Choice</option>
          </select>
        </div>
      {/* Set selection */}
      <div className="form-control">
          <label className="label">
            <span className="label-text">Set</span>
          </label>
          <select
            {...register("set", { required: "Set is required" })}
            className="select bg-white text-black select-bordered w-full max-w-md"
            onChange={(e) => setCustomSet(e.target.value === "Set custom set")}
          >
            {setOptions.map((set, index) => (
              <option key={index} value={set}>{set}</option>
            ))}
            <option value="Set custom set">Set custom set</option>
          </select>
          {customSet && (
            <input
              type="text"
              placeholder="Enter custom set name"
              className="input input-bordered w-full mt-2"
              {...register("setCustom", { required: "Custom set name is required" })}
            />
          )}
        </div>

        {/* Price field */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Price</span>
          </label>
          <input
            type="number"
            {...register("Price", { required: "Price is required", min: 0 })}
            className="input input-bordered bg-white text-black w-full max-w-md"
            step="0.01"
            min="0"
          />
          {errors.Price && <span className="text-red-500">{errors.Price.message}</span>}
        </div>

        {/* Add dynamic subcategories */}
        <div className="mt-4">
          <h3 className="font-bold">Subcategories</h3>
          {subcategories.map((subcategory, index) => (
            <div key={index} className="mt-4">
              <div className="grid grid-cols-1 items-center gap-4">
                <input
                  type="text"
                  placeholder="Subcategory Name"
                  value={subcategory.name}
                  onChange={(e) => {
                    const updatedSubcategories = [...subcategories];
                    updatedSubcategories[index].name = e.target.value;
                    setSubcategories(updatedSubcategories);
                  }}
                  className="input input-bordered w-full bg-white"
                />
                      <div className="flex gap-4">
        <input
          type="number"
          placeholder="Price"
          value={subcategory.price}
          onChange={(e) => {
            const updatedSubcategories = [...subcategories];
            updatedSubcategories[index] = { ...updatedSubcategories[index],
               price: Number(e.target.value) };
            setSubcategories(updatedSubcategories);
          }}
          className="input input-bordered w-full bg-white"
        />
        <input
          type="number"
          placeholder="Subquantity"
          value={subcategory.subquantity !== undefined ? subcategory.subquantity : 1}
          onChange={(e) => {
            const updatedSubcategories = [...subcategories];
            updatedSubcategories[index] = { ...updatedSubcategories[index], subquantity: Number(e.target.value) };
            setSubcategories(updatedSubcategories);
          }}
          className="input input-bordered w-full bg-white"
        />
      </div>
              </div>

              <div className="mt-2">
                  {subcategory.dishes.map((dish, dishIndex) => (
                    <div key={dishIndex} className="mt-2">
                      <input
                        type="text"
                        placeholder="Dish Name"
                        value={dish.name}
                        onChange={(e) => {
                          const updatedSubcategories = [...subcategories];
                          updatedSubcategories[index].dishes[dishIndex].name = e.target.value;
                          setSubcategories(updatedSubcategories);
                        }}
                        className="input input-bordered w-full bg-white"
                      />
                    </div>
                  ))}
                </div>

              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => handleAddItem(index)}
                  className="btn btn-sm mt-2 bg-white"
                >
                  Add Dish
                </button>

               
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddSubcategory}
            className="btn btn-sm mt-4 bg-white"
          >
            Add Subcategory
          </button>
        </div>

        {/* Submit button */}
        <div className="mt-8">
          <button type="submit" className="btn btn-primary w-full max-w-md">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSpecialmenu;
