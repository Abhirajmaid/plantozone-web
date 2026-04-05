#!/usr/bin/env node

/**
 * Generate secure keys for Strapi deployment
 * Run: node generate-keys.js
 */

const crypto = require('crypto');

function generateKey() {
  return crypto.randomBytes(32).toString('base64');
}

console.log('\n=== Strapi Secret Keys for Railway Deployment ===\n');
console.log('Copy these values to your Railway environment variables:\n');
console.log(`APP_KEYS=${generateKey()},${generateKey()}`);
console.log(`API_TOKEN_SALT=${generateKey()}`);
console.log(`ADMIN_JWT_SECRET=${generateKey()}`);
console.log(`TRANSFER_TOKEN_SALT=${generateKey()}`);
console.log(`JWT_SECRET=${generateKey()}`);
console.log('\n=== Important: Keep these keys secure and never commit them to git ===\n');
