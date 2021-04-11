const express = require('express')
const router = express.Router()
const visualsController = require('../config/visuals')
const { checkAuthenticated } = require('../config/auth');
const userController = require('../config/userController.js');

router.get('/', visualsController.getVisualHomePage)
router.get('/new', checkAuthenticated, userController.grantAccess('readAny', 'profile'), visualsController.getNewVisual)
router.post('/', visualsController.uploadImg, visualsController.newVisual)
router.get('/:name', visualsController.getOneVisual);
router.delete('/:name', visualsController.deleteOneVisual);
router.get('/edit/:name', checkAuthenticated, userController.grantAccess('readAny', 'profile'), visualsController.getEditVisual)
router.post('/edit/:name', visualsController.uploadImg, visualsController.editOneVisual, visualsController.saveVisualAndRedirect)

module.exports = router