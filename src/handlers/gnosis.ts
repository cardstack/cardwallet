import axios from 'axios';

const baseUrl = 'https://transactions-staging.stack.cards/api';

const gnosisApi = axios.create({
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 secs
});

export const transactionServiceFetch = async (endpoint: string) =>
  gnosisApi.get(`${baseUrl}${endpoint}`);
