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

test.only('blog contains valid id', async () => {
    const response = await api.get('/api/blogs').expect(200)
    const result = response.body.map(blog => {
        expect(blog.id).toBeDefined()
    })
})

afterAll(() => {
    mongoose.connection.close()
})