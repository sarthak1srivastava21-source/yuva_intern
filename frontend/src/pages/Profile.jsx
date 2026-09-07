import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';

const MOCK_USER_DATA = {
  name: 'Sarah Drasner',
  username: 'sarah_edo',
  bio: 'VP Developer Experience at Netlify. Vue core team member. Conference speaker & writer. Building tools for developers.',
  followers: 125400,
  following: 890,
  avatar: 'https://i.pravatar.cc/150?u=sarah',
  posts: [
    {
      id: 1,
      name: 'Sarah Drasner',
      username: 'sarah_edo',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
      timestamp: '2h',
      content: 'Just launched my new Vue.js course! So excited for everyone to see what we built over the last few months. 🚀💻',
      likes: 1245,
      comments: 89
    },
    {
      id: 4,
      name: 'Sarah Drasner',
      username: 'sarah_edo',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
      timestamp: 'Oct 12',
      content: 'Serverless functions are incredibly powerful when combined with a global edge network. The latency is practically non-existent.',
      likes: 450,
      comments: 32
    }
  ]
};

const Profile = () => {
  const { username } = useParams();
  
  // In a real app, we would fetch user data based on the username parameter.
  // For this mock, we'll just use the mock data above if it's sarah_edo, 
  // or a default fallback for "currentUser".
  
  const isCurrentUser = username === 'currentUser';
  const user = isCurrentUser ? {
    name: 'Current User',
    username: 'currentUser',
    bio: 'Just setting up my Nexus profile. Full stack developer building cool things.',
    followers: 42,
    following: 156,
    avatar: 'https://i.pravatar.cc/150?u=current',
    posts: []
  } : MOCK_USER_DATA;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="feed-content">
        <header className="feed-header">
          <h2>{user.name}</h2>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.posts.length} posts</div>
        </header>

        <div className="profile-header">
          <div className="profile-cover"></div>
          
          <div className="profile-info">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <img src={user.avatar} alt={user.username} className="profile-avatar" />
              <div className="profile-actions" style={{ position: 'static', marginTop: '1rem' }}>
                {isCurrentUser ? (
                  <button className="btn-secondary">Edit Profile</button>
                ) : (
                  <button className="btn-primary">Follow</button>
                )}
              </div>
            </div>
            
            <div className="profile-name">{user.name}</div>
            <div className="profile-username">@{user.username}</div>
            
            <div className="profile-bio">{user.bio}</div>
            
            <div className="profile-stats">
              <div className="stat"><span>{user.following}</span> Following</div>
              <div className="stat"><span>{user.followers.toLocaleString()}</span> Followers</div>
            </div>
          </div>
        </div>

        <div style={{ borderBottom: '1px solid var(--border-color)', display: 'flex' }}>
          <div style={{ padding: '1rem', fontWeight: 700, borderBottom: '3px solid var(--accent)', color: 'var(--text-main)' }}>
            Posts
          </div>
          <div style={{ padding: '1rem', color: 'var(--text-muted)' }}>
            Replies
          </div>
          <div style={{ padding: '1rem', color: 'var(--text-muted)' }}>
            Likes
          </div>
        </div>

        <div>
          {user.posts.length > 0 ? (
            user.posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No posts yet.
            </div>
          )}
        </div>
      </main>

      <aside className="right-sidebar">
        {/* We can re-use the suggestions card here or leave it empty */}
      </aside>
    </div>
  );
};

export default Profile;
