const express = require('express')
const router = express.Router()
const userController = require('../config/userController.js');
const Blog = require('./../models/blog')
 
// router.put('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateUser);
 
// router.delete('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser);

router.get('/', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), async (req, res) => {
  const blogs = await Blog.find().sort({
    createdAt: 'desc'
  })
  res.render('loginsystem/adminpanel.ejs', { 
        blogs: blogs,
        data: req.user
    })
})

module.exports = router