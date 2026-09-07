import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Trash2, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const PostCard = ({ post, onDelete }) => {
  const { currentUser } = useAuth();
  const postId = post._id || post.id;

  const currentUserId = currentUser?._id || currentUser?.id;
  const initialLiked = Array.isArray(post.likes)
    ? post.likes.some((id) => (typeof id === 'object' ? id._id : id) === currentUserId)
    : false;

  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount ?? (Array.isArray(post.likes) ? post.likes.length : post.likes || 0));
  const [commentsCount, setCommentsCount] = useState(post.commentsCount ?? (Array.isArray(post.comments) ? post.comments.length : post.comments || 0));
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  const authorUsername = post.authorHandle || post.username || 'user';
  const authorDisplayName = post.authorName || post.name || authorUsername;
  const authorAvatar =
    post.authorAvatar || post.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

  const isAuthor =
    currentUser &&
    ((post.user && (post.user._id || post.user) === currentUserId) ||
      authorUsername === currentUser.username);

  const handleLike = async () => {
    // Optimistic UI update
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      if (post._id) {
        await api.posts.toggleLike(post._id);
      }
    } catch (err) {
      // Revert if failed
      setLiked(!nextLiked);
      setLikesCount((prev) => (nextLiked ? Math.max(0, prev - 1) : prev + 1));
      console.error('Like toggle failed:', err);
    }
  };

  const toggleComments = async () => {
    if (!showComments && comments.length === 0 && post._id) {
      try {
        setLoadingComments(true);
        const res = await api.comments.getByPost(post._id);
        if (res.success) {
          setComments(res.data || []);
        }
      } catch (err) {
        console.error('Could not fetch comments:', err);
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submittingComment || !post._id) return;

    try {
      setSubmittingComment(true);
      const res = await api.comments.add(post._id, commentText.trim());
      if (res.success && res.data) {
        setComments((prev) => [res.data, ...prev]);
        setCommentsCount((prev) => prev + 1);
        setCommentText('');
      }
    } catch (err) {
      alert(`Could not add comment: ${err.message}`);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      if (post._id) {
        await api.posts.delete(post._id);
      }
      if (onDelete) onDelete(postId);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  // Format date
  const displayDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    : post.timestamp || 'Recent';

  return (
    <div className="post-card animate-fade-in">
      <Link to={`/profile/${authorUsername}`}>
        <img src={authorAvatar} alt={authorUsername} className="avatar" />
      </Link>

      <div className="post-body">
        <div className="post-meta">
          <Link to={`/profile/${authorUsername}`} className="post-author">
            {authorDisplayName}
          </Link>
          <span className="post-username">@{authorUsername}</span>
          <span className="post-time">· {displayDate}</span>
          {isAuthor && (
            <button
              className="action-btn"
              style={{ marginLeft: 'auto', color: 'var(--danger)' }}
              onClick={handleDelete}
              title="Delete post"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        <div className="post-content">
          <p>{post.content}</p>
          {post.mediaUrl && (
            <img
              src={post.mediaUrl}
              alt="Post attachment"
              style={{ width: '100%', borderRadius: 8, marginTop: '0.5rem' }}
            />
          )}
        </div>

        <div className="post-actions">
          <button className="action-btn comment" onClick={toggleComments}>
            <MessageCircle size={18} />
            <span style={{ fontSize: '0.9rem', marginLeft: '0.25rem' }}>
              {commentsCount}
            </span>
          </button>

          <button
            className="action-btn like"
            onClick={handleLike}
            style={{ color: liked ? '#f91880' : 'inherit' }}
          >
            <Heart size={18} fill={liked ? '#f91880' : 'none'} />
            <span style={{ fontSize: '0.9rem', marginLeft: '0.25rem' }}>
              {likesCount}
            </span>
          </button>

          <button
            className="action-btn share"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Post link copied to clipboard!');
              }
            }}
          >
            <Share2 size={18} />
          </button>
        </div>

        {/* Real Dynamic Comments Section */}
        {showComments && (
          <div className="comments-section animate-fade-in">
            {currentUser && (
              <form onSubmit={handleAddComment} className="comment-form">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="comment-input"
                  disabled={submittingComment}
                />
                <button
                  type="submit"
                  className="btn-primary comment-submit-btn"
                  disabled={!commentText.trim() || submittingComment}
                >
                  <Send size={14} />
                </button>
              </form>
            )}

            {loadingComments ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Loading comments...
              </p>
            ) : comments.length > 0 ? (
              <div className="comments-list">
                {comments.map((c) => (
                  <div key={c._id || c.id} className="comment-item">
                    <img
                      src={
                        c.authorAvatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                      }
                      alt={c.authorName}
                      className="comment-avatar"
                    />
                    <div className="comment-content">
                      <span className="comment-author">{c.authorName}</span>
                      <span className="comment-text">{c.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                No comments yet. Start the conversation!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
