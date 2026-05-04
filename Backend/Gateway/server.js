const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();


const app = express();

/* CORS */
app.use(
  cors({
    origin: process.env.FE_SERVICE_URL,
    credentials: true,
  }),
);

/* DEBUG LOGGER */
app.use((req, res, next) => {
  console.log("Gateway hit:", req.method, req.url);
  next();
});

/* AUTH SERVICE */
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/auth": "",
    },
    cookieDomainRewrite: process.env.AUTH_COOKIE_DOMAIN,
  }),
);

/* PRODUCT SERVICE */
app.use(
  "/api/products",
  createProxyMiddleware({
    target: process.env.PRODUCT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/products": "",
    },
    cookieDomainRewrite: process.env.PRODUCT_COOKIE_DOMAIN,
    logLevel: "debug",
    onProxyReq: (proxyReq, req, res) => {
      if (req.headers.cookie) {
        proxyReq.setHeader("cookie", req.headers.cookie);
      }
    },
  }),
);

app.use(
  "/api/cart",
  createProxyMiddleware({
    target: process.env.CART_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/cart": "",
    },
  })
)

app.use(
  "/api/orders",
  createProxyMiddleware({
    target: process.env.ORDER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/orders": "",
    },
    onProxyReq: async (proxyReq, req, res) => {
      if (req.headers.cookie) {
        proxyReq.setHeader("cookie", req.headers.cookie);
      }
    },
  })
);

app.use(
  "/api/wallet",
  createProxyMiddleware({
    target: process.env.WALLET_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/wallet": "",
    },
    onProxyReq: async (proxyReq, req, res) => {
      if (req.headers.cookie) {
        proxyReq.setHeader("cookie", req.headers.cookie);
      }
    },
  })
);

app.listen(4000, () => {
  console.log("API Gateway running on port 4000");
});
