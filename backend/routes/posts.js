const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts_controller');

// Public
router.get('/posts', postsController.getAllPosts);
router.get('/posts/all', postsController.getAllPostsAdmin);
router.get('/posts/:idOrSlug', postsController.getPost);

// Admin (CRUD)
router.post('/posts', postsController.createPost);
router.put('/posts/:id', postsController.updatePost);
router.delete('/posts/:id', postsController.deletePost);

module.exports = router;
