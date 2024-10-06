const { test, after, beforeEach, describe } = require('node:test')
const Blog = require('../models/blogs')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert')
const app = require('../app')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/users')


const api = supertest(app)


beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
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

describe('test endpoint when a blog is added', async () => {
    let headers
    beforeEach(async () => {
        await User.deleteMany()
        await User.insertMany([])
        await helper.addloginUser()

        const loggedUser = await api.post('/api/login').send(helper.newUser)
        headers = {
            Authorization: `Bearer ${loggedUser.body.token}`,
        }
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
            .set(headers)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
        assert.strictEqual[helper.initialBlogs.length + 1, response.length]
        const result = response.body[helper.initialBlogs.length]
        
        const { id, user, ...blogWithoutId } = result;
        
        assert.deepStrictEqual(blogWithoutId, newBlog);
    })

    test('adding a blog unauthorized fails', async () => {
        const newBlog = {
            title: 'Test',
            author: 'Test',
            url: 'testing how it works',
            likes: 0
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
    
        const response = await api.get('/api/blogs')
        assert.strictEqual[helper.initialBlogs.length, response.length]
    })
    
    test('if not given likes sets it as 0 by default', async () => {
        const newBlog = {
            title: 'Test',
            author: 'Test',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        }
    
        await api
        .post('/api/blogs')
        .set(headers)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
        const result = response.body[helper.initialBlogs.length]
    
        assert.strictEqual(result.likes, 0)
    })
    
    test('if not given title throws error', async () => {
        const blogsAtStart = await helper.blogsInDB()
        const newBlog = {
            author: 'Test',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
        }
    
        await api
            .post('/api/blogs')
            .set(headers)
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDB()
    
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })
    
    test('if not given url throws error', async () => {
        const blogsAtStart = await helper.blogsInDB()
        const newBlog = {
            title: 'Title',
            author: 'Test'
        }
    
        await api
            .post('/api/blogs')
            .set(headers)
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDB()
    
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })

    test('deletion of a blog', async () => {
        const newBlog = {
            title: 'Test',
            author: 'Test',
            url: 'testing how it works',
            likes: 0
        }
    
        await api
            .post('/api/blogs')
            .set(headers)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtStart = await helper.blogsInDB()
        const blogToDelete = blogsAtStart[blogsAtStart.length - 1]
    
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set(headers)
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
            .set(headers)
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
})


describe('when there is initially one user at db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash})

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDB()

        const newUser = {
            username: 'test',
            name: 'Teppo testi',
            password: 'salasana'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDB()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails because the username is already taken', async () => {
        const usersAtStart = await helper.usersInDB()

        const newUser = {
            username: 'root',
            name: 'Teppo testi',
            password: 'salasana'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDB()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails because the password is too short', async () => {
        const usersAtStart = await helper.usersInDB()

        const newUser = {
            username: 'Teppot',
            name: 'Teppo testi',
            password: 's1'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDB()
        assert(result.body.error.includes('password must be atleast 3 charachters long'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})


after(async () => {
    await mongoose.connection.close()
})