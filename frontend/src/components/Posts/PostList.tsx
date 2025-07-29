interface PostListProps {
  posts: any[];
  loading: boolean;
  error: string;
  onEdit: (post: any) => void;
  onDelete: (id: number) => Promise<void>;
  refetchPosts: () => Promise<void>;
}

// PostList component: displays a list of posts provided by the parent (App.tsx)
export default function PostList({ posts, loading, error, onEdit, onDelete, refetchPosts }: PostListProps) {
  // Handle delete post
  const handleDeletePost = async (postId: number, postTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${postTitle}"? This action cannot be undone.`)) {
      try {
        await onDelete(postId);
      } catch (error: any) {
        console.error('Delete post error:', error);
        // Error message is already shown by the parent component
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 pt-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700 text-sm">{error}</p>
          <button onClick={refetchPosts} className="text-blue-600 underline mt-2">Retry</button>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <p className="text-gray-500 mb-4">You haven't created any posts yet.</p>
        <p className="text-sm text-gray-400">Create your first post using the form above.</p>
      </div>
    );
    }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">My Posts</h2>
        <button 
          onClick={refetchPosts} 
          className="text-white hover:bg-white/10 p-2 rounded-full transition-colors"
        >
          &#8635;
        </button>
      </div>
      <div className="p-4">
          <ul className="divide-y divide-gray-200">
          {posts.map((post: any) => (
              <li key={post.id} className="py-5 hover:bg-gray-50 transition-colors">
                <div className="px-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{post.title}</h3>
                  <div className="text-gray-600 mb-3 whitespace-pre-wrap">
                    {post.content.length > 200 
                      ? `${post.content.substring(0, 200)}...` 
                    : post.content}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags && post.tags.map((tag: any) => (
                      <span 
                        key={tag.id} 
                        className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="inline-flex items-center px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500" 
                      onClick={() => onEdit({ ...post, tagIds: post.tags ? post.tags.map((t: any) => t.id) : [] })}
                    >
                    &#9998; Edit
                    </button>
                    <button 
                    className="inline-flex items-center px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" 
                    onClick={() => handleDeletePost(post.id, post.title)}
                  >
                    &#128465; Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
      </div>
    </div>
  );
} 