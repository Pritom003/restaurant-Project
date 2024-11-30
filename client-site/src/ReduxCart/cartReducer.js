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
      const { name, variant, price, variantPrice, category, items } = action.payload;
      const key = variant ? `${name} (${variant})` : name;
      
      // Special menu check: If category is 'Special Platter', handle it differently
      if (category === "Special Platter") {
        // For special platter, treat it as a single item with all selected items inside
        const newItem = {
          key: 'special-platter', // This key will be unique for special platter
          name: 'Special Platter',
          category: category, // Special category name
          items: items, // Array of selected items from the special menu
          price: price, // Platter price
          variantPrice: 0, // No variant price for the platter itself
          quantity: 1,
        };
        
        // Add special platter to the cart
        const updatedItems = [...state.items, newItem];
        
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
      }

      // Regular add to cart functionality (existing code)
      const existingItemIndex = state.items.findIndex(
        (item) => item.key === key
      );

      let updatedItems;
      if (existingItemIndex !== -1) {
        // Update existing item
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
        // Add new item to the cart
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
      
        let newItems = [];
      
        // Loop through all cart items to check for special platter and regular items
        newItems = state.items.map((item) => {
          if (item.category === "Special Platter") {
            // Handle the special platter items
            const updatedItems = item.items.filter(
              (subItem) => `${subItem.name} (${subItem.variant})` !== removeKey
            );
      
            if (updatedItems.length === 0) {
              // If all items from the special platter are removed, remove the platter
              return null; // Special platter will be removed
            } else {
              // Update the platter with remaining items
              return { ...item, items: updatedItems };
            }
          } else {
            // Regular item removal
            if (item.key === removeKey) {
              if (item.quantity > 1) {
                return { ...item, quantity: item.quantity - 1 }; // Decrease quantity
              } else {
                return null; // Remove item if quantity is 1
              }
            } else {
              return item; // No change if the item doesn't match
            }
          }
        }).filter(item => item !== null); // Filter out null values (removed items)
      
        // Update local storage and recalculate total price
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
