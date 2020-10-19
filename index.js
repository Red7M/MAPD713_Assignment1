var SERVER_NAME = 'Products-API (assign01)'
var PORT = 3009;
var HOST = '127.0.0.1';

var countGetRequest = 0
var countPostRequest = 0


var restify = require('restify')

  // Get a persistence engine for the products
  , productsSave = require('save')('products')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('------------------------------------------------------')
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('------------------------------------------------------')
  console.log('Endpoints:')
  console.log('%s method: GET, POST', server.url)
})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

// GET all products in the system
server.get('/products', function (req, res, next) {

  // Find every entity within the given collection
  productsSave.find({}, function (error, products) {
    countGetRequest = countGetRequest + 1
    console.log('> products GET: received request')
    // Return all of the products in the system
    res.send(products)
    console.log('Processed Request Count--> Get:%s, Post:%s', countGetRequest, countPostRequest)
  })
})

// POST a new product
server.post('/products', function (req, res, next) {

  // Make sure product is defined
  if (req.params.product === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('product must be supplied'))
  }
  // Make sure price is defined
  if (req.params.price === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('price must be supplied'))
  }
  // Make sure category is defined
  if (req.params.category === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('category must be supplied'))
  }
  var newProduct = {
		product: req.params.product, 
    price: req.params.price,
    category: req.params.category
	}

  console.log('< products GET: sending response')
  // Create the product using the persistence engine
  productsSave.create( newProduct, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    countPostRequest = countPostRequest + 1 
    // Send the product if no issues
    res.send(201, product)
    console.log('Processed Request Count--> Get:%s, Post:%s', countGetRequest, countPostRequest)
  })
})

// DELETE product with the given id
server.del('/products/:id', function (req, res, next) {

  // Delete the product with the persistence engine
  productsSave.delete(req.params.id, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send()
    console.log('> products DELETE: product at id %s deleted', req.params.id)
  })
})


