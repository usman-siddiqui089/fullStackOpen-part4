const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
require('dotenv').config()

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

blogSchema.set('toJSON', {
    transform: (document, requiredDocument) => {
        requiredDocument.id = requiredDocument._id.toString()
        delete requiredDocument._id
        delete requiredDocument.__v
    }
})

const Blog = mongoose.model('Blog', blogSchema)
const password = process.env.password
const mongoUrl = `mongodb+srv://fullstackopen:${password}@cluster0.2dcnc.mongodb.net/blogList?retryWrites=true&w=majority`
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
        console.log('Success! Connected to DB')
    })
    .catch(error => {
        console.error('DB Connection Error:',error.message)
    })

app.use(cors())
app.use(express.json())
morgan.token('body', (req,res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})