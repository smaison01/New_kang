import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8080/api' });

export const getPosts = () => api.get('/posts');
export const getPost = (id) => api.get(`/posts/${id}`);
export const createPost = (post) => api.post('/posts', post);
export const updatePost = (id, post) => api.put(`/posts/${id}`, post);
export const deletePost = (id) => api.delete(`/posts/${id}`);

export const getEvents = () => api.get('/events');
export const createEvent = (event) => api.post('/events', event);
export const deleteEvent = (id) => api.delete(`/events/${id}`);
