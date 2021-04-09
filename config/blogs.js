const Blog =  require('./../models/blog')
const path = require('path')

const getBlogHomepage = async (req, res) => {
    const blogs = await Blog.find().sort({
      createdAt: 'desc'
    })
    if (req.user) {
        res.render('blog/index.ejs', { 
            blogs: blogs,
            hide1: ``,
            hide2: `` 
        })
    } else {
        res.render('blog/index.ejs', { 
            blogs: blogs,
            hide1:`<!--`,
            hide2: `-->`   
        })
    }
}

const getNewBlog =  (req, res) => {
    res.render('blog/new', { blog: new Blog() })
}

const getEditBlog =  async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug })
    if (blog == null) {res.redirect('/adminpanel')}
    else {res.render('blog/edit', { blog: blog })}
}

const showBlog = async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug }) 
    if (blog == null) {res.redirect('/blog')}
    else {     
        if (req.user) {
        res.render('blog/show', {
            blog: blog,
            hide1: ``,
            hide2: ``
        })} else {
        res.render('blog/show', { 
            blog: blog,
            hide1: `<!--`,
            hide2: `-->`
        })
    }}
}

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
    getBlogHomepage,
    getNewBlog,
    getEditBlog,
    showBlog,
    newBlog,
    editBlog,
    deleteBlog,
    postComment,
    deleteComment
};