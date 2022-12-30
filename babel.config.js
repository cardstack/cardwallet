function getAliasesFromTsConfig() {
  const tsConfig = require('./tsconfig.json');
  const paths = tsConfig.compilerOptions.paths;
  let alias = {};
  Object.keys(paths).forEach(key => {
    alias[key] = `./${paths[key][0]}`;
  });

  return alias;
}

module.exports = function (api) {
  api.cache(true);

  const plugins = [
    [
      'module-resolver',
      {
        alias: getAliasesFromTsConfig(),
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        root: ['./src'],
      },
    ],
    'babel-plugin-styled-components',
    [
      'module:react-native-dotenv',
      {
        moduleName: 'react-native-dotenv',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
        envName: 'APP_ENV',
      },
    ],
    // Reanimated plugin has to be listed last.
    'react-native-reanimated/plugin',
  ];

  const presets = ['module:metro-react-native-babel-preset'];

  return {
    env: {
      development: {
        plugins: [
          [
            'transform-remove-console',
            { exclude: ['disableYellowBox', 'error', 'info', 'log'] },
          ],
          [
            'babel-plugin-inline-import',
            {
              extensions: ['.svg'],
            },
          ],
          ...plugins,
        ],
        presets: presets,
      },
      production: {
        plugins: [
          ['transform-remove-console', { exclude: ['error'] }],
          ...plugins,
        ],
        presets: presets,
      },
    },
    plugins,
    presets,
  };
};
