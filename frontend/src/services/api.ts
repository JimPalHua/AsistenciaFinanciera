import { API_URL as BASE_URL } from '../config';
const API_URL = `${BASE_URL}/api`;

export const checkServerStatus = async () => {
  try {
    const response = await fetch(`${API_URL}/status`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error connecting to server:', error);
    throw error;
  }
};
