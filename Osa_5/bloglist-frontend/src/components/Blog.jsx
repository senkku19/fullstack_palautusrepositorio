import { useEffect, useState } from 'react'

const Blog = ({ blog, user, handleLikes, handleDelete }) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return(
    <div style={blogStyle}>
      <div className='title'>
        {blog.title}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      <div style={showWhenVisible}>
        <div className='url'>
          {blog.url}
        </div>
        <div className='likes'>
          likes {blog.likes} 
          <button onClick={() => handleLikes(blog)}>like</button>
        </div>
        <div className='author'>
          {blog.author}
        </div>
        {(user.username === blog.user.username || user.id === blog.user.id) && (
            <button onClick={() => handleDelete(blog)}>remove</button>
        )}
      </div>
    </div>
  )}

export default Blog