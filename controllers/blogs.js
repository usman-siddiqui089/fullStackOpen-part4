const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const {userExtractor} = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', {username: 1})
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user
  console.log('USER', user)
  if(body.title === undefined || body.url === undefined){
    response.status(400).end()
  }
  else{
    const newBlog = new Blog({
      title : body.title,
      author : body.author,
      url : body.url,
      likes : body.likes || 0,
      user: user._id
    })
    const savedBlog = await newBlog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if(blog.user.toString() === user._id.toString()){
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }
  else{
    return response.status(400).json({ error: 'Unauthorized User: Delete Operation Failed'})
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const newBlog = {
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, {new: true})
  if(updatedBlog){
    response.json(updatedBlog)
  }
  else{
    response.status(404).end()
  }
})

module.exports = blogsRouter