const withPrefresh = require('@prefresh/next');
const preact = require('preact');
const withPreact = require('next-plugin-preact');
const path = require('path')

module.exports = withPreact({
  experimental: {
    modern: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  env: {
    NEXT_PUBLIC_FAUNA_KEY: 'fnAD-5GAWYACB0DznQW7f36Ml1R8fP-_ps7L3cIo',
  },
});
