import React, { useState, useEffect } from 'react';
import { createPostSchema } from '../../validators/post.validator';
import { useFormValidation } from '../../validators/hooks/useFormValidation';
import { getTags } from '../../api/tagApi';
import { createPost, updatePost } from '../../api/postApi';

interface PostFormProps {
  onSubmit: () => void;
  initialData?: {
    id: number;
    title: string;
    content: string;
    tagIds: number[];
  };
  refetchPosts: () => Promise<void>;
}

// PostForm component: form for creating or editing a post, fetches its own tags
export default function PostForm({ onSubmit, initialData, refetchPosts }: PostFormProps) {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tagIds: [] as number[],
  });
  // Error and loading state
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { errors, validateForm, validateField, clearErrors } = useFormValidation(createPostSchema);

  // Tag list state
  const [tags, setTags] = useState<any[]>([]);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [tagsError, setTagsError] = useState('');

  // Fetch tags from server
  const fetchTags = async () => {
    setTagsLoading(true);
    setTagsError('');
    try {
      const tagsData = await getTags();
      setTags(tagsData || []);
    } catch (err: any) {
      setTagsError('Failed to load tags');
    } finally {
      setTagsLoading(false);
    }
  };

  // Fetch tags on mount
  useEffect(() => {
    fetchTags();
  }, []);

  // Set form fields when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        content: initialData.content,
        tagIds: initialData.tagIds,
      });
    }
  }, [initialData]);

  // Toggle tag selection
  const toggleTag = (tagId: number) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId]
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm(formData)) return;

    setIsSubmitting(true);

    try {
      if (initialData) {
        // Update existing post
        await updatePost(initialData.id, formData.title, formData.content, formData.tagIds);
      } else {
        // Create new post
        await createPost(formData.title, formData.content, formData.tagIds);
      }

      setIsSubmitting(false);
      setFormData({ title: '', content: '', tagIds: [] });
      clearErrors();
        onSubmit();
      await refetchPosts(); // Update the post list in the parent
    } catch (error: any) {
      setIsSubmitting(false);
      setError(error.message || 'Failed to save post');
      }
  };

  // Handle input changes
  const handleInputChange = (field: keyof typeof formData, value: string | number[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  // Clear error for a specific field when it gets focus
  const handleInputFocus = () => {
    clearErrors();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">
          {initialData ? 'Edit Post' : 'Create New Post'}
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input 
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              onFocus={() => handleInputFocus()}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter post title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea 
              id="content"
              rows={6}
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              onFocus={() => handleInputFocus()}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Write your post content here..." 
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            {tagsLoading ? (
              <div className="text-gray-500 text-sm">Loading tags...</div>
            ) : tagsError ? (
              <div className="text-red-500 text-sm">{tagsError}</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id} 
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      formData.tagIds.includes(tag.id)
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
            {errors.tagIds && (
              <p className="mt-1 text-sm text-red-600">{errors.tagIds}</p>
              )}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setFormData({ title: '', content: '', tagIds: [] });
                clearErrors();
                onSubmit();
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors"
            >
              {isSubmitting ? 'Saving...' : (initialData ? 'Update Post' : 'Create Post')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 