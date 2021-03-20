const express = require('express')
const router = express.Router()
const Visuals = require('./../models/visual')
const visualsController = require('../config/visuals')

router.get('/', async (req, res) => {
    const visuals = await Visuals.find().sort({
      createdAt: 'desc'
    })
    res.render('visuals/index.ejs', { 
        visual: visuals,
    })
})

router.get('/', visualsController.getAllVisual);
router.post('/', visualsController.uploadImg, visualsController.newVisual)
router.get('/:name', visualsController.getOneVisual);
router.delete('/:name', visualsController.deleteOneVisual);


module.exports = router