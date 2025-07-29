import { useState } from 'react';
import { useQuery } from '@apollo/client';
import PostForm from './PostForm';
import PostList from './PostList';
import { POSTS_QUERY } from '../../api/postApi';
import { deletePost } from '../../api/postApi';

interface PostsPageProps {
  isAuthenticated?: boolean;
}

export default function PostsPage({ isAuthenticated = true }: PostsPageProps) {
  // State management
  const [editingPost, setEditingPost] = useState<any>(null);

  // Fetch posts data using Apollo Query
  const { 
    data: postsData, 
    loading: postsLoading, 
    error: postsError, 
    refetch: refetchPosts 
  } = useQuery(POSTS_QUERY, {
    skip: !isAuthenticated,
    onError: (error) => {
      console.error('Posts fetch error:', error);
    },
  });

  // Handle refetch posts
  const handleRefetchPosts = async (): Promise<void> => {
    await refetchPosts();
  };

  // Handle form submission completion
  const handleFormSubmit = () => {
    setEditingPost(null);
  };

  // Handle post deletion
  const handleDeletePost = async (id: number): Promise<void> => {
    try {
      console.log('PostsPage: Calling deletePost with:', { id });
      await deletePost(id);
      console.log('PostsPage: deletePost successful');
      await refetchPosts();
    } catch (error: any) {
      console.error('Error deleting post:', error);
      const errorMessage = error?.message || 'Failed to delete post';
      alert(`Failed to delete post: ${errorMessage}`);
      throw new Error(errorMessage);
    }
  };

  // Handle post edit
  const handleEditPost = (post: any) => {
    setEditingPost({ ...post, tagIds: post.tags ? post.tags.map((t: any) => t.id) : [] });
  };

  // Show loading skeleton while posts load
  if (postsLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if posts fetch fails
  if (postsError) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <p className="text-red-600 mb-4">{postsError.message}</p>
        <button 
          onClick={() => refetchPosts()} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Render posts page with form and list
  return (
    <div className="space-y-6">
      <PostForm
        onSubmit={handleFormSubmit}
        initialData={editingPost || undefined}
        refetchPosts={handleRefetchPosts}
      />
      <PostList
        posts={postsData?.myPosts || []}
        loading={postsLoading}
        error={postsError ? (postsError as any).message : ''}
        onEdit={handleEditPost}
        onDelete={handleDeletePost}
        refetchPosts={handleRefetchPosts}
      />
    </div>
  );
} 