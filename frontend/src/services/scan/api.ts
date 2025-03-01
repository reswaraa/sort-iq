import axios from 'axios';
import { ClassificationResponse } from '../../types/scan/index';

// Configure the API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const classifyWasteFromBase64 = async (
  base64Image: string
): Promise<ClassificationResponse> => {
  try {
    const response = await api.post('/detect-base64', { image: base64Image });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('API Error:', error.response.data);
      return {
        success: false,
        message: `Error: ${
          error.response.data.detail || 'Something went wrong'
        }`,
      };
    }
    console.error('Unexpected error:', error);
    return {
      success: false,
      message: 'Unable to connect to detection service',
    };
  }
};

const apiService = {
  classifyWasteFromBase64,
};

export default apiService;
