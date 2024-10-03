const { test, after, beforeEach } = require('node:test')
const Blog = require('../models/blogs')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert')
const app = require('../app')
const blogs = require('../models/blogs')
const helper = require('./test_helper')


const api = supertest(app)

const initialBlogs = [
    {
        title: 'Computer Science',
        author: 'Charlotte M.',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 20
      },
      {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
      },
      {
        title: 'Make up',
        author: 'Charlotte M.',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 3,
      },
      {
          title: 'Make up',
          author: 'Deria L.',
          url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
          likes: 20,
        }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let count = 0
    for (let blog of initialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('blogs identity property is named id', async () => {
    const response = await api.get('/api/blogs')
    
    const blog = await response.body

    assert.ok(blog[0].id, 'Expected blog to have an id property');
})

test('a new blog can be added', async () => {
    const newBlog = {
        title: 'Test',
        author: 'Test',
        url: 'testing how it works',
        likes: 0
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const result = response.body[initialBlogs.length]

    const { id, ...blogWithoutId } = result;

    assert.deepStrictEqual(blogWithoutId, newBlog);
})

test('if not given likes sets it as 0 by default', async () => {
    const newBlog = {
        title: 'Test',
        author: 'Test',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    }

    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const result = response.body[initialBlogs.length]

    assert.strictEqual(result.likes, 0)
})

test('if not given title or url throws error', async () => {
    const newBlog = {
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    }

    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('deletion of a blog', async () => {
    const blogsAtStart = await helper.blogsInDB()
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDB()

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    const id = blogsAtEnd.map(r => r.id)
    assert(!id.includes(blogToDelete.id));
})

test('updating a blog', async () => {
    const blogsAtStart = await helper.blogsInDB()
    const blogToUpdate = blogsAtStart[0]

    const blog = {
        title: 'Update example',
        author: 'Update',
        url: 'www.update_example.com',
        likes: 6
    }

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)

    const blogUpdated = blogsAtEnd[0]

    assert.strictEqual(blogToUpdate.id, blogUpdated.id)

    const { id, ...updatedBlogWithoutId } = blogUpdated

    assert.deepStrictEqual(updatedBlogWithoutId, blog)
})


after(async () => {
    await mongoose.connection.close()
})