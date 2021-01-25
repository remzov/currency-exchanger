module.exports = {
  "parser": "vue-eslint-parser",
  "extends": ["plugin:vue/base"],
  "rules": {
    'vue/html-closing-bracket-spacing': ['error', {
      startTag: 'never',
      endTag: 'never',
      selfClosingTag: 'never'
    }],
    'quotes': ["error", "single"]
  }
}
