const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', {username: 1})
  response.json(blogs)
})

const getTokenFromReq = (request) => {
  const authorization = request.get('authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer ')){
    return authorization.substring(7)
  }
  return null
}

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const token = getTokenFromReq(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!token || !decodedToken.id){
    return response.status(401).json({ error: 'Token missing or invalid'})
  }
  const user = await User.findById(decodedToken.id)
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

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
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