// Apollo Client setup for GraphQL requests with error handling and token refresh

import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Create HTTP link to GraphQL server
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL || 'http://localhost:3000/graphql',
  credentials: 'include',
});

// Auth link to attach headers (if needed)
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
    }
  }
});

// Refresh the access token if expired
const refreshToken = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/graphql'}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        query: `
          mutation RefreshToken {
            refreshToken {
              accessToken
            }
          }
        `
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.data?.refreshToken?.accessToken;
    }
    return null;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};

// Handles GraphQL and network errors, tries to refresh token if needed
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (err.extensions?.code === 'UNAUTHENTICATED' || 
          err.message.includes('Invalid access token') ||
          err.message.includes('Token expired')) {
        
        // Skip token refresh for profile query if not authenticated
        if (operation.operationName === 'Profile') {
          return;
        }
        
        // Try to refresh token for other operations
        refreshToken().then(newToken => {
          if (newToken) {
            // Retry the original operation
            return forward(operation);
          } else {
            // If refresh fails, clear cache and redirect to login
            client.clearStore();
            window.location.href = '/';
          }
        });
        return;
      }
    }
  }
  
  // Handle 401 network errors (unauthorized)
  if (networkError) {
    if ((networkError as any).statusCode === 401) {
      // Skip token refresh for profile query if not authenticated
      if (operation.operationName === 'Profile') {
        return;
      }
      
      // Try to refresh token for other operations
      refreshToken().then(newToken => {
        if (newToken) {
          return forward(operation);
        } else {
          client.clearStore();
          window.location.href = '/';
        }
      });
      return;
    }
    console.error('Network error:', networkError);
  }
});

// Apollo Client instance with cache and error handling
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          tags: {
            merge: false,
          },
          posts: {
            merge: false,
          },
          profile: {
            merge: false,
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export default client; 