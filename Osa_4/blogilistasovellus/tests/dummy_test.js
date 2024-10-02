const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const listWithManyBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Computer Science',
      author: 'Charlotte M.',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 20,
      __v: 0
    },
    {
      _id: '5a4444aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a8888aa71b54a676234d17f8',
      title: 'Make up',
      author: 'Charlotte M.',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 3,
      __v: 0
    },
    {
        _id: '5a8888aa71b54a676234d17f8',
        title: 'Make up',
        author: 'Deria L.',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 20,
        __v: 0
      }
  ]

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

describe('total likes', () => {
    test('when list has only one blog equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      assert.strictEqual(result, 5)
    })
  })

  describe('total likes', () => {
    test('when list has many blogs equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithManyBlogs)
      assert.strictEqual(result, 48)
    })
  })

describe('favorite blog', () => {
    test('the most liked blog', () => {
        const result = listHelper.favoriteBlog(listWithManyBlogs)
        assert.strictEqual(result.likes, 20)
    })
})

describe('most blogs', () => {
    test('author with most blogs', () => {
        const result = listHelper.mostBlogs(listWithManyBlogs)
        assert.deepStrictEqual(result, {
            author: 'Charlotte M.',
            blogs: 2
        })
    })
})

describe('most likes', () => {
    test('author with most likes all together', () => {
        const result = listHelper.mostLikes(listWithManyBlogs)
        assert.deepStrictEqual(result, {
            author: 'Charlotte M.',
            likes: 23
        })
    })
})