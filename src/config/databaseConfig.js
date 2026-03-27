// src/config/databaseConfig.js

import https from 'https';
import url from 'url';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !SUPABASE_ANON_KEY) {
  throw new Error('Supabase configuration is missing');
}

const API_BASE = new URL(SUPABASE_URL).origin + '/rest/v1';

function createSupabaseClient() {
  const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'X-Client-Info': 'AuraPOS/1.0.0'
  };

  async function get(endpoint) {
    try {
      const endpointUrl = new URL(`${API_BASE}/${endpoint}`);
      const options = {
        method: 'GET',
        headers: headers
      };

      return new Promise((resolve, reject) => {
        const req = https.get(endpointUrl, options, (res) => {
          if (res.statusCode >= 400) {
            reject(new Error(`HTTP Error! Status: ${res.statusCode}`));
          }
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            try {
              const parsed = JSON.parse(data);
              resolve(parsed);
            } catch (error) {
              reject(error);
            }
          });
        });
        req.on('error', (error) => {
          reject(error);
        });
      });
    } catch (error) {
      throw error;
    }
  }

  return { get };
}

export const supabaseClient = createSupabaseClient();

export async function queryDatabase(tableName) {
  try {
    const result = await supabaseClient.get(tableName);
    return result;
  } catch (error) {
    console.error(`Error querying table ${tableName}:`, error);
    throw error;
  }
}