const Blog = require('../models/blogs')
const User = require('../models/users')
const bcrypt = require('bcrypt')

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

const blogsInDB = async () => {
    const blogs = await Blog.find({})
    return blogs.map((blog) => blog.toJSON())
}

const usersInDB = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const newUser = {
    "username": "maijam",
    "password": "salasana"
}


const addloginUser = async () => {
    const passwordHash = await bcrypt.hash(newUser.password, 10)
    const user = new User({ username: newUser.username, passwordHash })

    await user.save()
}


module.exports = {
    blogsInDB,
    usersInDB,
    initialBlogs, 
    addloginUser,
    newUser
}