import { TypedData } from '@rainbow-me/model/wallet';

import { extractPayloadParams } from '../utils';

describe('extractPayloadParams', () => {
  it('handles a cardstack-style payload', async () => {
    const payloadParams = {
      domain: {
        chainId: 77,
        name: 'hub-staging.stack.cards',
        version: '0.27.40',
      },
      message: {
        nonce:
          'MTY2MTk4MzI4MTgwMDY=:c136f91088b7054b896510d41e8c356308346cc7ebc8c8a289b96d5ad87a4e72',
        user: '0xc9Cdb5EeD1c27fCc64DA096CA3b0bcc02c1d45C2',
      },
      primaryType: 'HubAuthentication',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
        ],
        HubAuthentication: [
          { name: 'user', type: 'address' },
          { name: 'nonce', type: 'string' },
        ],
      },
    };

    const input = {
      id: 1638903173175915,
      jsonrpc: '2.0',
      method: 'eth_signTypedData',
      params: ['0xc9Cdb5EeD1c27fCc64DA096CA3b0bcc02c1d45C2', payloadParams] as [
        string,
        TypedData
      ],
    };

    expect(extractPayloadParams(input)).toStrictEqual(payloadParams);
  });

  it('handles a CollabLand-style payload', async () => {
    // Collabland's dapp (and presumably others) send the structured data payload param as a string
    const payloadParams = {
      domain: {
        chainId: 100,
        name: 'Collab.land',
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        version: '1',
      },
      primaryType: 'Verify',
      message: {
        from: '0xc9Cdb5EeD1c27fCc64DA096CA3b0bcc02c1d45C2',
      },
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Verify: [{ name: 'from', type: 'address' }],
      },
    };

    const input = {
      id: 1638903290327100,
      jsonrpc: '2.0',
      method: 'eth_signTypedData',
      params: [
        '0xc9Cdb5EeD1c27fCc64DA096CA3b0bcc02c1d45C2',
        JSON.stringify(payloadParams),
      ] as [string, string],
    };

    expect(extractPayloadParams(input)).toStrictEqual(payloadParams);
  });
});
