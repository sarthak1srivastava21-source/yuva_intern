import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';

const MOCK_POSTS = [
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
    id: 2,
    name: 'Guillermo Rauch',
    username: 'rauchg',
    avatar: 'https://i.pravatar.cc/150?u=rauchg',
    timestamp: '4h',
    content: 'The future of the web is at the edge. Vercel is making it easier than ever to deploy instantly and scale automatically. What are you building today?',
    likes: 3412,
    comments: 256
  },
  {
    id: 3,
    name: 'Dan Abramov',
    username: 'dan_abramov',
    avatar: 'https://i.pravatar.cc/150?u=dan',
    timestamp: '6h',
    content: 'Thinking about the mental models we use in React. State as a snapshot is fundamentally different from reactive streams.',
    likes: 892,
    comments: 112
  }
];

const SUGGESTIONS = [
  { name: 'Lee Robinson', username: 'leeerob', avatar: 'https://i.pravatar.cc/150?u=lee' },
  { name: 'Evan You', username: 'youyuxi', avatar: 'https://i.pravatar.cc/150?u=evan' },
  { name: 'Cassidy Williams', username: 'cassidoo', avatar: 'https://i.pravatar.cc/150?u=cass' }
];

const Dashboard = () => {
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState(MOCK_POSTS);

  const handlePost = () => {
    if (!postContent.trim()) return;
    
    const newPost = {
      id: Date.now(),
      name: 'Current User',
      username: 'currentUser',
      avatar: 'https://i.pravatar.cc/150?u=current',
      timestamp: 'Just now',
      content: postContent,
      likes: 0,
      comments: 0
    };
    
    setPosts([newPost, ...posts]);
    setPostContent('');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="feed-content">
        <header className="feed-header">
          <h2>Home</h2>
        </header>

        <div className="create-post">
          <img src="https://i.pravatar.cc/150?u=current" alt="Current User" className="avatar" />
          <div style={{ flex: 1 }}>
            <textarea 
              placeholder="What is happening?!" 
              rows="3"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            <div className="create-post-actions">
              <button 
                className="btn-primary" 
                onClick={handlePost}
                disabled={!postContent.trim()}
                style={{ opacity: postContent.trim() ? 1 : 0.5 }}
              >
                Post
              </button>
            </div>
          </div>
        </div>

        <div>
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>

      <aside className="right-sidebar">
        <div className="suggestions-card">
          <h3>Who to follow</h3>
          {SUGGESTIONS.map(user => (
            <div key={user.username} className="suggestion-item">
              <div className="suggestion-info">
                <img src={user.avatar} alt={user.username} className="avatar" style={{ width: 40, height: 40 }} />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>{user.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>@{user.username}</div>
                </div>
              </div>
              <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                Follow
              </button>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default Dashboard;
