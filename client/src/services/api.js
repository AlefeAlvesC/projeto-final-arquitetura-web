import axios from 'axios';

// Substitua pela porta/URL onde o backend do seu colega está rodando
const API = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

// Interceptor para anexar o token JWT automaticamente em todas as requisições
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;