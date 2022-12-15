import React, { Fragment } from 'react';
import { View } from 'react-native';
import {
  DataProvider,
  LayoutProvider,
  RecyclerListView,
} from 'recyclerlistview';

import styled from 'styled-components';
import { buildCoinsList } from '../../helpers/assets';
import { deviceUtils } from '../../utils';
import Divider, { DividerSize } from '../Divider';
import { FlyInAnimation } from '../animations';
import { CoinDividerOpenButton } from '../coin-divider';
import {
  CollectiblesSendRow,
  SendCoinRow,
  SendSavingsCoinRow,
} from '../coin-row';
import { Centered } from '../layout';
import { SavingsListHeader } from '../savings';
import TokenFamilyHeader from '../token-family/TokenFamilyHeader';
import { NetworkType } from '@cardstack/types';
import { layoutEasingAnimation } from '@cardstack/utils';
import { ImgixImage } from '@rainbow-me/images';

const dividerMargin = 10;
const dividerHeight = DividerSize + dividerMargin * 2;
const familyRowHeight = 58;
const familyHeaderHeight = 62;
const rowHeight = 64;
const smallBalancesHeader = 36;

const SendAssetListCoinDividerOpenButton = styled(CoinDividerOpenButton).attrs({
  coinDividerHeight: 30,
})`
  margin-left: ${android ? 0 : 16};
`;

const SendAssetRecyclerListView = styled(RecyclerListView)`
  min-height: 1;
`;

const SendAssetListDivider = () => {
  const { colors } = useTheme();
  return (
    <Centered marginVertical={dividerMargin}>
      <Divider color={colors.rowDividerLight} />
    </Centered>
  );
};

