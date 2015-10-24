'use strict';

var Posts = require('./posts.model'); 

function handleError(res, err) {
  return res.send(500, err);
}

exports.posts = function(req, res) {   
    var loggedInUser = req.payload.username;
    if ( loggedInUser !== 'admin' ) {
        Posts.find({ __user: req.payload._userId }).exec(function(err, post) {
            if (err) { return handleError(res, err); }
            res.json({
                posts: post
            });
        });
    } else {
        Posts.find().populate('__user').exec(function(err, post) {
             if (err) { return handleError(res, err); }
            res.json({
                posts: post
            });
        });
    } 
};

exports.allposts = function(req, res) {
    Posts.find().exec(function(err, post) {
         if (err) { return handleError(res, err); }
        res.json({
            posts: post
        });
    });
};

exports.queryByDateAuth = function(req, res) { 
    var dateFrom = req.params.dateFrom;
    var dateTo = req.params.dateTo;
    Posts.find({ __user: req.payload._userId, date: { $gte: new Date(dateFrom), $lte: new Date(dateTo) }}).exec(function(err, data) {
         if (err) { return handleError(res, err); }
        res.json({
            data: data
        })
    });
};

exports.queryByDate = function(req, res) { 
    var dateFrom = req.params.dateFrom;
    var dateTo = req.params.dateTo;
    Posts.find({ date: { $gte: new Date(dateFrom), $lte: new Date(dateTo) }}).exec(function(err, data) {
         if (err) { return handleError(res, err); }
        res.json({
            data: data
        })
    });
};

// fetch a post according to it's id
exports.post = function(req, res) { 
    Posts.findById(req.params.id, function(err, posts) { 
        if (err) { return handleError(res, err); }
        res.json({
            posts: posts
        });
    });
};

// add a new post
exports.addpost = function(req, res) {
    var post = new Posts(req.body);
    post.date = new Date;
    post.__user = req.payload._userId; 
    post.save(function(err, post){
        if(err){ return handleError(res, err); } 
        res.json(post);
    });
};

// update a post
exports.updatepost = function(req, res) {
    Posts.findById(req.params.id, function(err, post) {
        if (err) { return handleError(res, err); }
        post.title = req.body.title;
        post.text = req.body.text;
        post.type_of_attack = req.body.type_of_attack;
        post.loc = req.body.loc;
        post.date = new Date;

        post.save(function(err, post){
            if(err){ return handleError(res, err); }
            res.json(post);
        });
    });
};

exports.deletepost = function(req, res) {
    // Posts.findById(req.params.id, function(err, post) {});
};  
