const baseText = {
  fontFamily: 'OpenSans-Regular',
  fontSize: 16,
};

export const textVariants = {
  defaults: baseText,
  body: baseText,
  shadowRoboto: {
    letterSpacing: 0.5,
    fontFamily: 'Roboto-Regular',
    fontSize: 18,
    textShadowColor: 'white',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
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
};
