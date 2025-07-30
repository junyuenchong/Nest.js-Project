import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useFormValidation } from '../../validators/hooks/useFormValidation';
import { profileUpdateSchema } from '../../validators/auth.validator';

type Profile = { id: number; username: string; email: string; bio?: string };
type ProfileFormState = { username: string; email: string; password: string; confirmPassword: string; bio: string };

const PROFILE_QUERY = gql`
  query Profile {
    profile {
      id
      username
      email
      bio
    }
  }
`;

const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($username: String, $password: String, $bio: String) {
    updateProfile(input: { username: $username, password: $password, bio: $bio }) {
      id
      username
      email
      bio
    }
  }
`;

export default function ProfileForm() {
  const [form, setForm] = useState<ProfileFormState>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
  });
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { errors, validateField, clearFieldError } = useFormValidation(profileUpdateSchema);

  // Apollo: Fetch profile
  const { data, loading: isLoading, error, refetch } = useQuery<{ profile: Profile }>(PROFILE_QUERY, {
    fetchPolicy: 'network-only',
  });

  // Set form fields when profile loads
  React.useEffect(() => {
    if (data && data.profile) {
      setForm((prev) => ({
        ...prev,
        username: data.profile.username || '',
        email: data.profile.email || '',
        bio: data.profile.bio || '',
      }));
    }
  }, [data]);

  // Handle input changes and validate field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name as keyof typeof form, value);
  };

  // Clear field error on focus
  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    clearFieldError(e.target.name as keyof typeof form);
  };

  // Apollo: Mutation for updating profile
  const [updateProfile, { error: mutationError, reset: resetMutation }] = useMutation(
    UPDATE_PROFILE_MUTATION,
    {
      onCompleted: () => {
        setMessage('Profile updated successfully!');
        setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
        refetch();
        setIsSaving(false);
      },
      onError: () => {
        setMessage('');
        setIsSaving(false);
      },
    }
  );

  // Handle profile form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    resetMutation();
    
    // Check if any changes were made
    const hasChanges = form.password || form.confirmPassword || form.bio !== (data?.profile?.bio || '');
    
    if (!hasChanges) {
      setMessage('No changes to save.');
      return;
    }
    
    // Validate password if provided
    if (form.password && form.password !== form.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    
    setIsSaving(true);
    updateProfile({
      variables: {
      password: form.password || undefined,
        bio: form.bio || undefined,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <p className="text-center text-gray-500">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Your Profile</h2>
      </div>
      <div className="px-6 py-5 bg-blue-50 border-b border-blue-100">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-semibold">
            {(data && data.profile && data.profile.username && data.profile.username.charAt(0)?.toUpperCase()) || 'U'}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-800">{data && data.profile && data.profile.username ? data.profile.username : 'User'}</h3>
            <p className="text-sm text-gray-600">{data && data.profile && data.profile.email ? data.profile.email : 'No email available'}</p>
            {data && data.profile && data.profile.bio && (
              <p className="text-sm text-gray-500 mt-1 italic">"{data.profile.bio}"</p>
            )}
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="px-6 py-6">
        {message && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="text-green-700">{message}</p>
          </div>
        )}
        {(error || mutationError) && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">{error ? String(error) : 'Update failed.'}</p>
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              id="username"
              name="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
              value={form.username}
              readOnly
              tabIndex={-1}
              placeholder="Username"
              disabled
            />
            <p className="text-xs text-gray-400 mt-1">Username cannot be changed</p>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
              type="email"
              value={form.email}
              readOnly
              tabIndex={-1}
              placeholder="Email"
              disabled
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Biography</label>
            <textarea
              id="bio"
              name="bio"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              value={form.bio}
              onChange={handleChange}
              onFocus={handleFocus}
              placeholder="Tell us about yourself..."
              rows={4}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.bio && <p className="text-red-600 text-sm">{errors.bio}</p>}
              <p className="text-xs text-gray-400 ml-auto">{form.bio.length}/500</p>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-md font-medium mb-2">Change Password</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  id="password"
                  name="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  placeholder="Leave blank to keep current password"
                  type="password"
                />
                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  placeholder="Confirm new password"
                  type="password"
                />
                {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button
            className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
              isSaving
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
} 