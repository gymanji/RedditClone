var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET all Posts */
router.get('/posts', function(req, res, next) {
	Post.find(function(err, posts) {
		if (err) { return next(err); }

		res.json(posts);
	});
});

/* Post for all 'Posts' */
router.post('/posts', function(req, res, next) {
	var post = new Post(req.body);

	post.save(function(err, post) {
		if(err) { return next(err); }

		res.json(post);
	});
});

/* route for pre-loading posts objects into routes/index.js */
router.param('post', function(req, res, next, id) {
	var query = Post.findById(id);

	query.exec(function(err, post) {
		if (err) { return next(err); }
		if (!post) { return next(new Error("Unable to locate post")); }

		req.post = post;
		return next();
	});
});

/* Route for locating single post by ID */
router.get('/posts/:post', function(req, res) {
	res.json.popular('comments', function(err, post) {
		res.json(post);
	});
});

router.put('/posts/:post/upvote', function(req, res, next) {
	req.post.upvote(function(err, post) {
		if (err) { return next(err); }

		res.json(post);
	});
});

/* Route for comments to particluar post */
router.post('/posts/:post/comments', function(req, res, next) {
	var comment = new Comment(req.body);
	comment.post = req.post;

	comment.save(function(err, comment) {
		if(err) { return next(err); }

		req.post.comments.push(comment);
		req.post.save(function(err, post) {
			if(err) { return next(err); }

			res.json(comment);
		});
	});
});

/* route for pre-loading comments objects into routes/index.js */
router.param('comment', function(req, res, next, id) {
	var query = Comment.findById(id);

	query.exec(function(err, comment) {
		if (err) { return next(err); }
		if (!comment) { return next(new Error("Unable to locate comment")); }

		req.comment = comment;
		return next();
	});
});

module.exports = router;


