import {
  addBuffer,
  convertAmountToRawAmount,
  convertStringToHex,
  fraction,
  getConstantByNetwork,
  greaterThan,
  handleSignificantDecimals,
  HubConfig,
  multiply,
} from '@cardstack/cardpay-sdk';
import UnstoppableResolution from '@unstoppabledomains/resolution';

import { BigNumber, Contract, utils as ethersUtils } from 'ethers';
import { get, startsWith } from 'lodash';
import Web3 from 'web3';

import smartContractMethods from '../references/smartcontract-methods.json';
import ethereumUtils from '../utils/ethereumUtils';

import Web3Instance from '@cardstack/models/web3-instance';
import { AssetTypes, NetworkType } from '@cardstack/types';
import { isNativeToken } from '@cardstack/utils/cardpay-utils';
import { erc721ABI, ethUnits } from '@rainbow-me/references';
import logger from 'logger';

export const sendRpcCall = async payload => {
  const web3ProviderInstance = await Web3Instance.getEthers();
  return web3ProviderInstance.send(payload.method, payload.params);
};

export const getTransactionReceipt = txHash =>
  sendRpcCall({
    method: 'eth_getTransactionReceipt',
    params: [txHash],
  });

export const toHex = value => BigNumber.from(value).toHexString();

export const isHexStringIgnorePrefix = value => {
  if (!value) return false;
  const trimmedValue = value.trim();
  const updatedValue = addHexPrefix(trimmedValue);
  return ethersUtils.isHexString(updatedValue);
};

export const addHexPrefix = value =>
  startsWith(value, '0x') ? value : `0x${value}`;

/**
 * @desc convert to checksum address
 * @param  {String} address
 * @return {String} checksum address
 */
export const toChecksumAddress = address => {
  try {
    return ethersUtils.getAddress(address);
  } catch (error) {
    return null;
  }
};

export const addPaddingToGasEstimate = async (
  estimatedGas,
  paddingFactor,
  provider
) => {
  // Adding buffer padding to gas estimate
  const { gasLimit } = await provider.getBlock();

  const lastBlockGasLimit = addBuffer(gasLimit.toString(), 0.9);
  const paddedGas = addBuffer(
    estimatedGas.toString(),
    paddingFactor.toString()
  );

  // If the safe estimation is above the last block gas limit, use it
  if (greaterThan(estimatedGas, lastBlockGasLimit)) {
    logger.log('⛽ using original gas estimation', estimatedGas.toString());
    return estimatedGas.toString();
  }
  // If the estimation is below the last block gas limit, use the padded estimate
  if (greaterThan(lastBlockGasLimit, paddedGas)) {
    logger.log('⛽ using padded gas estimation', paddedGas);
    return paddedGas;
  }
  // otherwise default to the last block gas limit
  logger.log('⛽ using last block gas limit', lastBlockGasLimit);
  return lastBlockGasLimit;
};

/**
 * @desc estimate gas limit to transfer token using Contract estimation.
 * @param  {Object} params: { from, to, id }
 * @param {Boolean} addPadding (default false) flag if a padding should be added or not.
 * @param {Number} paddingFactor (default 1.1) buffer to be added to gas limit.
 */
export const estimateTransferNFTGas = async (
  params,
  addPadding = false,
  paddingFactor = 1.1
) => {
  try {
    const provider = await Web3Instance.getEthers();

    const contract = new Contract(params.to, erc721ABI, provider);
    const contractEstGas = await contract.estimateGas.transferFrom(
      params.from,
      params.to,
      params.id
    );
    if (!addPadding) {
      return contractEstGas.toString();
    }

    return addPaddingToGasEstimate(contractEstGas, paddingFactor, provider);
  } catch (error) {
    logger.error('Error estimating gas for NFT transfer', error);
    return null;
  }
};

/**
 * @desc estimate gas limit
 * @param  {String} address
 * @return {String} gas limit
 */
export const estimateGas = async estimateGasData => {
  try {
    const web3ProviderInstance = await Web3Instance.getEthers();
    const estimatedGas = await web3ProviderInstance.estimateGas(
      estimateGasData
    );
    return estimatedGas.toString();
  } catch (error) {
    logger.error('Error calculating gas limit for token', error);
    return null;
  }
};

