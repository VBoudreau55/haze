import axios from 'axios';
const API_URL = "https://hriblyler2.execute-api.us-east-1.amazonaws.com/default/api_processing";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface ApiResponse<T> {
  statusCode: number;
  headers: {
    'Content-Type': string;
  };
  body: T;
  message?: string;
}

interface User {
  userid: string;
  name: string;
  email: string;
}

interface ApiError {
  message: string;
  statusCode?: number;
}

export const checkServiceStatus = async (): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response: any = await axiosInstance.get('/status');
    return response.data; // Success
  } catch (error) {
    throw handleError(error);
  }
};

export const getCountryInfo = async (countryid: string): Promise<ApiResponse<User>> => {
    try {
      const response: any = await axiosInstance.get(`/country?country_id=${countryid}`);
      return response.data; 
    } catch (error) {
      throw handleError(error);
    }
  };

export const getLocationData = async (lat: number, long: number): Promise<ApiResponse<User>> => {
  try {
    const response: any = await axiosInstance.get(`/location?lat=${lat}&long=${long}`);
    return response.data; 
  } catch (error) {
    throw handleError(error);
  }
};

export const getUser = async (userId: string): Promise<ApiResponse<User>> => {
  try {
    const response: any = await axiosInstance.get(`/user?user_id=${userId}`);
    return response.data; 
  } catch (error) {
    throw handleError(error);
  }
};


export const saveUser = async (userData: User): Promise<ApiResponse<{ message: string; item: User }>> => {
  try {
    const response: any = await axiosInstance.post('/user', userData);
    return response.data; // Success
  } catch (error) {
    throw handleError(error);
  }
};

export const updateUser = async (userId: string, updateKey: string, updateValue: string): Promise<ApiResponse<{ message: string; updatedAttributes: any }>> => {
  try {
    const response: any = await axiosInstance.patch('/user', { userid: userId, updateKey, updateValue });
    return response.data; // Success
  } catch (error) {
    throw handleError(error);
  }
};


export const deleteUser = async (userId: string): Promise<ApiResponse<{ message: string; item: any }>> => {
  try {
    const response: any = await axiosInstance.delete(`/user?user_id=${userId}`);
    return response.data; // Success
  } catch (error) {
    throw handleError(error);
  }
};


const handleError = (error: any): ApiError => {
  const apiError: ApiError = {
    message: error.message,
  };

  if (error.response) {
    // Error has response from the API
    apiError.statusCode = error.response.status;
    (apiError as any).response = error.response;
  }

  return apiError;
};
