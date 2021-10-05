import { useEffect, useState } from 'react';
import { useWorker } from '@cardstack/utils';
import logger from 'logger';
import { axiosInstance } from '@cardstack/models/axios-instance';

interface Data {
  id: string;
  type: string;
  attributes: Attributes;
}

interface Attributes {
  'user-address': string;
  sku: string;
  'transaction-hash': null;
  'prepaid-card-address': null;
}

export const usePrepaidCardReservation = (
  sku: string,
  hubURL: string,
  authToken: string
) => {
  const [reservationData, setReservationData] = useState<Data>();

  const { callback: getReservation, error, isLoading } = useWorker(async () => {
    const results = await axiosInstance(authToken).post(
      `${hubURL}/api/reservations`,
      JSON.stringify({
        data: {
          type: 'reservations',
          attributes: {
            sku,
          },
        },
      })
    );

    if (results.data?.data) {
      const result = results.data?.data;
      setReservationData(result);
    }
  }, [sku]);

  useEffect(() => {
    getReservation();
  }, [getReservation]);

  useEffect(() => {
    if (error) {
      logger.log('Error getting reservation data', error);
    }
  }, [error]);

  return { reservationData, isLoading };
};
