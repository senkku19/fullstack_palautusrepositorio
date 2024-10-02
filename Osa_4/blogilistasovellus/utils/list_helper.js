const dummy = (blogs) => {
    return 1;
}

const totalLikes = blogs => {
    const reducer = (sum, items) => {
        for (const blog of items) {
            sum = sum + blog.likes
        }
        return sum
    }

    return blogs.length === 0 
    ? 0
    : reducer(0, blogs)
}

const favoriteBlog = blogs => {
    let favoriteBlog = undefined
    let mostLikes = 0

    for (blog of blogs) {
        if (blog.likes > mostLikes) {
            favoriteBlog = blog
        }
    }

    return {
        title: favoriteBlog.title,
        author: favoriteBlog.author,
        likes: favoriteBlog.likes
    }
}

const mostBlogs = blogs => {
    let checkedAuthors = []
    let mostBlogs = undefined
    let numberOfBlogs = 0

    for (let blog of blogs) {
        let value = 0

        const hasBeenChecked = checkedAuthors.includes(blog.author)

        if (!hasBeenChecked) {
            for (let blog2 of blogs) {
                if (blog.author === blog2.author) {
                    value += 1
                }
            }

            checkedAuthors.push(blog.author)
        }

        if (value > numberOfBlogs) {
            numberOfBlogs = value
            mostBlogs = {
                author: blog.author,
                blogs: numberOfBlogs
            };
        }
    }

    return mostBlogs
}


const mostLikes = blogs => {
    let checkedAuthors = []
    let mostLikes = undefined
    let numberOfLikes = 0

    for (let blog of blogs) {
        let value = 0

        const hasBeenChecked = checkedAuthors.includes(blog.author)

        if (!hasBeenChecked) {
            for (let blog2 of blogs) {
                if (blog.author === blog2.author) {
                    value += blog2.likes
                }
            }

            checkedAuthors.push(blog.author)
        }

        if (value > numberOfLikes) {
            numberOfLikes = value
            mostLikes = {
                author: blog.author,
                likes: numberOfLikes
            }
        }
    }

    return mostLikes
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}