import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [colorOfNotification, setColorOfNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const blogsFormRef = useRef()
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setColorOfNotification(2)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogOut = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogAppUser')
  }

  const addBlog = (blogObject) => {
    blogsFormRef.current.toggleVisibility()

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setErrorMessage(`a new blog ${blogObject.title} by ${blogObject.author} has been added`)
        setColorOfNotification(1)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }).catch(error => {
        setColorOfNotification(2)
        setErrorMessage(error.message)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const handleLikes = (blog) => {
    const newLikes = blog.likes + 1
    const updatedBlog = { ...blog, likes: newLikes }
    blogService
      .update(updatedBlog.id, updatedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog))
      })
  }

  const handleDelete = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      blogService
        .deleteBlog(blog.id)
        .then(() => {
          setBlogs(blogs.filter(blog2 => blog2.id !== blog.id))
          setColorOfNotification(2)
          setErrorMessage(`${blog.title} was deleted.`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })

    }
  }

  const loginForm = () => {
    return(
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <Notification message={errorMessage} color={colorOfNotification}/>
        <div>
      username
          <input
            type="text"
            value={username}
            name="username"
            onChange={( { target } ) => setUsername(target.value)}
          />
        </div>
        <div>
      password
          <input
            type="password"
            value={password}
            name="password"
            onChange={( { target } ) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    )
  }

  const blogList = () => {
    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
    console.log(sortedBlogs)
    return(
      <>
        {sortedBlogs.map(blog =>
          <Blog key={blog.id} blog={blog} user={user} handleLikes={handleLikes} handleDelete={handleDelete} />
        )}
      </>
    )
  }

  return (
    <div>
      {!user && loginForm()}
      {user && <div>
        <h2>blogs</h2>
        <Notification message={errorMessage} color={colorOfNotification}/>
        <div>
          <p>
            {user.name} logged in
            <button onClick={handleLogOut}>log out</button>
          </p>
        </div>
        <Togglable buttonLabel='new blog' ref={blogsFormRef}>
          <BlogForm
            createBlog = {addBlog}
          />
        </Togglable>
        {blogList()}
      </div>
      }
    </div>
  )
}

export default App