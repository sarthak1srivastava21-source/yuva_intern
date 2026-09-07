import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    if (liked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="post-card animate-fade-in">
      <Link to={`/profile/${post.username}`}>
        <img src={post.avatar} alt={post.username} className="avatar" />
      </Link>
      
      <div className="post-body">
        <div className="post-meta">
          <Link to={`/profile/${post.username}`} className="post-author">
            {post.name}
          </Link>
          <span className="post-username">@{post.username}</span>
          <span className="post-time">· {post.timestamp}</span>
          <button className="action-btn" style={{ marginLeft: 'auto' }}>
            <MoreHorizontal size={18} />
          </button>
        </div>
        
        <div className="post-content">
          <p>{post.content}</p>
        </div>
        
        <div className="post-actions">
          <button 
            className={`action-btn comment`} 
            onClick={() => alert('Comment clicked (Mock)')}
          >
            <MessageCircle size={18} />
            <span style={{ fontSize: '0.9rem', marginLeft: '0.25rem' }}>{post.comments}</span>
          </button>
          
          <button 
            className={`action-btn like`} 
            onClick={handleLike}
            style={{ color: liked ? '#f91880' : 'inherit' }}
          >
            <Heart size={18} fill={liked ? '#f91880' : 'none'} />
            <span style={{ fontSize: '0.9rem', marginLeft: '0.25rem' }}>{likesCount}</span>
          </button>
          
          <button className="action-btn share">
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
