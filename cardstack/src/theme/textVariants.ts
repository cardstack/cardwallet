const baseText = {
  fontFamily: 'OpenSans-Regular',
  fontSize: 16,
};

export const textVariants = {
  defaults: baseText,
  body: baseText,
  bold: {
    fontFamily: 'OpenSans-Bold',
  },
  shadowRoboto: {
    letterSpacing: 0.5,
    fontFamily: 'Roboto-Regular',
    fontSize: 18,
    textShadowColor: 'white',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
  },
};