export default class SendAssetList extends React.Component {
  constructor(props) {
    super(props);

    const { allAssets, nativeCurrency, network, savings, collectibles } = props;

    const { assets } = buildCoinsList(allAssets, nativeCurrency, true);
    let shitcoins = [];

    // assets with no balance shouldn't be visible
    const assetsWithBalance = assets.filter(
      asset => parseFloat(asset.balance.amount) > 0
    );

    const visibleAssetsLength = assetsWithBalance.length;

    this.data = assetsWithBalance;

    if (savings && savings.length > 0 && network === NetworkType.mainnet) {
      this.data = this.data.concat([{ data: savings, name: 'Savings' }]);
    }
    if (collectibles && collectibles.length > 0) {
      this.data = this.data.concat(collectibles);
    }
    this.state = {
      dataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
      }).cloneWithRows(this.data),
      openCards: [],
      openSavings: true,
      openShitcoins: false,
      visibleAssetsLength: visibleAssetsLength,
    };

    const imageTokens = [];
    collectibles.forEach(family => {
      family.data.forEach(token => {
        if (token.image_thumbnail_url) {
          imageTokens.push({
            id: token.id,
            uri: token.image_thumbnail_url,
          });
        }
      });
    });

    ImgixImage.preload(imageTokens);

    this._layoutProvider = new LayoutProvider(
      i => {
        if (i < visibleAssetsLength - 1) {
          return 'COIN_ROW';
        } else if (i === visibleAssetsLength - 1) {
          return (savings && savings.length !== 0) ||
            (shitcoins && shitcoins.length !== 0)
            ? 'COIN_ROW'
            : 'COIN_ROW_LAST';
        } else if (
          i === visibleAssetsLength &&
          shitcoins &&
          shitcoins.length > 0
        ) {
          return {
            size: this.state.openShitcoins ? rowHeight * shitcoins.length : 0,
            type: 'SHITCOINS_ROW',
          };
        } else if (
          (i === visibleAssetsLength ||
            (i === visibleAssetsLength + 1 &&
              shitcoins &&
              shitcoins.length > 0)) &&
          savings &&
          savings.length > 0
        ) {
          return {
            size: this.state.openSavings ? rowHeight * savings.length : 0,
            type: 'SAVINGS_ROW',
          };
        } else {
          if (
            this.state.openCards[
              collectibles[
                i -
                  visibleAssetsLength -
                  (savings && savings.length > 0 ? 1 : 0) -
                  (shitcoins && shitcoins.length > 0 ? 1 : 0)
              ].familyId
            ]
          ) {
            return {
              size:
                collectibles[
                  i -
                    visibleAssetsLength -
                    (savings && savings.length > 0 ? 1 : 0) -
                    (shitcoins && shitcoins.length > 0 ? 1 : 0)
                ].data.length + 1,
              type: 'COLLECTIBLE_ROW',
            };
          } else {
            return 'COLLECTIBLE_ROW_CLOSED';
          }
        }
      },
      (type, dim) => {
        dim.width = deviceUtils.dimensions.width;
        if (type === 'COIN_ROW') {
          dim.height = rowHeight;
        } else if (type === 'COIN_ROW_LAST') {
          dim.height = rowHeight + dividerHeight;
        } else if (type.type === 'SHITCOINS_ROW') {
          dim.height =
            type.size +
            smallBalancesHeader +
            (savings && savings.length > 0 ? 0 : dividerHeight);
        } else if (type.type === 'SAVINGS_ROW') {
          dim.height = type.size + familyHeaderHeight + dividerHeight;
        } else if (type.type === 'COLLECTIBLE_ROW') {
          dim.height = familyHeaderHeight + (type.size - 1) * familyRowHeight;
        } else if (type === 'COLLECTIBLE_ROW_CLOSED') {
          dim.height = familyHeaderHeight;
        } else {
          dim.height = 0;
        }
      }
    );
  }

  rlv = React.createRef();

  handleRef = ref => {
    this.rlv = ref;
  };

  handleScroll = ({ nativeEvent }) => {
    this.componentHeight = nativeEvent?.layoutMeasurement?.height;
    this.position = nativeEvent?.contentOffset?.y;
  };

  changeOpenTab = index => {
    const { allAssets, savings, collectibles } = this.props;
    const {
      openCards,
      openSavings,
      openShitcoins,
      visibleAssetsLength,
    } = this.state;

    layoutEasingAnimation();

    openCards[index] = !openCards[index];
    this.setState({ openCards });
    let familiesHeight = 0;
    if (openCards[index]) {
      for (let i = 0; i < index; i++) {
        if (openCards[i]) {
          familiesHeight +=
            familyHeaderHeight + collectibles[i].data.length * familyRowHeight;
        } else {
          familiesHeight += familyHeaderHeight;
        }
      }
      const smallBalanesheight =
        allAssets.length === visibleAssetsLength
          ? 0
          : smallBalancesHeader +
            (openShitcoins
              ? (allAssets.length - visibleAssetsLength) * rowHeight
              : 0);
      const savingsHeight =
        savings?.length > 0
          ? familyHeaderHeight + (openSavings ? savings.length * rowHeight : 0)
          : 0;
      const heightBelow =
        visibleAssetsLength * rowHeight +
        smallBalanesheight +
        savingsHeight +
        familiesHeight +
        dividerHeight;
      const renderSize =
        familyHeaderHeight + collectibles[index].data.length * familyRowHeight;
      const screenHeight = this.position + this.componentHeight;
      if (heightBelow + renderSize + rowHeight > screenHeight) {
        if (renderSize < this.componentHeight) {
          setTimeout(() => {
            this.rlv.scrollToOffset(
              0,
              this.position +
                (heightBelow + renderSize - screenHeight + familyHeaderHeight),
              true
            );
          }, 10);
        } else {
          setTimeout(() => {
            this.rlv.scrollToOffset(
              0,
              this.position - (this.position - heightBelow),
              true
            );
          }, 10);
        }
      }
    }
  };

  changeOpenSavings = () => {
    layoutEasingAnimation();

    this.setState(prevState => ({ openSavings: !prevState.openSavings }));
  };

  changeOpenShitcoins = () => {
    layoutEasingAnimation();

    this.setState(prevState => ({ openShitcoins: !prevState.openShitcoins }));
  };

  mapTokens = collectibles =>
    collectibles.map(collectible => (
      <CollectiblesSendRow
        item={collectible}
        key={collectible.id}
        onPress={() => this.props.onSelectAsset(collectible)}
        testID="send-collectible"
      />
    ));

  balancesRenderItem = item => (
    <SendCoinRow
      {...item}
      onPress={() => this.props.onSelectAsset(item)}
      rowHeight={rowHeight}
      testID="send-asset"
    />
  );

  mapSavings = savings =>
    savings.map(token => (
      <SendSavingsCoinRow
        item={token}
        key={token.address}
        onPress={() => this.props.onSelectAsset(token)}
        testID="send-savings"
      />
    ));

  mapShitcoins = shitcoins =>
    shitcoins.map(token => (
      <SendCoinRow
        key={token.id}
        onPress={() => this.props.onSelectAsset(token)}
        rowHeight={rowHeight}
        testID="send-shitcoin"
        top={0}
        {...token}
      />
    ));

  balancesRenderLastItem = item => (
    <Fragment>
      <SendCoinRow
        {...item}
        onPress={() => this.props.onSelectAsset(item)}
        rowHeight={rowHeight}
        testID="send-asset"
      />
      <SendAssetListDivider />
    </Fragment>
  );

  collectiblesRenderItem = item => {
    return (
      <View>
        <TokenFamilyHeader
          childrenAmount={item.data.length}
          familyImage={item.familyImage}
          isCoinRow
          isOpen={this.state.openCards[item.familyId]}
          onPress={() => {
            this.changeOpenTab(item.familyId);
          }}
          testID={`${item.name}-family-header`}
          title={item.name}
        />
        {this.state.openCards[item.familyId] && this.mapTokens(item.data)}
      </View>
    );
  };

  savingsRenderItem = item => {
    const { openSavings } = this.state;
    return (
      <View marginTop={dividerMargin}>
        <SavingsListHeader
          isOpen={openSavings}
          onPress={this.changeOpenSavings}
        />
        {openSavings && this.mapSavings(item.data)}
        <SendAssetListDivider />
      </View>
    );
  };

  shitcoinsRenderItem = item => {
    const { savings } = this.props;
    const { openShitcoins } = this.state;
    return (
      <View marginTop={dividerMargin}>
        <SendAssetListCoinDividerOpenButton
          isSendSheet
          isSmallBalancesOpen={openShitcoins}
          onPress={this.changeOpenShitcoins}
        />
        {openShitcoins && this.mapShitcoins(item.assets)}
        {savings && savings.length > 0 ? null : <SendAssetListDivider />}
      </View>
    );
  };

  renderRow = (type, data) => {
    if (type === 'COIN_ROW') {
      return this.balancesRenderItem(data);
    } else if (type === 'COIN_ROW_LAST') {
      return this.balancesRenderLastItem(data);
    } else if (type.type === 'SHITCOINS_ROW') {
      return this.shitcoinsRenderItem(data);
    } else if (type.type === 'SAVINGS_ROW') {
      return this.savingsRenderItem(data);
    } else if (type.type === 'COLLECTIBLE_ROW') {
      return this.collectiblesRenderItem(data);
    } else if (type === 'COLLECTIBLE_ROW_CLOSED') {
      return this.collectiblesRenderItem(data);
    }
    return null;
  };

  render() {
    const { dataProvider, openShitcoins } = this.state;

    return (
      <FlyInAnimation>
        <SendAssetRecyclerListView
          dataProvider={dataProvider}
          disableRecycling
          extendedState={{ openShitcoins }}
          layoutProvider={this._layoutProvider}
          onScroll={this.handleScroll}
          ref={this.handleRef}
          rowRenderer={this.renderRow}
          testID="send-asset-list"
        />
      </FlyInAnimation>
    );
  }
}
