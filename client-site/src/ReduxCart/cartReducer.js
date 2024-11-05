// reducer.js
const initialState = {
    items: JSON.parse(localStorage.getItem('cartItems')) || [],
    totalPrice: 0,
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const existingItemIndex = state.items.findIndex(item => item.name === action.payload.name);
            let updatedItems;

            if (existingItemIndex !== -1) {
                const updatedItem = {
                    ...state.items[existingItemIndex],
                    quantity: (state.items[existingItemIndex].quantity || 1) + 1
                };
                updatedItems = [...state.items];
                updatedItems[existingItemIndex] = updatedItem;
            } else {
                const newItem = { ...action.payload, quantity: 1 };
                updatedItems = [...state.items, newItem];
            }

            localStorage.setItem('cartItems', JSON.stringify(updatedItems));
            return {
                ...state,
                items: updatedItems,
                totalPrice: state.totalPrice + action.payload.price,
            };
        case 'REMOVE_FROM_CART':
            const itemIndex = state.items.findIndex(item => item.name === action.payload.name);
            let newItems;

            if (itemIndex !== -1) {
                const item = state.items[itemIndex];

                if (item.quantity > 1) {
                    // Decrease the quantity
                    const updatedItem = { ...item, quantity: item.quantity - 1 };
                    newItems = [...state.items];
                    newItems[itemIndex] = updatedItem;
                } else {
                    // Remove the item if quantity is 1
                    newItems = state.items.filter(item => item.name !== action.payload.name);
                }
            } else {
                newItems = state.items; // No change if item not found
            }

            localStorage.setItem('cartItems', JSON.stringify(newItems));
            return {
                ...state,
                items: newItems,
                totalPrice: newItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0),
            };
        default:
            return state;
    }
};

export default cartReducer;
