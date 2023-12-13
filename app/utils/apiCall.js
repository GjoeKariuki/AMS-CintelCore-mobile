import { AsyncStorage } from 'react-native';

const BASE_URL = 'https://your-api-url.com';

const apiCall = async (endpoint, method = 'POST', body = null) => {
  // Fetch token from storage
  const token = await AsyncStorage.getItem('authToken');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  };

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, config);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

export default apiCall;
