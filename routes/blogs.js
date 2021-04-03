const express = require('express')
const Blog = require('./../models/blog')
const router = express.Router()
const path = require('path')
const { checkAuthenticated, checkNotAuthenticated } = require('../config/auth');
const userController = require('../config/userController.js');

const fs = require('fs') // needed for path.join string error
const multer = require('multer')
const uploadPath = path.join('public', Blog.coverImageBasePath)
const storage = multer.diskStorage({
    destination: uploadPath,
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
})
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

router.get('/', async (req, res) => {
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
  })

router.get('/new', checkAuthenticated, userController.grantAccess('readAny', 'profile'), (req, res) => {
    res.render('blog/new', { blog: new Blog() })
})

router.get('/edit/:slug', checkAuthenticated, userController.grantAccess('readAny', 'profile'), async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug })
    res.render('blog/edit', { blog: blog })
})

router.get('/:slug', async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug }) 
    if (blog == null) res.redirect('/blog')
    res.render('blog/show', { 
        blog: blog,
        hide1: ``,
        hide2: ``
    })
})

router.post('/', upload.single('cover'), async (req, res, next) => {
    req.blog = new Blog()
    next()
}, saveArticleAndRedirect('new')) 

router.post('/edit/:slug', upload.single('cover'), async (req, res, next) => {
    req.blog = await Blog.findOneAndUpdate({ slug: req.params.slug })
    next()
}, saveArticleAndRedirect('show')) // saveArticleAndRedirect('edit'))

router.delete('/delete/:slug', checkAuthenticated, async (req, res) => {
    await Blog.findOneAndDelete({ slug: req.params.slug })
    res.redirect('/blog')
}) 

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        const fileName = req.file != null ? req.file.filename : null
        let blog = req.blog
        blog.title = req.body.title
        blog.author = req.body.author
        blog.description = req.body.description
        blog.markdown = req.body.markdown
        blog.coverImageName = fileName
        try {
            blog = await blog.save()
            res.redirect(`/blog/${blog.slug}`)
        } catch (e) {
            res.render(`blog/${path}`, { blog: blog })
        }
    }
}

router.route('/comment/:slug').post(function(req, res) {
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
});

router.route('/:slug/:commentsId').delete(checkAuthenticated, userController.grantAccess('readAny', 'profile'), function(req, res) {
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
})

module.exports = router