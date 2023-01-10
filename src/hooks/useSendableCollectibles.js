import { filter, groupBy } from 'lodash';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

const collectiblesSelector = state => state.collectibles.collectibles;

const sendableCollectibles = collectibles => {
  const sendableCollectiblesItems = filter(collectibles, ['isSendable', true]);
  const grouped = groupBy(
    sendableCollectiblesItems,
    token => token.asset_contract.name
  );
  const families = Object.keys(grouped).sort();
  let sendableTokens = [];
  for (let i = 0; i < families.length; i++) {
    let newObject = {};
    newObject = {
      data: grouped[families[i]],
      familyId: i,
      familyImage: grouped[families[i]][0].familyImage,
      name: families[i],
    };
    sendableTokens.push(newObject);
  }
  return { sendableCollectibles: sendableTokens, collectibles };
};

const sendableCollectiblesSelector = createSelector(
  [collectiblesSelector],
  sendableCollectibles
);

export default function useSendableCollectibles() {
  return useSelector(sendableCollectiblesSelector);
}
