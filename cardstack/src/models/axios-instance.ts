import axios from 'axios';

export const axiosInstance = (authToken: string) => {
  return axios.create({
    baseURL: 'https://hub-staging.stack.cards/',
    headers: {
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer: ${authToken}`,
      Accept: 'application/vnd.api+json',
    },
  });
};
