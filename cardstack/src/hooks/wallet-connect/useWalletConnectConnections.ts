import { groupBy, mapValues, values } from 'lodash';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { IConnector } from '@walletconnect/types';
import { sortList } from '../../helpers/sortList';
import {
  walletConnectDisconnectAllByDappName as rawWalletConnectDisconnectAllByDappName,
  walletConnectOnSessionRequest as rawWalletConnectOnSessionRequest,
} from '../../../../src/redux/walletconnect';
import { AppState } from '@rainbow-me/redux/store';

const formatDappData = (connections: Record<string, IConnector[]>) =>
  values(
    mapValues(connections, connection => ({
      dappIcon: connection?.[0].peerMeta?.icons?.[0],
      dappName: connection?.[0].peerMeta?.name,
      dappUrl: connection?.[0].peerMeta?.url,
    }))
  );

const walletConnectSelector = createSelector(
  (state: AppState) => state.walletconnect.walletConnectors,
  walletConnectors => {
    const sorted = sortList(values(walletConnectors), 'peerMeta.name');
    const groupedByDappName = groupBy(sorted, 'peerMeta.url');
    return {
      sortedWalletConnectors: sorted,
      walletConnectorsByDappName: formatDappData(groupedByDappName),
      walletConnectorsCount: sorted.length,
    };
  }
);

export default function useWalletConnectConnections() {
  const dispatch = useDispatch();

  const {
    sortedWalletConnectors,
    walletConnectorsByDappName,
    walletConnectorsCount,
  } = useSelector(walletConnectSelector);

  const walletConnectDisconnectAllByDappName = useCallback(
    dappName => dispatch(rawWalletConnectDisconnectAllByDappName(dappName)),
    [dispatch]
  );

  const walletConnectOnSessionRequest = useCallback(
    (uri: string, callback?: () => void) =>
      dispatch(rawWalletConnectOnSessionRequest(uri, callback)),
    [dispatch]
  );

  return {
    sortedWalletConnectors,
    walletConnectDisconnectAllByDappName,
    walletConnectOnSessionRequest,
    walletConnectorsByDappName,
    walletConnectorsCount,
  };
}
