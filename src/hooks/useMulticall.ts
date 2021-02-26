import { FunctionFragment, Interface } from '@ethersproject/abi';
import { map } from 'lodash';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ChainId } from 'uniswap-xdai-sdk';
import { Call, toCallKey } from '../redux/multicall';
import { AppState } from '../redux/store';

const INVALID_RESULT = {
  blockNumber: undefined,
  data: undefined,
  valid: false,
};

const INVALID_CALL_STATE = {
  error: false,
  loading: false,
  result: undefined,
  syncing: false,
  valid: false,
};

const LOADING_CALL_STATE = {
  error: false,
  loading: true,
  result: undefined,
  syncing: true,
  valid: true,
};

export default function useMulticall(
  calls: Call[],
  contractInterface: Interface,
  fragment: FunctionFragment
) {
  const { chainId, results } = useSelector(
    ({ multicall: { results }, settings: { chainId } }: AppState) => ({
      chainId,
      results,
    })
  );

  const callResults = useMemo(
    () =>
      map(calls, call => {
        if (!call) return INVALID_RESULT;
        // @ts-ignore
        const result = results[chainId as ChainId]?.[toCallKey(call)];
        let data;
        if (result?.data && result?.data !== '0x') {
          data = result.data;
        }

        return { blockNumber: result?.blockNumber, data, valid: true };
      }),
    [calls, chainId, results]
  );

  const multicallResults = useMemo(
    () =>
      map(callResults, callResult => {
        if (!callResult) return INVALID_CALL_STATE;
        const { blockNumber, data, valid } = callResult;
        if (!valid) return INVALID_CALL_STATE;
        if (valid && !blockNumber) return LOADING_CALL_STATE;
        const success = data && data.length > 2;
        return {
          error: !success,
          loading: false,
          result:
            success && data
              ? contractInterface.decodeFunctionResult(fragment, data)
              : undefined,
          valid: true,
        };
      }),
    [callResults, contractInterface, fragment]
  );

  return { multicallResults };
}
