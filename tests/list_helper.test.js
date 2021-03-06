const listHelper = require('../utils/list_helper')

describe('List Helper Tests', () => {
    test('dummy returns one', () => {
        const blog = []
        const result = listHelper.dummy(blog)
        expect(result).toBe(1)
    })
    
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
        const result = listHelper.sumOfPosts(listWithOneBlog)
        expect(result).toBe(5)
    })
})
