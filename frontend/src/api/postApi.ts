import { gql } from '@apollo/client';
import graphqlClient from './graphqlClient';

// GraphQL mutations and queries
const CREATE_POST_MUTATION = gql`
  mutation CreatePost($title: String!, $content: String!, $tagIds: [Int!]!) {
    createPost(input: { title: $title, content: $content, tagIds: $tagIds }) {
      id
      title
      content
      tags { id name }
    }
  }
`;

export const POSTS_QUERY = gql`
  query MyPosts {
    myPosts {
      id
      title
      content
      tags { id name }
    }
  }
`;

const UPDATE_POST_MUTATION = gql`
  mutation UpdatePost($input: UpdatePostInput!) {
    updatePost(input: $input) {
      id
      title
      content
      tags { id name }
    }
  }
`;

const DELETE_POST_MUTATION = gql`
  mutation DeletePost($id: Float!) {
    deletePost(id: $id)
  }
`;

const GET_CSRF_TOKEN_QUERY = gql`
  query GetCsrfToken {
    getCsrfToken {
      csrfToken
    }
  }
`;

// Create a new post using GraphQL mutation
export async function createPost(title: string, content: string, tagIds: number[]) {
  try {
    // Fetch CSRF token before mutation
    await graphqlClient.query({ query: GET_CSRF_TOKEN_QUERY });
    
    const response = await graphqlClient.mutate({
      mutation: CREATE_POST_MUTATION,
      variables: { title, content, tagIds }
    });
    return response.data.createPost;
  } catch (error) {
    console.error('Create post error:', error);
    throw error;
  }
}

// Fetch all posts for the current user
export async function getMyPosts() {
  try {
    const response = await graphqlClient.query({
      query: POSTS_QUERY
    });
    return response.data.myPosts || [];
  } catch (error) {
    console.error('Get posts error:', error);
    throw error;
  }
}

// Update an existing post by ID
export async function updatePost(id: number, title: string, content: string, tagIds: number[]) {
  try {
    // Fetch CSRF token before mutation
    await graphqlClient.query({ query: GET_CSRF_TOKEN_QUERY });
    
    const response = await graphqlClient.mutate({
      mutation: UPDATE_POST_MUTATION,
      variables: { input: { id, title, content, tagIds } }
    });
    return response.data.updatePost;
  } catch (error) {
    console.error('Update post error:', error);
    throw error;
  }
}

// Delete a post by ID
export async function deletePost(id: number) {
  try {
    // Fetch CSRF token before mutation
    await graphqlClient.query({ query: GET_CSRF_TOKEN_QUERY });
    
    const response = await graphqlClient.mutate({
      mutation: DELETE_POST_MUTATION,
      variables: { id }
    });
    return response.data.deletePost;
  } catch (error) {
    console.error('Delete post error:', error);
    throw error;
  }
} 