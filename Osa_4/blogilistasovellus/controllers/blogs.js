const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blogs')
const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog
      .find({}).populate('user', {username: 1, name: 1})
    response.json(blogs)
  })

  blogRouter.put('/:id', async (request, response) => {
    const body = request.body
  
    const updateBlog = await Blog.findByIdAndUpdate(request.params.id, {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }, { new: true });
    response.json(updateBlog)
  })
  
blogRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!request.body.title || !request.body.url) {
    return response.status(400).end()
  }

   const blog = new Blog({
    ...request.body,
    likes: body.likes || 0,
    user: user._id
  })
  
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)

  await user.save()
  response.status(201).json(savedBlog)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end
  }
})

blogRouter.delete('/:id', userExtractor,async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  const user = request.user

  
  if (!blog) {
    return response.status(401).json({ error: 'no blog found'})
  }

  if (blog.user.toString() !== user.id) {
    return response.status(403).json({ error: 'not authorized to delete this blog' });
  } 

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()

})


module.exports = blogRouter