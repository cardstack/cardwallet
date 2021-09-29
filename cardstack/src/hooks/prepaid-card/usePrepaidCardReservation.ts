import { useEffect, useState } from 'react';
import { useAuthToken } from '@cardstack/hooks/prepaid-card/useAuthToken';
import { useWorker } from '@cardstack/utils';
import logger from 'logger';

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

export const usePrepaidCardReservation = (sku: string, hubURL: string) => {
  const [reservationData, setReservationData] = useState<Data>();
  const { authToken } = useAuthToken(hubURL);

  const { callback: getReservation, error, isLoading } = useWorker(async () => {
    const results = await fetch(`${hubURL}/api/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Authorization: `Bearer: ${authToken}`,
      },
      body: JSON.stringify({
        data: {
          type: 'reservations',
          attributes: {
            sku,
          },
        },
      }),
    });

    if (results.ok) {
      const result = await results.json();
      setReservationData(result.data);
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
