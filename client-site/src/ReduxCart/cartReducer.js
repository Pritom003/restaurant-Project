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
    case 'ADD_TO_CART': {
      const { name, variant, price, variantPrice, category, items, id } = action.payload;
      const key = variant ? `${name} (${variant})` : name;

      // Handle special menu items
      if (category === 'Special Platter') {
        const newItem = {
          id,  // Unique ID for each special platter
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

      // Regular add to cart functionality
      const existingItemIndex = state.items.findIndex((item) => item.key === key);
      let updatedItems;

      if (existingItemIndex !== -1) {
        const updatedItem = {
          ...state.items[existingItemIndex],
          quantity: state.items[existingItemIndex].quantity + 1,
        };
        updatedItems = [...state.items];
        updatedItems[existingItemIndex] = updatedItem;
      } else {
        const newItem = {
          key,
          name,
          variant: variant || null,
          price,
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
    }

    case 'REMOVE_FROM_CART': {
      const { key } = action.payload; // Use unique 'key' to identify items

      const updatedItems = state.items.filter((item) => item.key !== key);

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


    case 'INCREMENT_QUANTITY': {
      const { id } = action.payload;
      const updatedItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );

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

    case 'DECREMENT_QUANTITY': {
      const { id } = action.payload;
      const updatedItems = state.items
        .map((item) =>
          item.id === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0); // Remove items with 0 quantity

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

    case 'CLEAR_CART': {
      localStorage.removeItem('cartItems');
      return { ...state, items: [], totalPrice: 0 };
    }

    default:
      return state;
  }
};

export default cartReducer;
