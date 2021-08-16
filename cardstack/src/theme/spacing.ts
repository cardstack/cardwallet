const MAX_KEY = 48;
export const SPACING_MULTIPLIER = 4;

const generateSpacingIncrements = () => {
  const spacingKeys = Array.from(Array(MAX_KEY).keys());

  return spacingKeys.reduce(
    (accum, key) => ({
      ...accum,
      [key]: key * SPACING_MULTIPLIER,
    }),
    {}
  );
};

export const spacing: {
  [key in number | 'container' | 'px']: number;
} = {
  ...generateSpacingIncrements(),
  container: 8,
  px: 1,
};
