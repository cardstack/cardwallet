import React, { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { css } from 'styled-components';
import { ButtonPressAnimation } from '../animations';
import { CoinIconSize } from '../coin-icon';
import { Centered, ColumnWithMargins } from '../layout';
import BalanceText from './BalanceText';
import BottomRowText from './BottomRowText';
import CoinName from './CoinName';
import CoinRow from './CoinRow';

import { Container, Icon } from '@cardstack/components';
import { useDimensions } from '@rainbow-me/hooks';
import { padding } from '@rainbow-me/styles';
import { neverRerender } from '@rainbow-me/utils';

const CoinRowPaddingTop = 9.5;
const CoinRowPaddingBottom = 9.5;

// const FloatingFavoriteEmojis = styled(FloatingEmojis).attrs({
//   centerVertically: true,
//   disableHorizontalMovement: true,
//   disableVerticalMovement: true,
//   distance: 70,
//   duration: 400,
//   emojis: ['glowing_star'],
//   fadeOut: false,
//   marginTop: 10.25,
//   range: [0, 0],
//   scaleTo: 0,
//   size: 32,
//   wiggleFactor: 0,
// })`
//   left: ${({ deviceWidth }) => deviceWidth - 52.25};
//   position: absolute;
//   right: 0;
//   top: 0;
//   z-index: 100;
// `;

const BottomRow = ({ showBalance, symbol }) =>
  showBalance ? null : <BottomRowText>{symbol}</BottomRowText>;

const TopRow = ({ name, showBalance }) => (
  <Centered height={showBalance ? CoinIconSize : null}>
    <CoinName>{name}</CoinName>
  </Centered>
);

const ExchangeCoinRow = ({
  item,
  isVerified,
  onFavoriteAsset,
  onPress,
  onUnverifiedTokenPress,
  showBalance,
  showFavoriteButton,
}) => {
  const { width: deviceWidth } = useDimensions();
  const [localFavorite, setLocalFavorite] = useState(!!item.favorite);

  const handlePress = useCallback(() => {
    if (isVerified || showBalance) {
      onPress(item);
    } else {
      onUnverifiedTokenPress(item);
    }
  }, [isVerified, item, onPress, onUnverifiedTokenPress, showBalance]);

  return (
    <Container flexDirection="row" paddingHorizontal={4}>
      <Container flex={1}>
        <ButtonPressAnimation
          height={CoinIconSize + CoinRowPaddingTop + CoinRowPaddingBottom}
          onPress={handlePress}
          scaleTo={0.96}
          throttle
        >
          <CoinRow
            {...item}
            bottomRowRender={BottomRow}
            containerStyles={css(
              padding(
                CoinRowPaddingTop,
                showFavoriteButton ? 38 : 0,
                CoinRowPaddingBottom,
                15
              )
            )}
            showBalance={showBalance}
            testID="exchange-coin-row"
            topRowRender={TopRow}
          >
            {showBalance && (
              <ColumnWithMargins align="end" margin={4}>
                <BalanceText>
                  {item?.native?.balance?.display || '–'}
                </BalanceText>
                <BottomRowText>{item?.balance?.display || ''}</BottomRowText>
              </ColumnWithMargins>
            )}
          </CoinRow>
        </ButtonPressAnimation>
      </Container>
      {showFavoriteButton && (
        <ButtonPressAnimation
          height={CoinIconSize + CoinRowPaddingTop + CoinRowPaddingBottom}
          onPress={() => {
            // setLocalFavorite(prevLocalFavorite => {
            //   const newLocalFavorite = !prevLocalFavorite;
            //   if (newLocalFavorite) {
            //     haptics.notificationSuccess();
            //     // onNewEmoji();
            //   } else {
            //     haptics.selection();
            //   }
            //   onFavoriteAsset(item, newLocalFavorite);
            //   return newLocalFavorite;
            // });
            Alert.alert('hello');
          }}
        >
          <Container flex={-1}>
            <Icon
              {...{
                fill: `${localFavorite ? null : 'underlineGray'}`,
                color: `${localFavorite ? null : 'underlineGray'}`,
                name: `${localFavorite ? 'check-circle' : 'circle'}`,
              }}
              size={24}
            />
          </Container>
        </ButtonPressAnimation>

        // <FloatingFavoriteEmojis deviceWidth={deviceWidth}>
        //   {({ onNewEmoji }) => (
        //     <CoinRowFavoriteButton
        //       isFavorited={localFavorite}
        //       onPress={() => {
        //         setLocalFavorite(prevLocalFavorite => {
        //           const newLocalFavorite = !prevLocalFavorite;
        //           if (newLocalFavorite) {
        //             haptics.notificationSuccess();
        //             onNewEmoji();
        //           } else {
        //             haptics.selection();
        //           }
        //           onFavoriteAsset(item, newLocalFavorite);
        //           return newLocalFavorite;
        //         });
        //       }}
        //     />
        //   )}
        // </FloatingFavoriteEmojis>
      )}
    </Container>
  );
};

export default neverRerender(ExchangeCoinRow);
