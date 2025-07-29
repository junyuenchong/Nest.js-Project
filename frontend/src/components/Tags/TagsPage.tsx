import { useQuery } from '@apollo/client';
import TagForm from './TagForm';
import TagList from './TagList';
import { TAGS_QUERY } from '../../api/tagApi';
import { updateTag, deleteTag } from '../../api/tagApi';

interface TagsPageProps {
  isAuthenticated?: boolean;
}

export default function TagsPage({ isAuthenticated = true }: TagsPageProps) {
  // Fetch tags data using Apollo Query
  const { 
    data: tagsData, 
    loading: tagsLoading, 
    error: tagsError, 
    refetch: refetchTags 
  } = useQuery(TAGS_QUERY, {
    skip: !isAuthenticated,
    onError: (error) => {
      console.error('Tags fetch error:', error);
    },
  });

  // Handle refetch tags
  const handleRefetchTags = async (): Promise<void> => {
    await refetchTags();
  };

  // Handle tag update
  const handleUpdateTag = async (id: number, name: string): Promise<void> => {
    try {
      await updateTag(id, name);
      await refetchTags();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to update tag';
      alert(`Failed to update tag: ${errorMessage}`);
      throw new Error(errorMessage);
    }
  };

  // Handle tag deletion
  const handleDeleteTag = async (id: number): Promise<void> => {
    try {
      await deleteTag(id);
      await refetchTags();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to delete tag';
      alert(`Failed to delete tag: ${errorMessage}`);
      throw new Error(errorMessage);
    }
  };

  // Show loading skeleton while tags load
  if (tagsLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if tags fetch fails
  if (tagsError) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <p className="text-red-600 mb-4">{tagsError.message}</p>
        <button 
          onClick={() => refetchTags()} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Render tags page with form and list
  return (
    <div className="space-y-6">
      <TagForm refetchTags={handleRefetchTags} />
      <TagList
        tags={tagsData?.tags || []}
        loading={tagsLoading}
        error={tagsError ? (tagsError as any).message : ''}
        onSelect={() => {}}
        refetchTags={handleRefetchTags}
        onDeleteTag={handleDeleteTag}
        onUpdateTag={handleUpdateTag}
      />
    </div>
  );
} 