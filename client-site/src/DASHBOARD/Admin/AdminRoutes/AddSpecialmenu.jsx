import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';

const AddSpecialmenu = () => {
    const { register, control, handleSubmit, reset } = useForm({
        defaultValues: {
            category: 'Mid Week Special Platter',
            Price: 0, // Add default price
            subcategories: [], // Initialize subcategories as an array
        },
    });

    const [subcategories, setSubcategories] = useState([]);

    // Handle adding a new subcategory dynamically
    const handleAddSubcategory = () => {
        setSubcategories([...subcategories, { name: '', price: 0, dishes: [] }]);
    };

    // Handle adding items to a subcategory
    const handleAddItem = (index) => {
        const updatedSubcategories = [...subcategories];
        updatedSubcategories[index].dishes.push({ name: '' }); // Ensure dishes is an object with a "name"
        setSubcategories(updatedSubcategories);
    };

    const onSubmit = async (data) => {
        // Ensure subcategories have names and dishes before submitting
        const formattedData = {
            ...data,
            subcategories: subcategories.map((subcategory) => {
                if (!subcategory.name || !subcategory.price) {
                    alert('Please fill in the subcategory name and price');
                    return null; // Skip invalid subcategory
                }
                return {
                    name: subcategory.name,
                    price: parseFloat(subcategory.price), // Ensure price is a number
                    dishes: subcategory.dishes.map((dish) => {
                        if (!dish.name) {
                            alert('Please fill in the dish name');
                            return null;
                        }
                        return { name: dish.name }; // Ensure dishes are objects with a "name"
                    }).filter(dish => dish !== null), // Remove invalid dishes
                };
            }).filter(subcategory => subcategory !== null), // Remove invalid subcategories
        };

        // If no subcategories or price is invalid, return early
        if (formattedData.subcategories.length === 0 || !formattedData.price) {
            alert('Please fill in all required fields.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/special-menu', formattedData);
            console.log('Menu added successfully:', response.data);
            alert('Special menu added successfully!');
            reset();
            setSubcategories([]); // Clear the subcategories state after submission
        } catch (error) {
            console.error('Error adding menu:', error);
            alert('Failed to add menu. Please try again.');
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
                        {...register('category', { required: 'Category is required' })}
                        className="select bg-white text-black select-bordered w-full max-w-md"
                    >
                        <option value="Mid Week Special Platter">Mid Week Special Platter</option>
                        <option value="Chef Choice">Chef Choice</option>
                    </select>
                </div>

                {/* Price field */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Price</span>
                    </label>
                    <input
                        type="number"
                        {...register('price', { required: 'Price is required' })}
                        className="input input-bordered bg-white text-black w-full max-w-md"
                    />
                </div>

                {/* Add dynamic subcategories */}
                <div className="mt-4">
                    <h3 className="font-bold">Subcategories</h3>
                    {subcategories.map((subcategory, index) => (
                        <div key={index} className="mt-4">
                            <div className="flex items-center gap-4">
                                <input
                                    type="text"
                                    placeholder="Subcategory Name"
                                    value={subcategory.name}
                                    onChange={(e) => {
                                        const updatedSubcategories = [...subcategories];
                                        updatedSubcategories[index].name = e.target.value;
                                        setSubcategories(updatedSubcategories);
                                    }}
                                    className="input input-bordered bg-white text-black w-full max-w-md"
                                />
                                <input
                                    type="number"
                                    placeholder="Subcategory Price"
                                    value={subcategory.price}
                                    onChange={(e) => {
                                        const updatedSubcategories = [...subcategories];
                                        updatedSubcategories[index].price = parseFloat(e.target.value); // Convert to number
                                        setSubcategories(updatedSubcategories);
                                    }}
                                    className="input input-bordered bg-white text-black w-full max-w-md"
                                />
                            </div>
                            <div className="mt-2">
                                <h4 className="font-semibold">Items for {subcategory.name}</h4>
                                {subcategory.dishes.map((dish, itemIndex) => (
                                    <div key={itemIndex} className="flex items-center gap-4 mt-2">
                                        <input
                                            type="text"
                                            placeholder={`Add ${subcategory.name} Dish`}
                                            value={dish.name}
                                            onChange={(e) => {
                                                const updatedSubcategories = [...subcategories];
                                                updatedSubcategories[index].dishes[itemIndex].name = e.target.value;
                                                setSubcategories(updatedSubcategories);
                                            }}
                                            className="input input-bordered bg-white text-black w-full max-w-md"
                                        />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => handleAddItem(index)}
                                    className="btn btn-success btn-sm mt-2"
                                >
                                    Add Item to {subcategory.name}
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddSubcategory}
                        className="btn btn-primary btn-sm mt-2"
                    >
                        Add Subcategory
                    </button>
                </div>

                {/* Submit button */}
                <button type="submit" className="btn btn-primary mt-4">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddSpecialmenu;
