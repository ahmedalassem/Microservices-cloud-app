import axios from 'axios';

// Use base URLs that align with your actual backend API structure
// For the user service, we'll use root /api since it contains various endpoints
const USER_SERVICE_BASE = '/api';
const TRANSACTION_SERVICE_BASE = '/api/transactions';
const REPORTING_SERVICE_BASE = '/api/reports';

// Create Axios instances with default configuration
const userApi = axios.create({
  baseURL: USER_SERVICE_BASE,
  timeout: process.env.REACT_APP_API_TIMEOUT || 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const transactionApi = axios.create({
  baseURL: TRANSACTION_SERVICE_BASE,
  timeout: process.env.REACT_APP_API_TIMEOUT || 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const reportingApi = axios.create({
  baseURL: REPORTING_SERVICE_BASE,
  timeout: process.env.REACT_APP_API_TIMEOUT || 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Generic request handler
async function handleApiRequest(apiCall) {
  try {
    const response = await apiCall();
    // Consider both 200 and 201 as successful responses
    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
    throw new Error(`Unexpected status code: ${response.status}`);
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// Error handling helper function
function handleApiError(error) {
  if (error.response) {
    // Don't show error for 201 status
    if (error.response.status === 201) {
      return;
    }
    const errorMessage = error.response.data?.error || error.response.data?.message || `Error: ${error.response.status}`;
    console.error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    alert(errorMessage);
  } else if (error.request) {
    console.error('Network error: No response received.');
    alert('Network error: Please check your internet connection.');
  } else {
    console.error(`Unexpected error: ${error.message}`);
    alert('Unexpected error: ' + error.message);
  }
}

// Auth API functions - using the actual endpoints from your original code
const AuthAPI = {
  signup: async (userData) => handleApiRequest(() => userApi.post('/signup/', userData)),
  login: async (userData) => handleApiRequest(() => userApi.post('/login/', userData)),
  logout: async () => handleApiRequest(() => userApi.get('/signout/')),
  getUserDetails: async () => handleApiRequest(() => userApi.get('/user/')),
  getUserBalance: async (userId) => handleApiRequest(() => userApi.get(`/user/${userId}/balance`))
};

// Transaction API functions
const TransactionAPI = {
  getTransactions: async (userId) => handleApiRequest(() => transactionApi.get(`/${userId}/`)),
  createTransaction: async (transactionData) => handleApiRequest(() => transactionApi.post('/', transactionData)),
  getTransactionById: async (transactionId) => handleApiRequest(() => transactionApi.get(`/${transactionId}/`))
};

// Reporting API functions
const ReportingAPI = {
  getTransactionReport: async (userId) => {
    console.log('Fetching transaction report for user:', userId);
    return handleApiRequest(() => reportingApi.get(`/transactions/${userId}`));
  },
  getBalanceReport: async (userId) => {
    console.log('Fetching balance report for user:', userId);
    return handleApiRequest(() => reportingApi.get(`/balance/${userId}`));
  },
  getSummaryReport: async (userId) => {
    console.log('Fetching summary report for user:', userId);
    return handleApiRequest(() => reportingApi.get(`/summary/${userId}`));
  }
};

export { AuthAPI, TransactionAPI, ReportingAPI };
export { userApi, transactionApi, reportingApi };