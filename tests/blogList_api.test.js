const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)
const initialBlogs = [
    {
        title : "New Blog 1",
        author : "Austin",
        url : "https://newblog.com",
        likes : 100
    },
    {
        title : "Latest Blog",
        author : "Jeff",
        url : "https://jeffblogs.com",
        likes : 10
    }
]
beforeEach(async () => {
    await Blog.deleteMany({})
    const blogsArr = initialBlogs
        .map(blog => new Blog(blog))
    const promiseArr = blogsArr.map(blog => blog.save())
    await Promise.all(promiseArr)
})

test('returns correct amount of blogs', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(2)
})

test('blog contains valid id', async () => {
    const response = await api.get('/api/blogs').expect(200)
    const result = response.body.map(blog => {
        expect(blog.id).toBeDefined()
    })
})

test('a blog is added successfully', async () => {
    const blogsBeforePost = await api.get('/api/blogs')
    const newBlog = {
        title : "Another good blog",
        author : "David",
        url : "https://blog.com",
        likes : 90
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(blogsBeforePost.body.length + 1)

    const titles = blogsAtEnd.body.map(blog => blog.title)
    expect(titles).toContain('Another good blog')
})

test('blog post without likes', async () => {
    const newBlog = {
        title : "Blog without likes",
        author : "Anonymous",
        url : "https://anonymous-blog.com"
    }
    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    expect(response.body.likes).toEqual(0)
})

test.only('blog without url and title', async () => {
    const newBlog = {
        author : "Anonymous",
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

afterAll(() => {
    mongoose.connection.close()
})