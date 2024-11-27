const initialState = {
    items: JSON.parse(localStorage.getItem('cartItems')) || [],
    totalPrice: JSON.parse(localStorage.getItem('cartItems'))
        ? JSON.parse(localStorage.getItem('cartItems')).reduce(
            (total, item) => total + (item.variantPrice || item.price) * (item.quantity || 1),
            0
        )
        : 0,
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const { name, variant, price, variantPrice } = action.payload;
            const key = variant ? `${name} (${variant})` : name;

            // Check if item already exists in the cart
            const existingItemIndex = state.items.findIndex(
                (item) => item.key === key
            );

            let updatedItems;
            if (existingItemIndex !== -1) {
                // If item already exists, update its quantity or price with the variant
                const updatedItem = {
                    ...state.items[existingItemIndex],
                    quantity: state.items[existingItemIndex].quantity + 1,
                    price: price + (variantPrice || 0), // Update price with the variant price
                    variant: variant || state.items[existingItemIndex].variant, // Ensure the variant is set if provided
                    variantPrice: variantPrice || state.items[existingItemIndex].variantPrice, // Update variant price
                };

                updatedItems = [...state.items];
                updatedItems[existingItemIndex] = updatedItem;
            } else {
                // If item doesn't exist, add it to the cart
                const newItem = {
                    key,
                    name,
                    variant: variant || null,
                    price: price + (variantPrice || 0), // Calculate final price
                    variantPrice: variantPrice || 0, // Store variant price separately
                    quantity: 1,
                };
                updatedItems = [...state.items, newItem];
            }

            // Update local storage and total price
            localStorage.setItem('cartItems', JSON.stringify(updatedItems));
            return {
                ...state,
                items: updatedItems,
                totalPrice: updatedItems.reduce(
                    (total, item) => total + (item.variantPrice || item.price) * item.quantity,
                    0
                ),
            };

        case 'REMOVE_FROM_CART':
            const { name: removeName, variant: removeVariant } = action.payload;
            const removeKey = removeVariant ? `${removeName} (${removeVariant})` : removeName;

            // Find the item index using the full key (name + variant)
            const removeItemIndex = state.items.findIndex(
                (item) => item.key === removeKey
            );
            let newItems;

            if (removeItemIndex !== -1) {
                const itemToRemove = state.items[removeItemIndex];

                if (itemToRemove.quantity > 1) {
                    // If quantity is more than 1, decrease the quantity
                    const updatedItem = { ...itemToRemove, quantity: itemToRemove.quantity - 1 };
                    newItems = [...state.items];
                    newItems[removeItemIndex] = updatedItem;
                } else {
                    // If quantity is 1, remove the item
                    newItems = state.items.filter((item) => item.key !== removeKey);
                }
            } else {
                newItems = state.items;
            }

            localStorage.setItem('cartItems', JSON.stringify(newItems));
            return {
                ...state,
                items: newItems,
                totalPrice: newItems.reduce(
                    (total, item) => total + (item.variantPrice || item.price) * (item.quantity || 1),
                    0
                ),
            };

        case 'CLEAR_CART':
            localStorage.removeItem('cartItems');
            return { ...state, items: [], totalPrice: 0 };

        default:
            return state;
    }
};

export default cartReducer;
