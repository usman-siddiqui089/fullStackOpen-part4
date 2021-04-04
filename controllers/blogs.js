const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const newBlog = new Blog({
    title : body.title,
    author : body.author,
    url : body.url,
    likes : body.likes || 0
  })
  const result = await newBlog.save()
  response.status(201).json(result)
})

module.exports = blogsRouter