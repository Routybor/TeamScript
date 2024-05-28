const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://147.45.158.226:5000',
            changeOrigin: true,
        })
    );
};