import axios from 'axios';
import { API_BASE } from '../utils/constants';

const api = axios.create({ baseURL: API_BASE });

export const userService = {
  async getAll() {
    const { data } = await api.get('/users');
    return data;
  },

  async create(payload) {
    const { data } = await api.post('/users', payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.put(`/users/${id}`, payload);
    return data;
  },

  async remove(id) {
    await api.delete(`/users/${id}`);
    return id;
  },
};
