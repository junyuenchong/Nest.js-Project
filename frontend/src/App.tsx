// Main app component
import { useState, useEffect } from 'react';
import { logout, getProfile } from './api/auth';
import MainNavigation from './components/Navigation/MainNavigation';
import PostsPage from './components/Posts/PostsPage';
import TagsPage from './components/Tags/TagsPage';
import ProfileForm from './components/Auth/ProfileForm';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';

function App() {
  // State management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  // Check if user is logged in on app start
  useEffect(() => {
    let didFinish = false;
    const timeout = setTimeout(() => {
      if (!didFinish) setIsLoading(false);
    }, 5000);

    const checkAuthStatus = async () => {
      try {
        const profile = await getProfile();
        // If user is already logged in, set authenticated and show profile tab
        if (profile) {
          setIsAuthenticated(true);
          setActiveTab('profile');
        }
      } catch (error: any) {
        // Not logged in
        setIsAuthenticated(false);
      } finally {
        didFinish = true;
        setIsLoading(false);
        clearTimeout(timeout);
      }
    };
    checkAuthStatus();
  }, []); 

  // Handle successful login
  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowRegister(false);
    setActiveTab('profile'); // Automatically go to posts page after login
  };

  // Handle successful registration
  const handleRegister = () => {
    setShowRegister(false); // Switch to login page
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      setActiveTab('posts');
    } catch (error) {
      setIsAuthenticated(false);
      setActiveTab('posts');
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-500 via-purple-600 to-blue-600 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login/register if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-500 via-purple-600 to-blue-600 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {showRegister ? (
            <RegisterForm onRegister={handleRegister} />
          ) : (
            <LoginForm onLogin={handleLogin} />
          )}
          <div className="text-center mt-4">
            <button
              className="text-white hover:text-gray-100 font-medium transition-colors text-sm"
              onClick={() => setShowRegister(r => !r)}
            >
              {showRegister ? 'Already have an account? Login' : "Not a member? Sign up now"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show main app when authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <MainNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'posts' && (
          <PostsPage isAuthenticated={isAuthenticated} />
        )}
        {activeTab === 'tags' && (
          <TagsPage isAuthenticated={isAuthenticated} />
        )}
        {activeTab === 'profile' && isAuthenticated && (
          <div className="max-w-lg mx-auto">
            <ProfileForm />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
