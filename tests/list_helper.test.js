const listHelper = require('../utils/list_helper')

describe('List Helper Tests', () => {
    test('dummy returns one', () => {
        const blog = []
        const result = listHelper.dummy(blog)
        expect(result).toBe(1)
    })
})

describe('total likes', () => {
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

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.sumOfLikes(listWithOneBlog)
        expect(result).toBe(5)
    })
})

describe('max liked blog', () => {
    const blogLists = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Blog1',
            author: 'John',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Blog2',
            author: 'James',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 10,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Blog3',
            author: 'David',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 50,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Blog4',
            author: 'Max',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 50,
            __v: 0
        }
    ]

    const maxLikedBlog = {
        title: 'Blog3',
        author: 'David',
        likes: 50,
    }

    test('find max blog from list', () => {
        const result = listHelper.favoriteBlog(blogLists)
        expect(result).toEqual(maxLikedBlog)
    })
})

describe('max blogs of author', () => {
    const blogs = [
        {
            author: 'James',
            blogs: 5
        },
        {
            author: 'Jarvis',
            blogs: 10
        },
        {
            author: 'David',
            blogs: 11
        }
    ]
    
    const expectedResult = {
        author: 'David',
        blogs: 11
    }

    test('most blogs for an author', () => {
        const result = listHelper.mostBlogs(blogs)
        expect(result).toEqual(expectedResult)
    })
})

describe('most likes on blogs of author', () => {
    const blogs = [
        {
            author: 'James',
            blogs: 5,
            likes: 10
        },
        {
            author: 'Jarvis',
            blogs: 10,
            likes: 55
        },
        {
            author: 'David',
            blogs: 11,
            likes: 1
        }
    ]
    
    const expectedResult = {
        author: 'Jarvis',
        likes: 55
    }

    test('most likes on blogs for an author', () => {
        const result = listHelper.mostLikes(blogs)
        expect(result).toEqual(expectedResult)
    })
})
