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
      const { name, variant, price, variantPrice, category, items, id } = action.payload;
      const key = variant ? `${name} (${variant})` : name;

      // Special menu check: If category is 'Special Platter', handle it differently
      if (category === "Special Platter") {
        const newItem = {
          id,  // Use unique ID for each special platter
          name: 'Special Platter',
          category: category,
          items: items,
          price: price,
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

      // Regular add to cart functionality
      const existingItemIndex = state.items.findIndex(
        (item) => item.key === key
      );

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
      const { id: removeId } = action.payload;  // Use the unique ID for removal

      let newItems = state.items.filter((item) => {
        // Remove special platter if its ID matches
        if (item.category === "Special Platter" && item.id === removeId) {
          return false; // This will remove the item from the cart
        }
        // Remove regular items if their ID matches
        return item.id !== removeId;
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
