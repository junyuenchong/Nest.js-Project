import { gql } from '@apollo/client';
import graphqlClient from './graphqlClient';

// GraphQL mutations and queries
const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(input: { username: $username, email: $email, password: $password }) {
      id
      username
      email
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      user {
        id
        username
        email
      }
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export const PROFILE_QUERY = gql`
  query Profile {
    profile {
      id
      username
      email
    }
  }
`;

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      username
      email
    }
  }
`;

const GET_CSRF_TOKEN_QUERY = gql`
  query GetCsrfToken {
    getCsrfToken {
      csrfToken
    }
  }
`;

// Register a new user
export async function register(username: string, email: string, password: string) {
  try {
    const response = await graphqlClient.mutate({
      mutation: REGISTER_MUTATION,
      variables: { username, email, password }
    });
    return response.data.register;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
}

// Login a user
export async function login(email: string, password: string) {
  try {
    const response = await graphqlClient.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password }
    });
    // Fetch CSRF token after login
    await graphqlClient.query({ query: GET_CSRF_TOKEN_QUERY });
    return response.data.login;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Logout the current user
export async function logout() {
  try {
    // Fetch CSRF token before logout to ensure it's available
    await graphqlClient.query({ query: GET_CSRF_TOKEN_QUERY });
    
    const response = await graphqlClient.mutate({
      mutation: LOGOUT_MUTATION
    });
    
    return response.data.logout;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

// Fetch the current user's profile
export async function getProfile() {
  try {
    const response = await graphqlClient.query({
      query: PROFILE_QUERY
    });
    return response.data.profile || null;
  } catch (err: any) {
    // Completely suppress all logging for 401 errors
    if (err?.networkError?.statusCode !== 401) {
      console.error('Profile fetch error:', err);
    }
    return null;
  }
}

// Update the current user's profile
export async function updateProfile(data: { username?: string; email?: string; password?: string }) {
  try {
    // Fetch CSRF token before mutation
    await graphqlClient.query({ query: GET_CSRF_TOKEN_QUERY });
    
    const response = await graphqlClient.mutate({
      mutation: UPDATE_PROFILE_MUTATION,
      variables: { input: data }
    });
    return response.data.updateProfile;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
} 