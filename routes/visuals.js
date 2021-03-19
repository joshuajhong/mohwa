const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('visuals/index.ejs')
})




module.exports = router