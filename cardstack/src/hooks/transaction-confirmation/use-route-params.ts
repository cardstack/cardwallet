import { useRoute } from '@react-navigation/native';

export const useRouteParams = () => {
  const { params: routeParams } = useRoute();

  const {
    callback,
    transactionDetails,
    openAutomatically,
  } = routeParams as any;

  return {
    callback,
    transactionDetails,
    openAutomatically,
  };
};
