const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Post = mongoose.model('Post');
const { requireUser } = require('../../config/passport');
const validatePostInput = require('../../validations/posts');
const { multipleFilesUpload, multipleMulterUpload, retrievePrivateFile } = require("../../awsS3");

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
                              .populate("author", "_id username profileImageUrl")
                              .sort({ createdAt: -1 });
    posts.forEach(post=>{
      let imageUrls = post.imageUrls?.map(imageUrl => retrievePrivateFile(imageUrl))
      post.imageUrls = imageUrls ? imageUrls: [];
    })
    // posts[0].imageUrls = [retrievePrivateFile(posts[0].imageUrls[0])]

    return res.json(posts);
  }
  catch(err) {
    return res.json([]);
  }
});

router.get('/user/:userId', async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.params.userId);
  } catch(err) {
    const error = new Error('User not found');
    error.statusCode = 404;
    error.errors = { message: "No user found with that id" };
    return next(error);
  }
  try {
    const posts = await Post.find({ author: user._id })
                              .sort({ createdAt: -1 })
                              .populate("author", "_id username profileImageUrl")
    posts.forEach(post=>{
      let imageUrls = post.imageUrls?.map(imageUrl => retrievePrivateFile(imageUrl))
      post.imageUrls = imageUrls ? imageUrls: [];
    })
    return res.json(posts);
  }
  catch(err) {
    return res.json([]);
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
                             .populate("author", "_id username profileImageUrl")
    const imageUrls = post.imageUrls.map(imageUrl => retrievePrivateFile(imageUrl))
    return res.json({...post._doc, imageUrls});
  }
  catch(err) {
    const error = new Error('Post not found');
    error.statusCode = 404;
    error.errors = { message: "No post found with that id" };
    return next(error);
  }
});


// Attach requireUser as a middleware before the route handler to gain access
// to req.user. (requireUser will return an error response if there is no 
// current user.) Also attach validatePostInput as a middleware before the 
// route handler.
router.post('/', multipleMulterUpload("images"), validatePostInput, requireUser, async (req, res, next) => {
  const imageUrls = req.files ? await multipleFilesUpload({ files: req.files, public: false }): null;
  try {
    const newPost = new Post({
      text: req.body.text,
      imageUrls,  
      author: req.user._id
    });
    

    let post = await newPost.save();
    post = await post.populate("author", "_id username profileImageUrl")
    // const imageUrls = post.imageUrls.map(imageUrl => retrievePrivateFile(imageUrl))
    return res.json(post);
  }
  catch(err) {
    next(err);
  }
});

module.exports = router;