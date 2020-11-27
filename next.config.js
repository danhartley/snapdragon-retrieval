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
});