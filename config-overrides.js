/* config-overrides.js */
const { useBabelRc, override, addWebpackExternals } = require('customize-cra')

module.exports = override(
  useBabelRc(),
  addWebpackExternals({
    'highlight.js': 'hljs',
  })
)
