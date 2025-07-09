import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice.js';
import productReducer from './productSlice';

import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
reducer: {
cart: cartReducer,
product: productReducer,
order: orderReducer,
user: userReducer,
},
});