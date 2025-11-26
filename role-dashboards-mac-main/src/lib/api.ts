// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  CHATBOT_URL: import.meta.env.VITE_CHATBOT_URL || 'http://127.0.0.1:8000/chatbot',
  AUDIO_URL: import.meta.env.VITE_AUDIO_URL || 'http://127.0.0.1:8000/transcribe-audio',
};

// API Endpoints
export const API_ENDPOINTS = {
  // FIR Endpoints
  GET_FIRS: `${API_CONFIG.BASE_URL}/get-firs`,
  GET_FIR_DETAILS: (id: string) => `${API_CONFIG.BASE_URL}/get-fir-details/${id}`,
  SUBMIT_FIR: `${API_CONFIG.BASE_URL}/submit-fir`,
  GENERATE_DESCRIPTION: `${API_CONFIG.BASE_URL}/generate-description`,

  // Search & Filter Endpoints
  SEARCH_FIRS: `${API_CONFIG.BASE_URL}/search-firs`,
  FILTER_FIRS: `${API_CONFIG.BASE_URL}/filter-firs`,

  // Chatbot Endpoint
  CHATBOT: API_CONFIG.CHATBOT_URL,

  // Audio Endpoint
  TRANSCRIBE_AUDIO: API_CONFIG.AUDIO_URL,
};
