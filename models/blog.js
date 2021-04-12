const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

blogSchema.set('toJSON', {
    transform: (document, requiredDocument) => {
        requiredDocument.id = requiredDocument._id.toString()
        delete requiredDocument._id
        delete requiredDocument.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)