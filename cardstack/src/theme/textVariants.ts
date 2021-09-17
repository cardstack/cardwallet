const baseText = {
  fontFamily: 'OpenSans-Regular',
  fontSize: 16,
};

export const textVariants = {
  defaults: baseText,
  body: baseText,
  shadowRoboto: {
    fontFamily: 'RobotoMono-Regular',
    fontSize: 18,
    textShadowColor: 'white',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
  },
  xsGrey: {
    color: 'grayText',
    fontSize: 7,
  },
  smallGrey: {
    color: 'grayText',
    fontSize: 10,
  },
  smallButton: {
    fontSize: 12,
  },
  subHeader: {
    color: 'blueText',
    fontSize: 16,
  },
  subText: {
    color: 'blueText',
    fontSize: 13,
  },
  subAddress: {
    color: 'blueText',
    fontSize: 14,
    fontFamily: 'RobotoMono-Regular',
  },
  welcomeScreen: {
    color: 'white',
    fontSize: 21,
    fontWeight: '600',
    fontFamily: 'Karbon',
  },
  overGradient: {
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowColor: 'white',
    textShadowRadius: 0,
  },
};
