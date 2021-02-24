module.exports = {
    root: true,
    extends: ['plugin:echobind/react-native'],
    settings: {
      "react": { "version": "16" },
      "import/resolver": {
        "node": {
          "extensions": [".js", ".ios.js", ".android.js", ".native.js", ".ts", ".tsx"]
        },
        "babel-module": {
          "alias": {}
        }
      } 
    },
    rules: {
        'jest/expect-expect': 0,
        'import/namespace': 0
    }
};