import axios from "axios";
import { useEffect, useState } from "react";
import { FaTrash } from 'react-icons/fa'; // Import the trash icon
import Swal from 'sweetalert2'; // Import SweetAlert2

const Specialmenulist = () => {
    const [specialmenulist, setSpecialmenulist] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch the menu list
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/special-menu');
                setSpecialmenulist(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching menu:', error);
            }
        };

        fetchMenu();
    }, []);

    // Handle delete functionality with SweetAlert2 confirmation
    const deleteItem = async (categoryName, subcategoryName, dishName) => {
        const itemType = dishName ? 'Dish' : subcategoryName ? 'Subcategory' : 'Category';
        const itemName = dishName || subcategoryName || categoryName;

        // SweetAlert2 confirmation prompt
        const result = await Swal.fire({
            title: `Are you sure you want to delete this ${itemType}?`,
            text: `This will delete the ${itemName} permanently.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel',
        });

        if (result.isConfirmed) {
            try {
                if (dishName) {
                    // Deleting a single dish from a subcategory
                    await axios.delete(`http://localhost:3000/api/special-menu/${categoryName}/${subcategoryName}/dish/${dishName}`);
                } else if (subcategoryName) {
                    // Deleting a subcategory from a category
                    await axios.delete(`http://localhost:3000/api/special-menu/${categoryName}/subcategory/${subcategoryName}`);
                } else {
                    // Deleting a category
                    await axios.delete(`http://localhost:3000/api/special-menu/${categoryName}`);
                }

                // Refresh the menu list after deletion
                const response = await axios.get('http://localhost:3000/api/special-menu');
                setSpecialmenulist(response.data);

                // Success confirmation
                Swal.fire('Deleted!', `${itemType} has been deleted.`, 'success');
            } catch (error) {
                console.error('Error deleting item:', error);
                Swal.fire('Error!', 'There was an issue deleting the item.', 'error');
            }
        } else {
            Swal.fire('Cancelled', 'The item was not deleted.', 'info');
        }
    };

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="flex gap-4 flex-wrap max-w-1/2">
                    {specialmenulist.map((category, id) => (
                        <div key={id}>
                           <span className=" flex justify-center align-middle items-center gap-2 ">
                           <h3 className=" text-2xl font-bold  underline  pt-10 pb-5">{category.category}</h3>
                            <button onClick={() => deleteItem(category.category)} 
                            
                            className="text-red-500 text-lg pt-5">
                                <FaTrash />
                            </button>
                           </span>
                            {category.subcategories.map((subcategory) => (
                                <div key={subcategory.name}>
                                     <span className=" flex justify-center align-middle items-center gap-2 ">
                           <h3 className=" text-xl font-semibold underline  pt-2 ">{subcategory.name} - ${subcategory.price}</h3>
                            <button onClick={() => deleteItem(category.category, subcategory.name)}
                            
                            className="text-red-900 text-sm pt-5">
                                <FaTrash />
                            </button>
                           </span>
                                   
                                    <ul>
                                        {subcategory.dishes.map((dish) => (
                                            <li className=" flex  text-xs" key={dish.name}>
                                                {dish.name} 
                                                <button 
                                                 onClick={() => deleteItem(category.category, subcategory.name, dish.name)} 
                                                 className="text-black text-[10px] pl-2 ">
                                                    <FaTrash /> 
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Specialmenulist;