export const estimateGasWithPadding = async (
  txPayload,
  network = undefined,
  paddingFactor = 1.1
) => {
  try {
    const txPayloadToEstimate = { ...txPayload };
    const web3ProviderInstance = await Web3Instance.getEthers(network);
    const { gasLimit } = await web3ProviderInstance.getBlock();
    const { to, data } = txPayloadToEstimate;
    // 1 - Check if the receiver is a contract
    const code = to ? await web3ProviderInstance.getCode(to) : undefined;
    // 2 - if it's not a contract AND it doesn't have any data use the default gas limit
    if (!to || (to && !data && (!code || code === '0x'))) {
      logger.log(
        '⛽ Skipping estimates, using default',
        ethUnits.basic_tx.toString()
      );
      return ethUnits.basic_tx.toString();
    }
    logger.log('⛽ Calculating safer gas limit for last block');
    // 3 - If it is a contract, call the RPC method `estimateGas` with a safe value
    const saferGasLimit = fraction(gasLimit.toString(), 19, 20);
    logger.log('⛽ safer gas limit for last block is', saferGasLimit);

    txPayloadToEstimate.gas = toHex(saferGasLimit);
    const estimatedGas = await web3ProviderInstance.estimateGas(
      txPayloadToEstimate
    );

    return addPaddingToGasEstimate(
      estimatedGas,
      paddingFactor,
      web3ProviderInstance
    );
  } catch (error) {
    logger.error('Error calculating gas limit with padding', error);
    return null;
  }
};

/**
 * @desc get transaction info
 * @param {String} hash
 * @return {Promise}
 */
export const getTransaction = async hash =>
  await Web3Instance.getEthers()?.getTransaction(hash);

/**
 * @desc get address transaction count
 * @param {String} address
 * @return {Promise}
 */
export const getTransactionCount = async address =>
  await Web3Instance.getEthers()?.getTransactionCount(address, 'pending');

/**
 * @desc get transaction details
 * @param  {Object} transaction { from, to, data, value, gasPrice, gasLimit }
 * @return {Object}
 */
export const getTxDetails = async transaction => {
  const { to } = transaction;
  const data = transaction.data ? transaction.data : '0x';
  const value = transaction.amount
    ? toHex(Web3.utils.toWei(transaction.amount))
    : '0x00';
  const gasLimit = toHex(transaction.gasLimit) || undefined;
  const gasPrice = toHex(transaction.gasPrice) || undefined;
  const tx = {
    data,
    gasLimit,
    gasPrice,
    to,
    value,
  };
  return tx;
};

export const resolveUnstoppableDomain = async domain => {
  const hubConfig = new HubConfig(
    getConstantByNetwork('hubUrl', NetworkType.mainnet)
  );

  const hubConfigResponse = await hubConfig.getConfig();

  const resolution = new UnstoppableResolution({
    blockchain: {
      cns: {
        network: 'mainnet',
        url: hubConfigResponse.web3.layer1RpcNodeHttpsUrl,
      },
    },
  });

  const res = resolution
    .addr(domain, 'ETH')
    .then(address => {
      return address;
    })
    .catch(logger.error);
  return res;
};

const resolveNameOrAddress = async nameOrAddress => {
  if (!ethersUtils.isHexString(nameOrAddress)) {
    if (/^([\w-]+\.)+(crypto)$/.test(nameOrAddress)) {
      return resolveUnstoppableDomain(nameOrAddress);
    }
    const web3ProviderInstance = await Web3Instance.getEthers();
    return web3ProviderInstance.resolveName(nameOrAddress);
  }
  return nameOrAddress;
};

/**
 * @desc get transfer nft transaction
 * @param  {Object}  transaction { asset, from, to, gasPrice }
 * @return {Object}
 */
export const getTransferNftTransaction = async transaction => {
  const { from, to, asset } = transaction;
  const contractAddress = get(transaction, 'asset.asset_contract.address');
  const gasLimit = toHex(transaction.gasLimit) || undefined;
  const gasPrice = toHex(transaction.gasPrice) || undefined;
  const recipient = await resolveNameOrAddress(to);
  const data = getDataForNftTransfer(from, recipient, asset);
  return {
    data,
    from,
    to: contractAddress,
    gasLimit,
    gasPrice,
    value: '0x0',
  };
};

/**
 * @desc get transfer token transaction
 * @param  {Object}  transaction { asset, from, to, amount, gasPrice }
 * @return {Object}
 */
