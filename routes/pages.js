const express = require('express')
const router = express.Router()

router.get('/terms', (req, res) => {
    res.render('docs/terms')
})
  
router.get('/returns', (req, res) => {
    res.render('docs/returns')
})

router.get('/privacy', (req, res) => {
    res.render('docs/privacy')
})

router.get('/sitemap', (req, res) => {
    res.render('docs/sitemap')
})

router.get('/credits', (req, res) => {
    res.render('docs/credits')
})
  
module.exports = router