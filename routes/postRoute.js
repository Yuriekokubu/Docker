const router = require('express').Router();
const postController = require('../controllers/postController');
const protect = require('../middleware/authMIddleware');

router
  .route('/')
  .get(protect, postController.getAllPosts)
  .post(protect, postController.createPost);

router
  .route('/:id')
  .get(protect, postController.getOnePost)
  .patch(protect, postController.updatePost)
  .delete(protect, postController.deletePost);

module.exports = router;
