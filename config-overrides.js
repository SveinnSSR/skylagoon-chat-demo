const path = require('path');

module.exports = function override(config, env) {
  // Create a standalone widget bundle with all dependencies included
  config.entry = {
    main: config.entry,
    'widget-bundle': './src/WidgetStandalone.jsx'
  };
  
  // Output configuration
  config.output = {
    ...config.output,
    filename: 'static/js/[name].js',
    library: 'SkyLagoonChat',
    libraryTarget: 'umd',
    publicPath: '/'
  };
  
  // Force style-loader for CSS (inlines styles instead of extracting them)
  const rules = config.module.rules.find(rule => Array.isArray(rule.oneOf)).oneOf;
  const cssRules = rules.filter(rule => rule.test && rule.test.toString().includes('css'));
  
  cssRules.forEach(rule => {
    if (rule.use && Array.isArray(rule.use)) {
      rule.use = rule.use.map(loader => {
        if (loader && loader.loader && loader.loader.includes('mini-css-extract-plugin')) {
          return { loader: require.resolve('style-loader') };
        }
        return loader;
      });
    }
  });
  
  return config;
};
