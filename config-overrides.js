// config-overrides.js
const path = require('path');

module.exports = function override(config, env) {
  // Add an additional entry point for the widget
  config.entry = {
    main: config.entry,
    'widget-embed': path.resolve(__dirname, 'src/widget-embed.js')
  };

  // Configure output
  config.output = {
    ...config.output,
    filename: 'static/js/[name].js',
  };

  return config;
};
