import { Dimensions } from 'react-native';

export const buttonVariants = {
  defaults: {
    backgroundColor: 'buttonPrimaryBackground',
    borderColor: 'buttonPrimaryBorder',
    borderRadius: 100,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    maxWidth: 335,
    paddingVertical: 3,
    width: Dimensions.get('window').width - 32,
  },
  secondary: {
    backgroundColor: 'buttonSecondaryBackground',
    borderColor: 'buttonSecondaryBorder',
  },
};
