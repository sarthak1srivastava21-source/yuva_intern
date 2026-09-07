import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { username } = useParams();
  const { currentUser, updateUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [bioInput, setBioInput] = useState('');
  const [savingBio, setSavingBio] = useState(false);

  // Determine if viewing own profile
  const isOwnProfile =
    currentUser &&
    (username === currentUser.username || username === 'currentUser');

  const targetUsername =
    username === 'currentUser' && currentUser ? currentUser.username : username;

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.users.getProfile(targetUsername);
        if (isMounted && res.success) {
          setProfileUser(res.user);
          setPosts(res.posts || []);
          setBioInput(res.user.bio || '');
        }
      } catch (err) {
        if (isMounted) {
          // If viewing self before full server sync
          if (isOwnProfile && currentUser) {
            setProfileUser(currentUser);
            setBioInput(currentUser.bio || '');
          } else {
            setError(err.message || 'User not found');
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [targetUsername, isOwnProfile, currentUser]);

  const handleSaveBio = async () => {
    try {
      setSavingBio(true);
      const res = await api.users.updateProfile({ bio: bioInput });
      if (res.success) {
        setProfileUser((prev) => ({ ...prev, bio: bioInput }));
        updateUser({ bio: bioInput });
        setIsEditing(false);
      }
    } catch (err) {
      alert(`Could not update bio: ${err.message}`);
    } finally {
      setSavingBio(false);
    }
  };

  const user = profileUser || {
    username: targetUsername,
    name: targetUsername,
    bio: 'Nexus community member',
    followersCount: 0,
    followingCount: 0,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="feed-content">
        <header className="feed-header">
          <h2>{user.username}</h2>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </div>
        </header>

        {loading ? (
          <div className="feed-loading-state">
            <div className="spinner"></div>
            <p>Loading profile details...</p>
          </div>
        ) : error ? (
          <div className="feed-empty-state">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="profile-header">
              <div className="profile-cover"></div>

              <div className="profile-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={user.username}
                    className="profile-avatar"
                  />
                  <div className="profile-actions" style={{ position: 'static', marginTop: '1rem' }}>
                    {isOwnProfile ? (
                      <button
                        className="btn-secondary"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? 'Cancel' : 'Edit Bio'}
                      </button>
                    ) : (
                      <button className="btn-primary">Follow</button>
                    )}
                  </div>
                </div>

                <div className="profile-name">
                  {user.name || user.username}
                </div>
                <div className="profile-username">@{user.username}</div>

                {isEditing ? (
                  <div style={{ marginTop: '0.75rem' }}>
                    <textarea
                      value={bioInput}
                      onChange={(e) => setBioInput(e.target.value)}
                      rows="2"
                      className="form-input"
                      style={{ width: '100%', marginBottom: '0.5rem' }}
                      placeholder="Write your bio..."
                    />
                    <button
                      className="btn-primary"
                      onClick={handleSaveBio}
                      disabled={savingBio}
                      style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                    >
                      {savingBio ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                ) : (
                  <div className="profile-bio">{user.bio || 'No bio yet.'}</div>
                )}

                <div className="profile-stats">
                  <div className="stat">
                    <span>{user.followingCount ?? user.following ?? 0}</span> Following
                  </div>
                  <div className="stat">
                    <span>{user.followersCount ?? user.followers ?? 0}</span> Followers
                  </div>
                </div>
              </div>
            </div>

            <div style={{ borderBottom: '1px solid var(--border-color)', display: 'flex' }}>
              <div
                style={{
                  padding: '1rem',
                  fontWeight: 700,
                  borderBottom: '3px solid var(--accent)',
                  color: 'var(--text-main)',
                }}
              >
                Posts
              </div>
            </div>

            <div>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard
                    key={post._id || post.id}
                    post={post}
                    onDelete={(deletedId) =>
                      setPosts((prev) => prev.filter((p) => (p._id || p.id) !== deletedId))
                    }
                  />
                ))
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No posts published yet.
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <aside className="right-sidebar"></aside>
    </div>
  );
};

export default Profile;
