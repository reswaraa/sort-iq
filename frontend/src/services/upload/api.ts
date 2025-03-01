import axios from 'axios';
import {
  ClassificationResponse,
  WeightUpdateRequest,
  WeightSummaryResponse,
} from '../../types/upload/index';

const API_BASE_URL = 'http://localhost:8000/api';

// todo: refactor the api_base_url
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const wasteAPI = {
  classifyWaste: async (imageData: string): Promise<ClassificationResponse> => {
    try {
      const response = await apiClient.post<ClassificationResponse>(
        '/classify',
        {
          image_data: imageData,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error classifying waste:', error);
      return {
        category: null,
        confidence: 0,
        recyclable: null,
        error: 'Failed to classify waste image',
      };
    }
  },

  updateWeight: async (
    request: WeightUpdateRequest
  ): Promise<WeightSummaryResponse> => {
    try {
      const response = await apiClient.post<WeightSummaryResponse>(
        '/update-weight',
        request
      );
      return response.data;
    } catch (error) {
      console.error('Error updating weight:', error);
      throw new Error('Failed to update weight');
    }
  },

  resetWeights: async (): Promise<WeightSummaryResponse> => {
    try {
      const response = await apiClient.post<WeightSummaryResponse>(
        '/reset-weights'
      );
      return response.data;
    } catch (error) {
      console.error('Error resetting weights:', error);
      throw new Error('Failed to reset weights');
    }
  },

  getWeightSummary: async (): Promise<WeightSummaryResponse> => {
    try {
      const response = await apiClient.get<WeightSummaryResponse>(
        '/weight-summary'
      );
      return response.data;
    } catch (error) {
      console.error('Error getting weight summary:', error);
      throw new Error('Failed to get weight summary');
    }
  },
};
