const bcrypt = require('bcrypt')
const User = require('../models/user')
const usersRouter = require('express').Router()

usersRouter.post('/', async (request, response) => {
    const body = request.body
    const saltRounds = 10
    if(body.password.length >= 3){
        const passwordHash = await bcrypt.hash(body.password, saltRounds)
        const newUser = new User({
            username: body.username,
            name: body.name,
            passwordHash,
        })
        const savedUser = await newUser.save()
        response.status(200).json(savedUser)      
    }
    else{
        response.status(400).json({ error: 'Password validation error' }).end()
    }
})

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({})
        .populate('blogs', {likes: 0, user: 0})
    response.json(users)
})

module.exports = usersRouter