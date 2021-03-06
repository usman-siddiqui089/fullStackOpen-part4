const dummy = (blogs) => {
    return 1
}

const sumOfLikes = (blogPosts) => {
    const sum = blogPosts.reduce((sum, blog) => {
        return sum + blog.likes
    }, 0)

    return sum
}

const favoriteBlog = (blogPosts) => {
    const likes = blogPosts.map(blog => blog.likes)
    const maxLikes = Math.max(...likes)
    const maxLikedBlog = blogPosts.find(blog => blog.likes === maxLikes)

    return {
        title: maxLikedBlog.title,
        author: maxLikedBlog.author,
        likes: maxLikedBlog.likes
    }
}

module.exports = {
    dummy,
    sumOfLikes,
    favoriteBlog
}