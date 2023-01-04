import { useNavigation } from '@react-navigation/native';
import { addHours, differenceInMinutes, isPast } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { RequestCoinIcon } from '../coin-icon';
import { RowWithMargins } from '../layout';
import { Text } from '../text';
import CoinName from './CoinName';
import CoinRow from './CoinRow';
import { AnimatedPressable } from '@cardstack/components';
import { Routes } from '@cardstack/navigation';
import { removeRequest } from '@cardstack/redux/requests';
import colors from '@rainbow-me/styles/colors';

const getPercentageOfTimeElapsed = (startDate, endDate) => {
  const originalDifference = differenceInMinutes(endDate, startDate);
  const currentDifference = differenceInMinutes(endDate, Date.now());

  return Math.floor((currentDifference * 100) / originalDifference);
};

const BottomRow = ({ dappName, expirationColor }) => (
  <CoinName color={expirationColor} weight="semibold">
    {dappName}
  </CoinName>
);

const TopRow = ({ expirationColor, expiresAt }) => {
  const minutes = differenceInMinutes(expiresAt, Date.now());

  return (
    <RowWithMargins margin={2}>
      <Text color={expirationColor} size="smedium" weight="semibold">
        Expires in {minutes || 0}m
      </Text>
    </RowWithMargins>
  );
};

const RequestCoinRow = ({ item, ...props }) => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const [expiresAt, setExpiresAt] = useState(null);
  const [expirationColor, setExpirationColor] = useState(null);
  const [percentElapsed, setPercentElapsed] = useState(null);

  useEffect(() => {
    if (item?.displayDetails?.timestampInMs) {
      const _createdAt = new Date(item.displayDetails.timestampInMs);
      const _expiresAt = addHours(_createdAt, 1);
      const _percentElapsed = getPercentageOfTimeElapsed(
        _createdAt,
        _expiresAt
      );
      setExpiresAt(_expiresAt);
      setPercentElapsed(_percentElapsed);
      setExpirationColor(
        _percentElapsed > 25 ? colors.appleBlue : colors.orange
      );
    }
  }, [item]);

  const handleExpiredRequests = useCallback(() => {
    if (isPast(expiresAt)) {
      dispatch(removeRequest(item.requestId));
    }
  }, [dispatch, expiresAt, item.requestId]);

  const handlePressOpen = useCallback(() => {
    navigate(Routes.CONFIRM_REQUEST, {
      transactionDetails: item,
    });
  }, [item, navigate]);

  useEffect(() => {
    handleExpiredRequests();
  }, [expiresAt, handleExpiredRequests]);

  const overridenItem = useMemo(
    () => ({
      ...item,
      dappName: item.dappName,
      imageUrl: item.imageUrl,
      percentElapsed,
    }),
    [item, percentElapsed]
  );

  return (
    <AnimatedPressable onPress={handlePressOpen}>
      <CoinRow
        {...props}
        {...overridenItem}
        bottomRowRender={BottomRow}
        coinIconRender={RequestCoinIcon}
        expirationColor={expirationColor}
        expiresAt={expiresAt}
        topRowRender={TopRow}
      />
    </AnimatedPressable>
  );
};

export default RequestCoinRow;
