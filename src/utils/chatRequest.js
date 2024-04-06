import axios from 'axios';

// Creating an instance of Axios with a base URL for the API
const API = axios.create({baseURL: process.env.REACT_APP_BACKEND_URL});

// Exporting the user's chats 
export const userChats = (id) => API.get(`/chat/${id}`);
