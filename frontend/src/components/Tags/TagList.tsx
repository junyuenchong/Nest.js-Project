

import { useState } from 'react';

interface TagListProps {
  tags: any[];
  loading: boolean;
  error: string;
  onSelect?: (tag: any) => void;
  refetchTags: () => Promise<void>;
  onDeleteTag: (id: number) => Promise<void>;
  onUpdateTag: (id: number, name: string) => Promise<void>;
}

// TagList component: displays a list of tags provided by the parent (App.tsx)
export default function TagList({ tags, loading, error, onSelect, refetchTags, onDeleteTag, onUpdateTag }: TagListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editError, setEditError] = useState('');
  const [tagErrors, setTagErrors] = useState<{ [id: number]: string }>({});

  const handleEdit = (tag: any) => {
    setEditingId(tag.id);
    setEditName(tag.name);
    setEditError('');
    setTagErrors(errors => ({ ...errors, [tag.id]: '' }));
  };

  const handleEditSave = async (id: number) => {
    if (!editName.trim()) {
      setEditError('Tag name cannot be empty');
      return;
    }
    try {
      await onUpdateTag(id, editName.trim());
      setEditingId(null);
      setEditName('');
      setEditError('');
      setTagErrors(errors => ({ ...errors, [id]: '' }));
    } catch (err: any) {
      setTagErrors(errors => ({ ...errors, [id]: err?.message || 'Failed to update tag' }));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await onDeleteTag(id);
      setTagErrors(errors => ({ ...errors, [id]: '' }));
    } catch (err: any) {
      setTagErrors(errors => ({ ...errors, [id]: err?.message || 'Failed to delete tag' }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">All Tags</h2>
      </div>
      <div className="p-6">
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading tags...</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700 text-sm">{error}</p>
            <button onClick={refetchTags} className="text-blue-600 underline mt-2">Retry</button>
          </div>
        )}

        {!loading && !error && (!tags || tags.length === 0) && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">No tags available</p>
            <p className="text-sm text-gray-400">Create your first tag to get started</p>
          </div>
        )}

        {!loading && !error && tags && tags.length > 0 && (
          <div className="space-y-3">
            {tags.map((tag: any) => (
              <div key={tag.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                {editingId === tag.id ? (
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter tag name"
                      autoFocus
                    />
                    <button
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm"
                      onClick={() => handleEditSave(tag.id)}
                    >
                      Save
                    </button>
                    <button
                      className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors text-sm"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                    {editError && <span className="text-sm text-red-500">{editError}</span>}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onSelect && onSelect(tag)}
                      className="flex-1 text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset text-sm font-medium text-gray-900"
                    >
                      {tag.name}
                    </button>
                    <button
                      className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md transition-colors text-sm"
                      onClick={() => handleEdit(tag)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md transition-colors text-sm"
                      onClick={() => handleDelete(tag.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
                {/* Show error for this tag if any */}
                {tagErrors[tag.id] && (
                  <span className="text-sm text-red-500">{tagErrors[tag.id]}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 