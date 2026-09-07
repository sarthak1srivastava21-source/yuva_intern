import { Store } from '../config/store.js';

// @desc    Get user profile by username
// @route   GET /api/users/:username
// @access  Public
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await Store.findUserByUsername(req.params.username);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User @${req.params.username} not found`,
      });
    }

    const posts = await Store.getPostsByUser(user._id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        followersCount: user.followers ? user.followers.length : 0,
        followingCount: user.following ? user.following.length : 0,
        postsCount: posts.length,
        createdAt: user.createdAt,
      },
      posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { bio, avatar } = req.body;

    const updatedUser = await Store.updateUserProfile(req.user._id, {
      bio,
      avatar,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get suggested users to follow
// @route   GET /api/users/suggestions
// @access  Public
export const getSuggestions = async (req, res, next) => {
  try {
    const currentUserId = req.user ? req.user._id : null;
    const suggestions = await Store.getSuggestedUsers(currentUserId, 5);

    res.status(200).json({
      success: true,
      count: suggestions.length,
      data: suggestions,
    });
  } catch (error) {
    next(error);
  }
};
