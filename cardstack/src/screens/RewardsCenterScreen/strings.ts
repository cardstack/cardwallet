export const strings = {
  navigation: {
    title: 'Reward Redemption',
  },
  register: {
    title: 'You have unclaimed Rewards!',
    noRewards: {
      title: 'You have NO unclaimed Rewards',
      message: 'You can register when you receive your next reward',
    },
    button: 'Register to Claim',
    infobanner: {
      title: 'Reward Accounts',
      message:
        'Before you can claim, you need to create and register a reward account.  This is an on-chain event and will cost you a small gas fee - you can use any existing prepaid card to pay the transaction fee.',
    },
    loading: 'Registering Account',
    payCostDescription: 'To pay transaction cost',
    gasLoading: 'Getting estimated gas fee',
    gasInfoBanner: {
      title: 'Claiming Gas Fee',
      message: {
        part1:
          'Claiming is an on chain transaction which required a small blockchain gas fee: ',
        part2: '~0.25 CARD.CPXD. ',
        part3: 'This is paid from your claimable reward.',
      },
    },
  },
  claim: {
    button: 'Claim',
    loading: 'Claiming Reward',
    claimed: 'Claimed',
  },
  balance: {
    title: 'Balance',
    empty: 'No Reward Balance',
  },
  history: {
    title: 'History',
    empty: 'No Reward History',
  },
};
