// src/utils/jwt.js

const jwt = require('jsonwebtoken');

// Function to create JWT token
function createAccessToken(payload, secret = process.env.JWT_SECRET, options = {}) {
    try {
        const token = jwt.sign(payload, secret, {
            expiresIn: '15m', // Default expiration time
            ...options
        });
        return token;
    } catch (error) {
        console.error('Token creation failed:', error);
        throw error;
    }
}

// Function to verify JWT token
function verifyToken(token, secret = process.env.JWT_SECRET) {
    try {
        const decoded = jwt.verify(token, secret, { maxAge: '15m' });
        return decoded;
    } catch (error) {
        console.error('Token verification failed:', error);
        throw error;
    }
}

module.exports = {
    createAccessToken,
    verifyToken
};