// This file re-exports the auth middleware for compatibility
const { protect, adminOnly } = require('./auth');

module.exports = { protect, adminOnly, isAdmin: adminOnly };