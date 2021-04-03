const express = require('express')
const router = express.Router()
const Visuals = require('./../models/visual')
const visualsController = require('../config/visuals')
const { checkAuthenticated, checkNotAuthenticated } = require('../config/auth');
const userController = require('../config/userController.js');

router.get('/', async (req, res) => {
    const visuals = await Visuals.find().sort({
      createdAt: 'desc'
    })
    if (req.user) {
        res.render('visuals/index.ejs', { 
            visual: visuals,
            hide1: ``,
            hide2: `` 
        })
      } else {
        res.render('visuals/index.ejs', { 
            visual: visuals,
            hide1:`<!--`,
            hide2: `-->`   
        })
      }
})

router.get('/new', checkAuthenticated, userController.grantAccess('readAny', 'profile'), (req, res) => {
    res.render('visuals/new', { visual: new Visuals() })
})

router.post('/', visualsController.uploadImg, visualsController.newVisual)
router.get('/:name', visualsController.getOneVisual);
router.delete('/:name', visualsController.deleteOneVisual);


module.exports = router