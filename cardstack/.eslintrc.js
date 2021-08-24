const fs = require('fs');
const { parse: babelParse } = require('@babel/parser');
const data = fs.readFileSync('../globalVariables.js', 'utf8');
const { parse } = require('ast-parser');

// syntax in globalVariables.js's imports is not supported here
const globalVars = parse(babelParse(data, { sourceType: 'module' }))
  .program.body.find(e => e.nodeType === 'ExportDefaultDeclaration')
  .declaration.properties.map(e => e.key.name)
  .reduce(
    (acc, variable) => {
      acc[variable] = true;
      return acc;
    },
    {
      __DEV__: true,
    }
  );

module.exports = {
    root: true,
    extends: ['plugin:echobind/react-native'],
    settings: {
      "react": { "version": "16" },
      "import/resolver": {
        "node": {
          "extensions": [".js", ".ios.js", ".android.js", ".native.js", ".ts", ".tsx", ".png"]
        },
        "babel-module": {
          "alias": {}
        }
      } 
    },
    rules: {
        'jest/expect-expect': 0,
        'import/namespace': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
        "react/jsx-curly-brace-presence": ['error', 'never'],
        'react/jsx-fragments': 0,
        '@typescript-eslint/no-unused-vars': 'error'
    },
    globals: globalVars,
};
