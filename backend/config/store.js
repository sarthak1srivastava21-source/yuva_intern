import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { Comment } from '../models/Comment.js';

// In-Memory Fallback Collections (Used when MongoDB server is offline)
const memUsers = [
  {
    _id: '65f010000000000000000001',
    username: 'sarthak',
    email: 'sarthak@nexus.dev',
    password: '', // will be hashed
    bio: 'Full Stack Intern @ CodeAlpha | Building Nexus Platform',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    followers: [],
    following: [],
    createdAt: new Date(),
  },
  {
    _id: '65f010000000000000000002',
    username: 'alex_dev',
    email: 'alex@nexus.dev',
    password: '',
    bio: 'React & Node.js Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    followers: [],
    following: [],
    createdAt: new Date(),
  },
];

const memPosts = [
  {
    _id: '65f020000000000000000001',
    user: '65f010000000000000000001',
    authorName: 'Sarthak Srivastava',
    authorHandle: 'sarthak',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    content: 'Just launched the front-end setup for Nexus! Loving Vite and React 19 performance. 🚀',
    mediaUrl: '',
    likes: [],
    likesCount: 5,
    commentsCount: 2,
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    _id: '65f020000000000000000002',
    user: '65f010000000000000000002',
    authorName: 'Alex Rivera',
    authorHandle: 'alex_dev',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    content: 'Clean code architecture and modular REST endpoints make frontend integration a breeze.',
    mediaUrl: '',
    likes: [],
    likesCount: 12,
    commentsCount: 4,
    createdAt: new Date(Date.now() - 7200000),
  },
];

const memComments = [
  {
    _id: '65f030000000000000000001',
    post: '65f020000000000000000001',
    user: '65f010000000000000000002',
    authorName: 'Alex Rivera',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    text: 'Great work! Looking forward to the backend integration.',
    createdAt: new Date(),
  },
];

// Initialize default hashed passwords for fallback users
(async () => {
  const hash = await bcrypt.hash('password123', 10);
  memUsers.forEach((u) => {
    u.password = hash;
  });
})();

export const isDbConnected = () => mongoose.connection.readyState === 1;

export const Store = {
  // --- USERS ---
  async findUserByEmail(email) {
    if (isDbConnected()) {
      return await User.findOne({ email }).select('+password');
    }
    return memUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserByUsername(username) {
    if (isDbConnected()) {
      return await User.findOne({ username });
    }
    return memUsers.find((u) => u.username.toLowerCase() === username.toLowerCase()) || null;
  },

  async findUserById(id) {
    if (isDbConnected()) {
      return await User.findById(id);
    }
    return memUsers.find((u) => u._id.toString() === id.toString()) || null;
  },

  async createUser({ username, email, password, bio, avatar }) {
    if (isDbConnected()) {
      return await User.create({ username, email, password, bio, avatar });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {
      _id: new mongoose.Types.ObjectId().toString(),
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      bio: bio || 'Hello! I am using Nexus.',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      followers: [],
      following: [],
      createdAt: new Date(),
    };
    memUsers.push(newUser);
    return newUser;
  },

  async updateUserProfile(userId, { bio, avatar }) {
    if (isDbConnected()) {
      return await User.findByIdAndUpdate(userId, { bio, avatar }, { new: true, runValidators: true });
    }
    const user = memUsers.find((u) => u._id.toString() === userId.toString());
    if (user) {
      if (bio !== undefined) user.bio = bio;
      if (avatar !== undefined) user.avatar = avatar;
    }
    return user;
  },

  async getSuggestedUsers(excludeUserId, limit = 5) {
    if (isDbConnected()) {
      return await User.find({ _id: { $ne: excludeUserId } }).limit(limit).select('username bio avatar');
    }
    return memUsers
      .filter((u) => u._id.toString() !== excludeUserId?.toString())
      .slice(0, limit)
      .map(({ _id, username, bio, avatar }) => ({ _id, username, bio, avatar }));
  },

  // --- POSTS ---
  async getAllPosts(limit = 20, page = 1) {
    if (isDbConnected()) {
      return await Post.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    }
    return [...memPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice((page - 1) * limit, page * limit);
  },

  async getPostsByUser(userId) {
    if (isDbConnected()) {
      return await Post.find({ user: userId }).sort({ createdAt: -1 });
    }
    return memPosts.filter((p) => p.user.toString() === userId.toString());
  },

  async getPostById(id) {
    if (isDbConnected()) {
      return await Post.findById(id);
    }
    return memPosts.find((p) => p._id.toString() === id.toString()) || null;
  },

  async createPost({ userId, authorName, authorHandle, authorAvatar, content, mediaUrl }) {
    if (isDbConnected()) {
      return await Post.create({
        user: userId,
        authorName,
        authorHandle,
        authorAvatar,
        content,
        mediaUrl: mediaUrl || '',
      });
    }
    const newPost = {
      _id: new mongoose.Types.ObjectId().toString(),
      user: userId.toString(),
      authorName,
      authorHandle,
      authorAvatar: authorAvatar || '',
      content,
      mediaUrl: mediaUrl || '',
      likes: [],
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date(),
    };
    memPosts.unshift(newPost);
    return newPost;
  },

  async deletePost(id, userId) {
    if (isDbConnected()) {
      const post = await Post.findById(id);
      if (!post) return null;
      if (post.user.toString() !== userId.toString()) return 'unauthorized';
      await post.deleteOne();
      return true;
    }
    const index = memPosts.findIndex((p) => p._id.toString() === id.toString());
    if (index === -1) return null;
    if (memPosts[index].user.toString() !== userId.toString()) return 'unauthorized';
    memPosts.splice(index, 1);
    return true;
  },

  async toggleLikePost(postId, userId) {
    if (isDbConnected()) {
      const post = await Post.findById(postId);
      if (!post) return null;
      const uid = userId.toString();
      const hasLiked = post.likes.some((id) => id.toString() === uid);
      if (hasLiked) {
        post.likes = post.likes.filter((id) => id.toString() !== uid);
      } else {
        post.likes.push(userId);
      }
      post.likesCount = post.likes.length;
      await post.save();
      return { post, liked: !hasLiked };
    }
    const post = memPosts.find((p) => p._id.toString() === postId.toString());
    if (!post) return null;
    const uid = userId.toString();
    const idx = post.likes.indexOf(uid);
    let liked = false;
    if (idx > -1) {
      post.likes.splice(idx, 1);
    } else {
      post.likes.push(uid);
      liked = true;
    }
    post.likesCount = post.likes.length;
    return { post, liked };
  },

  // --- COMMENTS ---
  async getCommentsByPostId(postId) {
    if (isDbConnected()) {
      return await Comment.find({ post: postId }).sort({ createdAt: -1 });
    }
    return memComments.filter((c) => c.post.toString() === postId.toString());
  },

  async addComment({ postId, userId, authorName, authorAvatar, text }) {
    if (isDbConnected()) {
      const comment = await Comment.create({
        post: postId,
        user: userId,
        authorName,
        authorAvatar,
        text,
      });
      await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });
      return comment;
    }
    const newComment = {
      _id: new mongoose.Types.ObjectId().toString(),
      post: postId.toString(),
      user: userId.toString(),
      authorName,
      authorAvatar: authorAvatar || '',
      text,
      createdAt: new Date(),
    };
    memComments.unshift(newComment);
    const post = memPosts.find((p) => p._id.toString() === postId.toString());
    if (post) post.commentsCount = (post.commentsCount || 0) + 1;
    return newComment;
  },
};
