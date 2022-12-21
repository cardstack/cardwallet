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
import { CollectiblesSendRow, SendCoinRow } from '../coin-row';
import { Centered } from '../layout';
import TokenFamilyHeader from '../token-family/TokenFamilyHeader';
import { layoutEasingAnimation } from '@cardstack/utils';
import { ImgixImage } from '@rainbow-me/images';

const dividerMargin = 10;
const dividerHeight = DividerSize + dividerMargin * 2;
const familyRowHeight = 58;
const familyHeaderHeight = 62;
const rowHeight = 64;
const smallBalancesHeader = 36;

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

    const { allAssets, nativeCurrency, collectibles } = props;

    const { assets } = buildCoinsList(allAssets, nativeCurrency, true);

    // assets with no balance shouldn't be visible
    const assetsWithBalance = assets.filter(
      asset => parseFloat(asset.balance.amount) > 0
    );

    const visibleAssetsLength = assetsWithBalance.length;

    this.data = assetsWithBalance;

    if (collectibles && collectibles.length > 0) {
      this.data = this.data.concat(collectibles);
    }
    this.state = {
      dataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
      }).cloneWithRows(this.data),
      openCards: [],
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
        if (i <= visibleAssetsLength - 1) {
          return 'COIN_ROW';
        }
        if (
          this.state.openCards?.[
            collectibles[i - visibleAssetsLength]?.familyId
          ]
        ) {
          return {
            size: collectibles[i - visibleAssetsLength].data.length + 1,
            type: 'COLLECTIBLE_ROW',
          };
        } else {
          return 'COLLECTIBLE_ROW_CLOSED';
        }
      },
      (type, dim) => {
        dim.width = deviceUtils.dimensions.width;
        if (type === 'COIN_ROW') {
          dim.height = rowHeight;
        } else if (type === 'COIN_ROW_LAST') {
          dim.height = rowHeight + dividerHeight;
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
    const { allAssets, collectibles } = this.props;
    const { openCards, visibleAssetsLength } = this.state;

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
        allAssets.length === visibleAssetsLength ? 0 : smallBalancesHeader;

      const heightBelow =
        visibleAssetsLength * rowHeight +
        smallBalanesheight +
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

  collectiblesRenderItem = item => (
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

  renderRow = (type, data) => {
    if (type === 'COIN_ROW') {
      return this.balancesRenderItem(data);
    }
    if (type === 'COIN_ROW_LAST') {
      return this.balancesRenderLastItem(data);
    }
    if (type.type === 'COLLECTIBLE_ROW' || type === 'COLLECTIBLE_ROW_CLOSED') {
      return this.collectiblesRenderItem(data);
    }

    return null;
  };

  render() {
    const { dataProvider } = this.state;

    return (
      <FlyInAnimation>
        <SendAssetRecyclerListView
          dataProvider={dataProvider}
          disableRecycling
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
