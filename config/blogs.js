const Blog =  require('./../models/blog')
const path = require('path')

const newBlog = async (req, res, next) => {
    req.blog = new Blog()
    next()
}

const editBlog =  async (req, res, next) => {
    req.blog = await Blog.findOneAndUpdate({ slug: req.params.slug }, { upsert: true })
    next()
}

const deleteBlog = async (req, res) => {
    await Blog.findOneAndDelete({ slug: req.params.slug })
    res.redirect('/blog')
}

const postComment = (req, res) => {
    const comment = {
        text: req.body.comment,
        name: req.body.name,
        email: req.body.email,
        date: new Date()
    }
    Blog.findOneAndUpdate({ slug: req.params.slug }, { comment: comment }, function(err, data) {
        if (err) {
            res.send(err);
        } else {
            data.comments.push(comment);
            data.save(err => {
                if (err) { 
                    return res.json({message: "Comment failed to add.", error:err});
                }
                return res.redirect('/blog/' + req.params.slug)
            })  
        }
    });
}

const deleteComment = (req, res) => {
    const comment = req.params.commentsId
    Blog.findOneAndUpdate({ slug: req.params.slug }, { comment: comment}, function(err, data) {
        if (err) {
            res.sendDate(err);
        } else {
            data.comments.remove(comment);
            data.save(err => {
                if (err) {
                    return res.json({message: 'Failed to remove', error: err});
                }
                return res.redirect('/blog/' + req.params.slug)
            })
        }
   }) 
}

module.exports = {
    newBlog,
    editBlog,
    deleteBlog,
    postComment,
    deleteComment
};