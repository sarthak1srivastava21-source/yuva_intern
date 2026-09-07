import { Store } from '../config/store.js';

// @desc    Get all feed posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const posts = await Store.getAllPosts(limit, page);

    res.status(200).json({
      success: true,
      count: posts.length,
      page,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req, res, next) => {
  try {
    const post = await Store.getPostById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res, next) => {
  try {
    const { content, mediaUrl } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Post content cannot be empty',
      });
    }

    const post = await Store.createPost({
      userId: req.user._id,
      authorName: req.user.username,
      authorHandle: req.user.username,
      authorAvatar: req.user.avatar || '',
      content: content.trim(),
      mediaUrl: mediaUrl || '',
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res, next) => {
  try {
    const result = await Store.deletePost(req.params.id, req.user._id);

    if (result === null) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    if (result === 'unauthorized') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this post',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle Like on a post
// @route   POST /api/posts/:id/like
// @access  Private
export const likePost = async (req, res, next) => {
  try {
    const result = await Store.toggleLikePost(req.params.id, req.user._id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    res.status(200).json({
      success: true,
      message: result.liked ? 'Post liked' : 'Post unliked',
      liked: result.liked,
      likesCount: result.post.likesCount,
      data: result.post,
    });
  } catch (error) {
    next(error);
  }
};
