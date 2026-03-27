// src/api/routes.js
const http = require('http');
const { createClient } = require('@supabase/supabase-js');
const { supabaseUrl, supabaseKey } = require('../../config/databaseConfig');
const { validateJwt } = require('../../utils/auth/jwt');
const { validateRequest } = require('../../utils/auth/validators');

const supabase = createClient(supabaseUrl, supabaseKey);

const routes = {
  '/tables': {
    GET: handleTablesGet,
    POST: handleTablesPost,
    PUT: handleTablesPut,
    DELETE: handleTablesDelete
  },
  '/orders': {
    GET: handleOrdersGet,
    POST: handleOrdersPost,
    PUT: handleOrdersPut,
    DELETE: handleOrdersDelete
  },
  '/menu': {
    GET: handleMenuGet,
    POST: handleMenuPost,
    PUT: handleMenuPut,
    DELETE: handleMenuDelete
  },
  '/auth': {
    POST: handleAuthPost,
    GET: handleAuthGet
  }
};

const rateLimiter = new Map();

function handleRequest(req, res) {
  const { url, method } = req;
  const path = url.split('?')[0];
  const startTime = Date.now();

  // Rate limiting
  const clientIP = req.connection.remoteAddress;
  const currentCount = (rateLimiter.get(clientIP) || 0) + 1;
  const currentTime = Date.now();
  
  if (currentCount > 100 || (currentTime - (rateLimiter.get(clientIP + 'timestamp') || 0)) < 1000) {
    res.writeHead(429, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' 
    });
    res.end(JSON.stringify({ 
      error: 'Too Many Requests',
      code: 'RATE_LIMIT_EXCEEDED',
      details: 'Please try again after 1 second.'
    }));
    return;
  }

  rateLimiter.set(clientIP, currentCount);
  rateLimiter.set(clientIP + 'timestamp', currentTime);

  // Authentication
  if (path !== '/auth' && !validateJwt(req.headers.authorization)) {
    res.writeHead(401, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' 
    });
    res.end(JSON.stringify({ 
      error: 'Unauthorized',
      code: 'AUTHENTICATION_FAILED',
      details: 'Valid JWT token required.'
    }));
    return;
  }

  const route = routes[path];
  if (!route) {
    sendErrorResponse(res, 404, 'Route not found', 'NOT_FOUND');
    return;
  }

  const handler = route[method];
  if (!handler) {
    sendErrorResponse(res, 405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
    return;
  }

  try {
    handler(req, res);
  } catch (error) {
    console.error('Error:', error);
    sendErrorResponse(res, 500, 'Internal server error', 'INTERNAL_ERROR', error.message);
  }
}

function sendErrorResponse(res, statusCode, message, code, details = null) {
  const response = {
    error: message,
    code: code,
    details: details
  };
  
  res.writeHead(statusCode, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*' 
  });
  res.end(JSON.stringify(response));
}

function validateRequestBody(req, schema) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const validationErrors = validateRequest(data, schema);
        if (validationErrors.length > 0) {
          reject({ 
            status: 400,
            message: 'Invalid request body',
            code: 'VALIDATION_ERROR',
            details: validationErrors 
          });
        } else {
          resolve(data);
        }
      } catch (error) {
        reject({ 
          status: 400,
          message: 'Invalid JSON format',
          code: 'PARSING_ERROR',
          details: error.message 
        });
      }
    });
  });
}

// Route handlers implementation with proper error handling...

const server = http.createServer(handleRequest);
server.listen(3000, () => {
  console.log('Server running on port 3000');
});