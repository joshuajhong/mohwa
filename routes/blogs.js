const express = require('express')
const Blog = require('./../models/blog')
const router = express.Router()
const path = require('path')
const { checkAuthenticated, checkNotAuthenticated } = require('../config/auth');

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

router.get('/new', checkAuthenticated, (req, res) => {
    res.render('blog/new', { blog: new Blog() })
})

router.get('/edit/:slug', checkAuthenticated, async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug })
    res.render('blog/edit', { blog: blog })
})

router.get('/:slug', async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug }) 
    if (blog == null) res.redirect('/')
    if (req.user) {
        res.render('blog/show', { 
            blog: blog,
            hide1: ``,
            hide2: ``
        })
    } else {
        res.render('blog/show', { 
            blog: blog,
            hide1:`<!--`,
            hide2: `-->`
        })
    }
})

router.post('/', upload.single('cover'), async (req, res, next) => {
    console.log(req.file) //delete later
    req.blog = new Blog()
    next()
}, saveArticleAndRedirect('new')) 

/*router.put('/:slug', async (req, res, next) => {
    req.blog = await Blog.findOne({ slug: req.params.slug })
    next()
}, saveArticleAndRedirect('edit')) */
// multer does not support PUT requests

router.post('/:slug', upload.single('cover'), async (req, res, next) => {
    req.blog = await Blog.findOne({ slug: req.params.slug })
    next()
}, saveArticleAndRedirect('edit')) 

router.delete('/:slug', checkAuthenticated, async (req, res) => {
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

module.exports = router