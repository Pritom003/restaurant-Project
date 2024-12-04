/* eslint-disable no-case-declarations */
const initialState = {
  items: JSON.parse(localStorage.getItem('cartItems')) || [],
  totalPrice: 0,
};

// Calculate total price at initialization
if (initialState.items.length > 0) {
  initialState.totalPrice = initialState.items.reduce(
    (total, item) => total + (item.variantPrice || item.price) * (item.quantity || 1),
    0
  );
}

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const { name, variant, price, variantPrice, category, items, id } = action.payload;
      const key = variant ? `${name} (${variant})` : name;

      if (category === "Special Platter") {
        const newItem = {
          id,  // Unique ID for each platter
          name: 'Special Platter',
          category,
          items,
          price,
          variantPrice: 0,
          quantity: 1,
        };

        const updatedItems = [...state.items, newItem];

        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        return {
          ...state,
          items: updatedItems,
          totalPrice: updatedItems.reduce(
            (total, item) => total + (item.variantPrice || item.price) * item.quantity,
            0
          ),
        };
      }

      // Regular items handling
      const existingItemIndex = state.items.findIndex((item) => item.key === key);

      let updatedItems;
      if (existingItemIndex !== -1) {
        const updatedItem = {
          ...state.items[existingItemIndex],
          quantity: state.items[existingItemIndex].quantity + 1,
          price: price + (variantPrice || 0),
          variant: variant || state.items[existingItemIndex].variant,
          variantPrice: variantPrice || state.items[existingItemIndex].variantPrice,
        };
        updatedItems = [...state.items];
        updatedItems[existingItemIndex] = updatedItem;
      } else {
        const newItem = {
          key,
          name,
          variant: variant || null,
          price: price + (variantPrice || 0),
          variantPrice: variantPrice || 0,
          quantity: 1,
        };
        updatedItems = [...state.items, newItem];
      }

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
      const { id: removeId, key: removeKey, category: removeCategory } = action.payload;

      const newItems = state.items.filter((item) => {
        if (removeCategory === "Special Platter") {
          // Only remove the exact special platter matching by id and category
          return !(item.id === removeId && item.category === removeCategory);
        }
        return item.key !== removeKey; // Regular item removal by key
      });

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
