const dummy = (blogs) => {
    return 1
}

const sumOfPosts = (blogPosts) => {
    const sum = blogPosts.reduce((sum, blog) => {
        return sum + blog.likes
    }, 0)

    return sum
}

module.exports = {
    dummy,
    sumOfPosts
}