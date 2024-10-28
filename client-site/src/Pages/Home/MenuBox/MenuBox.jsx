import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Import icons

const menuData = [
    {
        category: "Our Specials",
        items: [
            { name: "Grilled Salmon", price: 25 },
            { name: "Steak with Garlic Butter", price: 30 },
        ]
    },
    {
        category: "Indian",
        items: [
            { name: "Butter Chicken", price: 18 },
            { name: "Paneer Tikka", price: 15 },
        ]
    },
    {
        category: "Bread",
        items: [
            { name: "Garlic Naan", price: 5 },
            { name: "Stuffed Paratha", price: 6 },
        ]
    },
    {
        category: "Dessert",
        items: [
            { name: "Chocolate Lava Cake", price: 7 },
            { name: "Tiramisu", price: 8 },
        ]
    }
];

const MenuBox = () => {
    // State to keep track of which category is expanded
    const [expandedCategory, setExpandedCategory] = useState(null);

    // Function to toggle category expansion
    const toggleCategory = (category) => {
        setExpandedCategory(expandedCategory === category ? null : category);
    };

    return (
        <div className="min-h-[100vh] w-full   p-4 text-black
         bg-[#e8e7e5]">
            <h2 className="text-2xl mb-4">Menu</h2>
            {menuData.map((menu) => (
                <div key={menu.category} className="mb-4">
                    <div
                        className="flex justify-between items-center cursor-pointer p-2 bg-gray-200 hover:bg-gray-300"
                        onClick={() => toggleCategory(menu.category)}
                    >
                        <span className=" text-xl">{menu.category}</span>
                        {expandedCategory === menu.category ? (
                            <FaChevronUp className="text-xl" />
                        ) : (
                            <FaChevronDown  className="text-xl"/>
                        )}
                    </div>
                    {/* Show menu items if the category is expanded */}
                    {expandedCategory === menu.category && (
                        <div className="pl-4 pt-2">
                            {menu.items.map((item) => (
                                <div key={item.name} className="flex justify-between mb-1 text-xl">
                                    <span>{item.name}</span>
                                    <span>${item.price}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MenuBox;
