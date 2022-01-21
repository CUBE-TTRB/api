class BaseController {
  headers (_request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    response.setHeader('Access-Control-Allow-Methods', '*')
    next()
  }
}

const baseController = new BaseController()
export default baseController
