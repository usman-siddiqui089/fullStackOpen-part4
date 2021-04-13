const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
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
    await Blog.insertMany(initialBlogs)
})

describe('verify existing blogs in db', () => {
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
})

describe.only('verify addition of blogs in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('secretPass', 10)
        const newUser = new User({
            username: 'root',
            name: 'Admin User',
            passwordHash
        })
        await newUser.save()
    })
    test('a blog is added successfully', async () => {
        const user = await User.find({})
        const userForToken = {
            username: user.username,
            id: user._id
        }
        const token = jwt.sign(userForToken, process.env.SECRET)
        
        const blogsBeforePost = await api.get('/api/blogs')
        const newBlog = {
            title : "Another good blog",
            author : "David",
            url : "https://blog.com",
            likes : 90,
            user: user._id
        }
        await api
            .post('/api/blogs')
            .set('Authorization', 'Bearer ' + token)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await api.get('/api/blogs')
        expect(blogsAtEnd.body).toHaveLength(blogsBeforePost.body.length + 1)
    
        const titles = blogsAtEnd.body.map(blog => blog.title)
        expect(titles).toContain('Another good blog')
    })

    // test('blog post without likes', async () => {
    //     const newBlog = {
    //         title : "Blog without likes",
    //         author : "Anonymous",
    //         url : "https://anonymous-blog.com"
    //     }
    //     const response = await api
    //         .post('/api/blogs')
    //         .send(newBlog)
    //         .expect(201)
    //         .expect('Content-Type', /application\/json/)
    //     expect(response.body.likes).toEqual(0)
    // })

    test('blog without token', async () => {
        const newBlog = {
            author : "Anonymous",
        }
        
        const result = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)

        expect(result.body.error).toContain('token missing or invalid')
    })
})

describe('verify deletion of blogs from db', () => {
    test('a valid blog can be deleted', async () => {
        const blogsAtStart = await api.get('/api/blogs')
        const blogID = blogsAtStart.body[0].id
    
        await api
            .delete(`/api/blogs/${blogID}`)
            .expect(204)
    
        const result = await api.get('/api/blogs')
        expect(result.body).toHaveLength(blogsAtStart.body.length - 1)
    })
})

describe('verify modification of blogs in db', () => {
    test('a valid blog can be modified', async () => {
        const blogsAtStart = await api.get('/api/blogs')
        const blogID = blogsAtStart.body[0].id
        const newBlogLikes = {
            likes : 1000
        }
    
        await api
            .put(`/api/blogs/${blogID}`)
            .send(newBlogLikes)
            .expect(200)
    
        const blogsAtEnd = await api.get('/api/blogs')
        const likes = blogsAtEnd.body.map(blog => blog.likes)
        expect(likes).toContain(1000)
    })
})

describe('verify addition of users in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('secretPass', 10)
        const newUser = new User({
            username: 'root',
            name: 'Admin User',
            passwordHash
        })
        await newUser.save()
    })

    test('valid user can be added', async () => {
        const usersAtStart = await api.get('/api/users')
        const newUser = {
            username: 'superUser',
            name: 'Super User',
            password: 'secretSuperKey'
        }

        const savedUser = await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await api.get('/api/users')
        const usernames = usersAtEnd.body.map(user => user.username)

        expect(usersAtEnd.body).toHaveLength(usersAtStart.body.length + 1)
        expect(usernames).toContain('superUser')
    })

    test('invalid user cannot be added', async () => {
        const usersAtStart = await api.get('/api/users')
        const newUser = {
            username: 'root',
            name: 'New User',
            password: 'secretKey'
        }

        const savedUser = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(savedUser.body.error).toContain('`username` to be unique')
        
        const usersAtEnd = await api.get('/api/users')
        expect(usersAtEnd.body).toHaveLength(usersAtStart.body.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})