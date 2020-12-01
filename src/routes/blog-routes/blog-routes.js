const express = require('express');
const router = express.Router();
const { getDb } = require('../../config/db/db');
const ObjectId = require('mongodb').ObjectID;
const { isAuthenticated, isAdmin } = require('../../middlewares/isAuthenticated');
const { validateJson } = require('../../lib/schema-validation');

router.post('/api/blogs/create', isAuthenticated, async (req, res) => {
    const db = getDb();

    //Create blog object
    const blogObj = {
        title: req.body.title,
        content: {
            blogImage: req.body.blogImage,
            blogContent: req.body.blogContent
        },
        author: ObjectId(req.currentUser._id)
    }

    //Validate json object
    const schemaResult = validateJson("newBlog",blogObj);
    if(!schemaResult || schemaResult === undefined){
        res.status(400).json({message: 'Failed to create new blog, check inputs'});
        return;
    }

    //Createing new blog 
    const newBlog = await db.blogs.insertOne(blogObj);
    if(!newBlog || newBlog === undefined || newBlog === ''){
        res.status(400).json({message: 'Failed due to server issues'});
    }

    res.status(200).json({
        message: 'New blog created successfully',
        blogId: newBlog.insertedId
    });
    return;
});

module.exports = router;