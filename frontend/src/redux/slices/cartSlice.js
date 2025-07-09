/* src/redux/slices/cartSlice.js */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const exists = state.cartItems.find(x => x.product === item.product);
      if (exists) {
        // If item exists, increase qty by 1
        state.cartItems = state.cartItems.map(x =>
          x.product === exists.product ? { ...x, qty: x.qty + 1 } : x
        );
      } else {
        // New item, set qty to 1
        state.cartItems.push({ ...item, qty: 1 });
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    incrementQuantity: (state, action) => {
      const item = state.cartItems.find(x => x.product === action.payload);
      if (item) {
        item.qty += 1;
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    decrementQuantity: (state, action) => {
      const item = state.cartItems.find(x => x.product === action.payload);
      if (item) {
        if (item.qty > 1) {
          item.qty -= 1;
        } else {
          state.cartItems = state.cartItems.filter(x => x.product !== action.payload);
        }
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(x => x.product !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    clearCart: state => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
  },
});

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;