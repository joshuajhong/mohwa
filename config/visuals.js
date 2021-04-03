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

//export controller functions
module.exports = {
    uploadImg, 
    newVisual,
    getOneVisual,
    deleteOneVisual
};