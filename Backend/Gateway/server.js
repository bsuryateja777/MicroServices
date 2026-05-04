const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

/* CORS */
app.use(
  cors({
    origin: "http://localhost:3000",
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
    target: "http://localhost:5001/",
    changeOrigin: true,
    pathRewrite: {
      "^/api/auth": "",
    },
    cookieDomainRewrite: "localhost",
  }),
);

/* PRODUCT SERVICE */
app.use(
  "/api/products",
  createProxyMiddleware({
    target: "http://localhost:5002",
    changeOrigin: true,
    pathRewrite: {
      "^/api/products": "",
    },
    cookieDomainRewrite: "localhost",
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
    target: "http://localhost:5003",
    changeOrigin: true,
    pathRewrite: {
      "^/api/cart": "",
    },
  })
)

app.use(
  "/api/orders",
  createProxyMiddleware({
    target: "http://localhost:5004",
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
    target: "http://localhost:5005",
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
