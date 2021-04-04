const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

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

test.only('a blog is added successfully', async () => {
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

afterAll(() => {
    mongoose.connection.close()
})