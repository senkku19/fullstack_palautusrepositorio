const blogRouter = require('express').Router()
const Blog = require('../models/blogs')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
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
  
blogRouter.post('/', (request, response, next) => {
   const blog = new Blog({
    ...request.body,
    likes: request.body.likes || 0
  })
  
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => next(error))
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end
  }
})

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})


module.exports = blogRouter