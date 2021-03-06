const { DefinePlugin } = require('webpack');

module.exports = {
  use: [
    ['neutrino-preset-mozilla-rpweb', {
      react: {
        hot: false,
        html: {
          title: 'TC Login Demo',
          links: [
            'https://fonts.googleapis.com/css?family=Work+Sans',
            'https://cdnjs.cloudflare.com/ajax/libs/grommet/1.6.0/grommet.min.css'
          ]
        },
        devServer: {
          port: 5050,
          historyApiFallback: { disableDotRule: true }
        }
      },
      eslint: {
        rules: {
          'react/display-name': 'off'
        }
      }
    }],
    (neutrino) => {
      neutrino.config.when(process.env.NODE_ENV === 'production', (config) => {
        config
          .entry('react')
          .merge([
            'react',
            'react-dom',
            'prop-types',
            'react-router-dom',
            'deepmerge',
            'change-case',
            'auth0-js',
            'taskcluster-client'
          ]);
      });

      neutrino.config.output.publicPath('/');
      neutrino.config.node.set('Buffer', true);

      neutrino.config
        .plugin('define')
        .use(DefinePlugin, [{
          'process.env.AUTH_DOMAIN': JSON.stringify('auth-dev.mozilla.auth0.com'),
          'process.env.AUTH_CLIENT_ID': JSON.stringify('AKWT8X3N1Qm4YyG6zQjfM22Fo6mblkhv'),
          'process.env.AUTH_AUDIENCE': JSON.stringify('taskcluster-login.ngrok.io'),
          'process.env.AUTH_REDIRECT_URI': process.env.NODE_ENV === 'production' ?
            JSON.stringify('https://taskcluster-oidc-test.herokuapp.com/login') :
            JSON.stringify('http://localhost:5050/login'),
          'process.env.AUTH_RESPONSE_TYPE': JSON.stringify('token id_token'),
          'process.env.AUTH_SCOPE': JSON.stringify('get-credentials openid profile')
        }]);

      neutrino.config.module
        .rule('plain-style')
          .test(/\.css$/)
          .include
            .add(neutrino.options.node_modules).end()
          .use('style')
            .loader(require.resolve('style-loader'))
            .end()
          .use('css')
              .loader(require.resolve('css-loader'));

      neutrino.config.module
        .rule('style')
          .exclude
            .add(neutrino.options.node_modules).end()
          .use('css')
            .options({ modules: true });
    }
  ]
};
