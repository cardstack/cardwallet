import { IConnector } from '@walletconnect/legacy-types';
import { groupBy, mapValues, values } from 'lodash';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import { WCRedirectTypes } from '@cardstack/screens/sheets/WalletConnectRedirectSheet';

import { AppState } from '@rainbow-me/redux/store';

import {
  walletConnectDisconnectAllByDappNameOrUrl as rawWalletConnectDisconnectAllByDappNameOrUrl,
  walletConnectOnSessionRequest as rawWalletConnectOnSessionRequest,
} from '../../../../src/redux/walletconnect';
import { sortList } from '../../helpers/sortList';

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

  const walletConnectDisconnectAllByDappNameOrUrl = useCallback(
    dappName =>
      dispatch(rawWalletConnectDisconnectAllByDappNameOrUrl(dappName)),
    [dispatch]
  );

  const walletConnectOnSessionRequest = useCallback(
    (uri: string, callback?: (type: WCRedirectTypes) => void) =>
      dispatch(rawWalletConnectOnSessionRequest(uri, callback)),
    [dispatch]
  );

  return {
    sortedWalletConnectors,
    walletConnectDisconnectAllByDappNameOrUrl,
    walletConnectOnSessionRequest,
    walletConnectorsByDappName,
    walletConnectorsCount,
  };
}
