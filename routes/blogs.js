const express = require('express')
const blogController = require('../config/blogs')
const router = express.Router()
const path = require('path')
const { checkAuthenticated, checkNotAuthenticated } = require('../config/auth');
const userController = require('../config/userController.js');

router.get('/', blogController.getBlogHomepage)
router.get('/new', checkAuthenticated, userController.grantAccess('readAny', 'profile'), blogController.getNewBlog)
router.get('/edit/:slug', checkAuthenticated, userController.grantAccess('readAny', 'profile'), blogController.getEditBlog)
router.get('/:slug', blogController.showBlog)
router.post('/', blogController.uploadImg, blogController.newBlog, saveArticleAndRedirect('new')) 
router.post('/edit/:slug', blogController.uploadImg, blogController.editBlog, saveArticleAndRedirect('show'))
router.delete('/delete/:slug', checkAuthenticated, blogController.deleteBlog) 
router.route('/comment/:slug').post(blogController.postComment);
router.route('/:slug/:commentsId').delete(checkAuthenticated, userController.grantAccess('readAny', 'profile'), blogController.deleteComment)

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