// src/services/customerApi.js
import api from './api';

// fetch list of all users
export const getCustomersApi = () =>
  api.get('/api/users').then(res => res.data);

// update a single user
export const updateCustomerApi = (id, { name, email }) =>
  api.put(`/api/users/${id}`, { name, email }).then(res => res.data);
