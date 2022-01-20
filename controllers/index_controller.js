class IndexController {
  index (_request, response, _next) {
    response.status(200).json({ message: 'Hello world!' })
  }
}

const indexController = new IndexController()
module.exports = indexController
