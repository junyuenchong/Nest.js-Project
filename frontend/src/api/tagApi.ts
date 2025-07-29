import { gql } from '@apollo/client';
import graphqlClient from './graphqlClient';

// GraphQL mutations and queries
const CREATE_TAG_MUTATION = gql`
  mutation CreateTag($name: String!) {
    createTag(input: { name: $name }) {
      id
      name
    }
  }
`;

export const TAGS_QUERY = gql`
  query GetTags {
    tags {
      id
      name
    }
  }
`;

const UPDATE_TAG_MUTATION = gql`
  mutation TagUpdateMutation($id: Int!, $name: String!) {
    updateTag(input: { id: $id, name: $name }) {
      id
      name
    }
  }
`;

const DELETE_TAG_MUTATION = gql`
  mutation TagDeleteMutation($id: Int!) {
    deleteTag(id: $id)
  }
`;

const GET_CSRF_TOKEN_QUERY = gql`
  query GetCsrfToken {
    getCsrfToken {
      csrfToken
    }
  }
`;

// Create a new tag using GraphQL mutation
export async function createTag(name: string) {
  try {
    // Fetch CSRF token before mutation
    await graphqlClient.query({ query: GET_CSRF_TOKEN_QUERY });
    
    const response = await graphqlClient.mutate({
      mutation: CREATE_TAG_MUTATION,
      variables: { name }
    });
    return response.data.createTag;
  } catch (error) {
    console.error('Create tag error:', error);
    throw error;
  }
}

// Fetch all tags using GraphQL query
export async function getTags() {
  try {
    const response = await graphqlClient.query({
      query: TAGS_QUERY
    });
    return response.data.tags || [];
  } catch (error) {
    console.error('Get tags error:', error);
    throw error;
  }
}

// Update an existing tag by ID
export async function updateTag(id: number, name: string) {
  try {
    // Fetch CSRF token before mutation
    await graphqlClient.query({ query: GET_CSRF_TOKEN_QUERY });
    
    const response = await graphqlClient.mutate({
      mutation: UPDATE_TAG_MUTATION,
      variables: { id, name }
    });
    return response.data.updateTag;
  } catch (error) {
    console.error('Update tag error:', error);
    throw error;
  }
}

// Delete a tag by ID
export async function deleteTag(id: number) {
  try {
    // Fetch CSRF token before mutation
    await graphqlClient.query({ query: GET_CSRF_TOKEN_QUERY });
    
    const response = await graphqlClient.mutate({
      mutation: DELETE_TAG_MUTATION,
      variables: { id }
    });
    return response.data.deleteTag;
  } catch (error) {
    console.error('Delete tag error:', error);
    throw error;
  }
} 