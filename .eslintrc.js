module.exports = {
  "parser": "babel-eslint",
  "extends": "google",
   "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "ecmaFeatures": {
    "arrowFunctions": true,
    "blockBindings": true,
    "classes": true,
    "defaultParams": true,
    "destructuring": true,
    "forOf": true,
    "generators": true,
    "modules": true,
    "spread": true,
    "templateStrings": true,
    "jsx": true
  },
  "rules": {
    "arrow-parens":[2, "always"],
    "arrow-spacing": [2, { "before": false, "after": false }],
    "no-alert":[0],
    "brace-style": [0],
    "camelcase": [0],
    "comma-spacing": [1, {"before": false, "after": true}],
    "comma-style": [2, "first"],
    "consistent-return": [0],
    "curly": [2, "multi-line"],
    "keyword-spacing": [1, {"before": true, "after": true, "overrides": {}}],
    "valid-jsdoc": [1, {
      "requireReturnType": false,
      "requireReturnDescription": false
    }],
    "quotes": [1, "single", "avoid-escape"],
    "new-cap": [0],
    "one-var": [1, "always"],
    "no-console":[2],
    "no-undef":[1], //Because of react work around
    "no-underscore-dangle":[0],
    "no-multi-spaces": [0],
    "no-shadow": [0],
    "no-unused-vars": [1],
    "no-use-before-define": [2, "nofunc"],
    "space-before-blocks":[1, "never"]
  }
};