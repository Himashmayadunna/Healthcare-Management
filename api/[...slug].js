/**
 * Vercel Serverless Function Handler for Backend
 * Route: /api/[...slug].js
 * This proxies all /api/* requests to the Express backend
 */

const app = require("../backend/server");

module.exports = app;
