const bcrypt = require('bcrypt')
const User = require('../models/user')
const usersRouter = require('express').Router()

usersRouter.post('/', async (request, response) => {
    const body = request.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const newUser = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })
    
    const savedUser = await newUser.save()
    response.status(200).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

module.exports = usersRouter