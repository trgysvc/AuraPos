// src/api/user/userModel.js

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Initialize user table with native SQL
async function initializeUserTable() {
  try {
    const { data, error } = await supabase.rpc('create_user_table_if_not_exists');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error initializing user table:', error);
    throw error;
  }
}

// Create user table if not exists with native SQL
async function createUserTable() {
  try {
    const { data, error } = supabase.sql`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        username text NOT NULL UNIQUE,
        email text NOT NULL,
        password_hash text NOT NULL,
        role text NOT NULL DEFAULT 'user',
        phone text,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `.execute();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating user table:', error);
    throw error;
  }
}

// Validate user input
function validateUserInput(userData) {
  if (!userData.username || !userData.email || !userData.password_hash) {
    throw new Error('Missing required fields');
  }
  if (typeof userData.username !== 'string' || 
      typeof userData.email !== 'string' || 
      typeof userData.password_hash !== 'string') {
    throw new Error('Invalid data types');
  }
}

// Create user with parameterized query
async function createUser(userData) {
  try {
    validateUserInput(userData);
    
    const { data, error } = supabase
      .from('users')
      .insert([userData])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Get user by username with parameterized query
async function getUserByUsername(username) {
  try {
    if (!username || typeof username !== 'string') {
      throw new Error('Invalid username');
    }
    
    const { data, error } = supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user by username:', error);
    throw error;
  }
}

// Get user by id with parameterized query
async function getUserById(userId) {
  try {
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid user ID');
    }
    
    const { data, error } = supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
}

module.exports = {
  supabase,
  initializeUserTable,
  createUserTable,
  createUser,
  getUserByUsername,
  getUserById
};