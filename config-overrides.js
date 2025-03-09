const path = require('path');

module.exports = function override(config, env) {
  // Use a unique name to avoid conflicts with existing files
  config.entry = {
    main: config.entry,
    'react-widget': path.resolve(__dirname, 'src/WidgetStandalone.jsx')
  };
  
  // Configure output
  config.output = {
    ...config.output,
    filename: 'static/js/[name].js',
  };
  
  return config;
}