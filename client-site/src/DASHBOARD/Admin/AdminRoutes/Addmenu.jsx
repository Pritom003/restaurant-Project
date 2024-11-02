import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const Addmenu = () => {
    const { register, handleSubmit, watch, setValue } = useForm();
    const [category, setCategory] = useState('');

    // Watching the category input to determine which fields to show
    const selectedCategory = watch('category');

    // Handling form submission
    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:3000/api/menu', data);
            console.log('Menu added:', response.data);
            // You can reset the form or show a success message here
        } catch (error) {
            console.error('Error adding menu:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="category" className="block">Category:</label>
                <select
                    {...register('category')}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        setValue('category', e.target.value);
                    }}
                    className="border p-2"
                >
                    <option value="">Select a category</option>
                    <option value="indian">Indian</option>
                    <option value="dessert">Dessert</option>
                    <option value="set-menu">Set Menu</option>
                    <option value="snacks">Snacks</option>
                    <option value="others">Others</option>
                </select>
            </div>

            {(selectedCategory === 'set-menu' || selectedCategory === 'others') && (
                <div>
                    {selectedCategory === 'set-menu' && (
                        <>
                            <label htmlFor="includedItems" className="block">Included Items:</label>
                            <input
                                type="text"
                                {...register('includedItems')}
                                className="border p-2 w-full"
                                placeholder="Enter included items"
                            />
                        </>
                    )}
                    {selectedCategory === 'others' && (
                        <>
                            <label htmlFor="otherCategory" className="block">Enter Other Category Name:</label>
                            <input
                                type="text"
                                {...register('otherCategory')}
                                className="border p-2 w-full"
                                placeholder="Enter category name"
                            />
                        </>
                    )}
                </div>
            )}

            <div>
                <label htmlFor="items" className="block">Items:</label>
                <input
                    type="text"
                    {...register('items')}
                    className="border p-2 w-full"
                    placeholder="Enter items"
                />
            </div>

            <div>
                <label htmlFor="price" className="block">Price:</label>
                <input
                    type="number"
                    {...register('price')}
                    className="border p-2 w-full"
                    placeholder="Enter price"
                />
            </div>

            <div>
                <label htmlFor="image" className="block">Image URL:</label>
                <input
                    type="text"
                    {...register('image')}
                    className="border p-2 w-full"
                    placeholder="Enter image URL"
                />
            </div>

            <button type="submit" className="bg-blue-500 text-white p-2">Add Menu</button>
        </form>
    );
};

export default Addmenu;
