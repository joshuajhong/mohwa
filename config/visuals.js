const Visuals = require('./../models/visual')
const multer = require('multer')

const path = require('path')
const fs = require('fs') // needed for path.join string error
const uploadPath = path.join('public', Visuals.visualImageBasePath)
const storage = multer.diskStorage({
    destination: uploadPath,
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
})
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const uploadImg = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
}).single('image'); 

const getVisualHomePage = async (req, res) => {
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
}

const getNewVisual = (req, res) => {
    res.render('visuals/new', { visual: new Visuals() })
}

const newVisual = (req, res) => {
    Visuals.findOne({name: req.body.name}, (data) => {
        if (data === null) {
            const fileName = req.file != null ? req.file.filename : null
            const newVisual = new Visuals({
                name: req.body.name,
                imageName: fileName,
                description: req.body.description,
                keywords: req.body.keywords
            })
            newVisual.save((err, data) => {
                if(err) return res.json({Error: err});
                return res.redirect('/visuals')
            })
        } else {
            return res.json({message: "Visual already exists"})
        }
    })
}

const getOneVisual = (req, res) => {
    let name = req.params.name;
    Visuals.findOne({name: name}, (err, data) => {
        if(err || !data) {
            return res.json({message: "Visual doesn't exist"});
        }
        else return res.json(data);
    })
}

const deleteOneVisual = (req, res) => {
    let name = req.params.name;
    Visuals.deleteOne({name: name}, (err, data) => {
        if (err || !data) {
            return res.json({message: "Visual doesn't exist"});
        }
        else return res.redirect('/visuals')
    })
}

const getEditVisual = async (req, res) => {
    let name = req.params.name;
    const visual = await Visuals.findOne({ name: name })
    if (visual == null) {res.redirect('/adminpanel')}
    else return res.render('visuals/edit', { visual: visual })
}

const editOneVisual = async (req, res) => {
    let name = req.params.name;
    req.visual = await Visuals.findOneAndUpdate({ name: name }, { upsert: true }, () => {
        const fileName = req.file != null ? req.file.filename : null
        let visual = req.visual
        visual.name = req.body.name,
        visual.imageName = fileName,
        visual.description = req.body.description,
        visual.keywords = req.body.keywords
        try {
            visual = visual.save()
            res.redirect(`/visuals`)
        } catch (e) {
            res.render(`visuals`)
        }
    })
}

//export controller functions
module.exports = {
    getVisualHomePage,
    getNewVisual,
    uploadImg, 
    newVisual,
    getOneVisual,
    deleteOneVisual,
    getEditVisual,
    editOneVisual
};