export const getTransferTokenTransaction = async transaction => {
  const value = convertAmountToRawAmount(
    transaction.amount,
    transaction.asset.decimals
  );
  const recipient = await resolveNameOrAddress(transaction.to);
  const data = getDataForTokenTransfer(value, recipient);
  return {
    data,
    from: transaction.from,
    gasLimit: transaction.gasLimit,
    gasPrice: transaction.gasPrice,
    to: transaction.asset.address || transaction.to,
  };
};

/**
 * @desc transform into signable transaction
 * @param {Object} transaction { asset, from, to, amount, gasPrice }
 * @param {String} network
 * @return {Promise}
 */
export const createSignableTransaction = async (transaction, network) => {
  const assetSymbol = get(transaction, 'asset.symbol');
  if (isNativeToken(assetSymbol, network)) {
    return getTxDetails(transaction);
  }
  if (get(transaction, 'asset.type') === AssetTypes.nft) {
    return await getTransferNftTransaction(transaction);
  }
  return getTxDetails(await getTransferTokenTransaction(transaction));
};

const estimateAssetBalancePortion = asset => {
  if (!(asset.type === AssetTypes.nft)) {
    const assetBalance = get(asset, 'balance.amount');
    const decimals = get(asset, 'decimals');
    const portion = multiply(assetBalance, 0.1);
    const trimmed = handleSignificantDecimals(portion, decimals);
    return convertAmountToRawAmount(trimmed, decimals);
  }
  return '0';
};

export const getDataForTokenTransfer = (value, to) => {
  const transferMethodHash = smartContractMethods.token_transfer.hash;
  const data = ethereumUtils.getDataString(transferMethodHash, [
    ethereumUtils.removeHexPrefix(to),
    convertStringToHex(value),
  ]);
  return data;
};

export const getDataForNftTransfer = (from, to, asset) => {
  const schema_name = get(asset, 'asset_contract.schema_name');
  const assetIdHex = convertStringToHex(asset.id);

  // Handling transfer for ERC1155
  if (schema_name === 'ERC1155') {
    const transferMethodHash =
      smartContractMethods.erc1155_safe_transfer_from.hash;
    const data = ethereumUtils.getDataString(transferMethodHash, [
      ethereumUtils.removeHexPrefix(from),
      ethereumUtils.removeHexPrefix(to),
      assetIdHex,
      convertStringToHex('1'),
      convertStringToHex('160'),
      convertStringToHex('0'),
    ]);
    return data;
  }

  // Handling transfer for ERC712
  const transferMethodHash = smartContractMethods.nft_transfer_from.hash;
  const data = ethereumUtils.getDataString(transferMethodHash, [
    ethereumUtils.removeHexPrefix(from),
    ethereumUtils.removeHexPrefix(to),
    assetIdHex,
  ]);

  return data;
};

/**
 * @desc estimate gas limit
 * @param {Object} [{selected, address, recipient, amount, gasPrice}]
 * @param {String} network
 * @return {String}
 */
export const estimateGasLimit = async (
  { asset, address, recipient, amount },
  network,
  addPadding = false
) => {
  const _amount =
    amount && Number(amount)
      ? convertAmountToRawAmount(amount, asset.decimals)
      : estimateAssetBalancePortion(asset);
  const value = _amount.toString();
  const _recipient = await resolveNameOrAddress(recipient);
  let estimateGasData = {
    data: '0x',
    from: address,
    to: _recipient,
    value,
  };
  if (asset.type === AssetTypes.nft) {
    const contractAddress = get(asset, 'asset_contract.address');
    const data = getDataForNftTransfer(address, _recipient, asset);
    estimateGasData = {
      data,
      from: address,
      to: contractAddress,
      id: asset.id,
    };

    logger.log('⛽ Calculating gas limit for NFT transfer');
    return estimateTransferNFTGas(estimateGasData, addPadding);
  } else if (!isNativeToken(asset.symbol, network)) {
    const transferData = getDataForTokenTransfer(value, _recipient);
    estimateGasData = {
      data: transferData,
      from: address,
      to: asset.address,
      value: '0x0',
    };
  }
  if (addPadding) {
    return estimateGasWithPadding(estimateGasData, network);
  } else {
    return estimateGas(estimateGasData, asset);
  }
};
