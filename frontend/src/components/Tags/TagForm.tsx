import { useState } from 'react';
import { useFormValidation } from '../../validators/hooks/useFormValidation';
import { createTagSchema } from '../../validators/tag.validator';
import { createTag } from '../../api/tagApi';

interface TagFormProps {
  refetchTags: () => Promise<void>;
}

// TagForm component: form for creating a new tag
export default function TagForm({ refetchTags }: TagFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { errors, validateForm, validateField, clearErrors } = useFormValidation(createTagSchema);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateForm({ name })) return;
    setIsSubmitting(true);

    try {
      await createTag(name.trim());
      setIsSubmitting(false);
      setName('');
      clearErrors();
      await refetchTags(); // Update the tag list in the parent
    } catch (error: any) {
      setIsSubmitting(false);
      setError(error.message || 'Failed to create tag');
    }
  };

  // Handle input change and validation
  const handleInputChange = (value: string) => {
    setName(value);
    validateField('name', value);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-400 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Create New Tag</h2>
      </div>
      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        <div className="space-y-6">
          <div>
            <label htmlFor="tagName" className="block text-sm font-medium text-gray-700 mb-2">
              Tag Name
            </label>
            <input
              type="text"
              id="tagName"
              value={name}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => clearErrors()}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter tag name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create Tag'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 