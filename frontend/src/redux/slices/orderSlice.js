// src/redux/slices/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { clearCart as clearCartAction } from './cartSlice';

/**
 * Try to grab the JWT from Redux state (in whatever slice you actually use)
 * and if that fails, look in localStorage under "userInfo".
 */
const selectToken = (getState) => {
  const state = getState();
  // 1) adjust these names to what your store actually uses:
  const maybeUserInfo =
    state.userLogin?.userInfo ||
    state.auth?.userInfo ||
    state.user?.userInfo;

  if (maybeUserInfo?.token) {
    return maybeUserInfo.token;
  }

  // 2) fallback to localStorage (if you persisted there)
    const ls = localStorage.getItem('token');
  if (ls) {
    return ls;
  }

  return null;
};

export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (orderData, { getState, dispatch, rejectWithValue }) => {
      const token = selectToken(getState);
      console.log('🛠️ createOrder token=', token);
      if (!token) {
        return rejectWithValue('User not authenticated');
      }
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      console.log('🛠️ createOrder headers=', config.headers);

      const { data } = await api.post('/api/orders', orderData, config);

      // clear the cart slice
      dispatch(clearCartAction());
      return data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Failed to create order';
      return rejectWithValue(message);
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'order/fetchMyOrders',
  async (_, { getState, rejectWithValue }) => {
    const token = selectToken(getState);
    if (!token) {
      return rejectWithValue('User not authenticated');
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await api.get('/api/orders/myorders', config);
      return data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Failed to fetch orders';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  order: null,
  myOrders: [],
  status: 'idle',
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b
      // createOrder
      .addCase(createOrder.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(createOrder.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.order = a.payload;
      })
      .addCase(createOrder.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload;
      })

      // fetchMyOrders
      .addCase(fetchMyOrders.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.myOrders = a.payload;
      })
      .addCase(fetchMyOrders.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload;
      });
  },
});

export default orderSlice.reducer;
