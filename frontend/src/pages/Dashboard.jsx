import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [feedError, setFeedError] = useState('');

  // Fetch real posts and suggestions from backend
  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [postsRes, suggestionsRes] = await Promise.allSettled([
          api.posts.getAll(1, 30),
          api.users.getSuggestions(),
        ]);

        if (isMounted) {
          if (postsRes.status === 'fulfilled' && postsRes.value.success) {
            setPosts(postsRes.value.data || []);
          }
          if (suggestionsRes.status === 'fulfilled' && suggestionsRes.value.success) {
            setSuggestions(suggestionsRes.value.data || []);
          }
        }
      } catch (err) {
        if (isMounted) {
          setFeedError('Could not sync with backend feed. Check server connection.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePost = async () => {
    if (!postContent.trim() || posting) return;

    try {
      setPosting(true);
      const res = await api.posts.create({
        content: postContent.trim(),
      });

      if (res.success && res.data) {
        setPosts((prev) => [res.data, ...prev]);
        setPostContent('');
      }
    } catch (err) {
      alert(`Error publishing post: ${err.message}`);
    } finally {
      setPosting(false);
    }
  };

  const currentAvatar =
    currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="feed-content">
        <header className="feed-header">
          <h2>Home Feed</h2>
        </header>

        <div className="create-post">
          <img src={currentAvatar} alt="User" className="avatar" />
          <div style={{ flex: 1 }}>
            <textarea
              placeholder={
                currentUser
                  ? `What's on your mind, ${currentUser.username}?`
                  : 'What is happening?!'
              }
              rows="3"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              disabled={posting}
            />
            <div className="create-post-actions">
              <button
                className="btn-primary"
                onClick={handlePost}
                disabled={!postContent.trim() || posting}
                style={{ opacity: postContent.trim() && !posting ? 1 : 0.5 }}
              >
                {posting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>

        {feedError && (
          <div className="feed-warning-banner">
            {feedError}
          </div>
        )}

        {loading ? (
          <div className="feed-loading-state">
            <div className="spinner"></div>
            <p>Fetching live feed from Nexus backend...</p>
          </div>
        ) : posts.length > 0 ? (
          <div>
            {posts.map((post) => (
              <PostCard
                key={post._id || post.id}
                post={post}
                onDelete={(deletedId) =>
                  setPosts((prev) => prev.filter((p) => (p._id || p.id) !== deletedId))
                }
              />
            ))}
          </div>
        ) : (
          <div className="feed-empty-state">
            <p>No posts in feed yet. Be the first to share a thought!</p>
          </div>
        )}
      </main>

      <aside className="right-sidebar">
        <div className="suggestions-card">
          <h3>Who to follow</h3>
          {suggestions.length > 0 ? (
            suggestions.map((user) => (
              <div key={user._id || user.username} className="suggestion-item">
                <div className="suggestion-info">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={user.username}
                    className="avatar"
                    style={{ width: 40, height: 40 }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                      {user.username}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      @{user.username}
                    </div>
                  </div>
                </div>
                <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                  Follow
                </button>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No recommendations available.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
};

export default Dashboard;
