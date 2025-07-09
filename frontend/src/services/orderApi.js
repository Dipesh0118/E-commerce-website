import api from './api';
import { format } from 'date-fns';


export const getOrdersApi = () => {
  return api.get('/api/orders').then(res => res.data);
};

export const markOrderDeliveredApi = (orderId) => {
  return api.put(`/api/orders/${orderId}/deliver`).then(res => res.data);
};
export const updateOrderItemApi = (orderId, items) => {
    return api
    .put(`/api/orders/${orderId}/items`, { orderItems: items })
    .then(res => res.data);
  };
  export const getOrderStatsApi = (month) => {
    const params = {};
    if (month) {
      params.month = format(month, 'yyyy-MM');
    }
    return api.get('/api/orders/stats', { params }).then((res) => res.data);
  };
  // ← And this:
  export const removeOrderItemsApi = (orderId, productIds) =>
    api.put(`/api/orders/${orderId}/items/remove`, { productIds })
       .then(res => res.data);

 export const deleteOrderApi = (orderId) =>
        api.delete(`/api/orders/${orderId}`).then(res => res.data);