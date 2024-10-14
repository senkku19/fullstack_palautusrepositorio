const router = require('express').Router()
const User = require('../models/users')
const Blog = require('../models/blogs')

router.post('/reset', async (request, response) => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    response.status(204).end()
})

module.exports = router