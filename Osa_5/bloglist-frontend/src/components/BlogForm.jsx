import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <h1>create new</h1>
      <div>
          title: <input
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
      </div>
      <div>
          author: <input
          value={author}
          onChange={event => setAuthor(event.target.value)}
        />
      </div>
      <div>
          url: <input
          value={url}
          onChange={event => setUrl(event.target.value)}
        />
      </div>
      <button type='submit'>save</button>
    </form>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm