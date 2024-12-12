module.exports = {
    webpack(config, { isServer, dev }) {
      if (!isServer) {
        // Check if in production or development mode
        const publicPath = dev ? 'http://localhost:3002/_next/static/fonts/' : 'https://your-production-url.com/_next/static/fonts/';
  
        config.module.rules.push({
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              publicPath,  // Use different public path based on the environment
              outputPath: 'static/fonts/',
            },
          },
        });
      }
      return config;
    },
  };