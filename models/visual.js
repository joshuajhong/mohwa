const mongoose = require('mongoose')
const visualImageBasePath = '/uploads'
const path = require('path')

const visualSchema = new mongoose.Schema({
    name: {type:String, required:true},
    imageName: String,
    description: String,
    keywords: String,
});

visualSchema.virtual('visualImagePath').get(function() {
    if (this.imageName != null) {
      return path.join('/', visualImageBasePath, this.imageName)
    }
})

module.exports = mongoose.model('Visuals', visualSchema)

module.exports.visualImageBasePath = visualImageBasePath


