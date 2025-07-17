// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_ADDRESS || 'http://localhost:3000';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    // User endpoints
    users: '/api/users',
    cart: '/api/cart',
    orders: '/api/orders',
    
    // Product endpoints
    plants: '/api/plants',
    tools: '/api/tools',
    fertilizers: '/api/fertilizers',
    soils: '/api/soils',
    pottery: '/api/pottery',
    seeds: '/api/seeds',
    
    // Other endpoints
    blogs: '/api/blogs',
    reviews: '/api/reviews',
    upload: '/api/upload-image',
    payment: '/api/create-payment-intent'
  }
};

// Helper function to get full URL
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Export the base URL for direct usage
export const API_URL = API_BASE_URL; 