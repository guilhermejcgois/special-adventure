const { app, expect } = require('../common')

// Get a reference to the Product model
const Product = app.models.Product

describe('It should resolve', function() {
  it('a Product.find', function() {
    return Product
      .find()
      .then(res => console.log(res))
  })
})

describe('Custom methods', function() {
  it('should allow buying a product', function() {
    const product = new Product({ name: 'buy-product', price: 299 })
    return product.buy(10, function(err, res) {
      expect(res.status).to.contain('You bought 10 product(s)')
    })
  })

  it('should not allow buying a negative product quantity', function() {
    const product = new Product({ name: 'buy-product', price: 299 })
    return product.buy(-10, function(err, res) {
      expect(err).to.contain('Invalid quantity -10')
    })
  })
})

describe('validation', function () {
  it('should reject a name < 3 chars', function () {
    return Product.create({ name: 'a', price: 299 })
      .then(res => Promise.reject('Product should not be created'))
      .catch(err => {
        expect(err.message).to.contain('Name should be at least 3 characters')
        expect(err.statusCode).to.be.equal(422)
      })
  })

  it('should reject a duplicate name', function() {
    return Promise.resolve()
      .then(() => Product.create({ name: 'abc', price: 299 }))
      .then(() => Product.create({ name: 'abc', price: 299 }))
      .then(res => Promise.reject('Product should not be created'))
      .catch(err => {
        expect(err.message).to.contain('`name` is not unique')
        expect(err.statusCode).to.be.equal(422)
      })
  })

  it('should reject a price < 0', function() {
    return Product.create({ name: 'lowPrice', price: -1 })
      .then(res => Promise.reject('Product should not be created'))
      .catch(err => {
        expect(err.message).to.contain('Price should be a positive integer')
        expect(err.statusCode).to.be.equal(422)
      })
  })

  it('should reject a price below the minimum 99', function() {
    return Product.create({ name: 'lowPrice', price: 98 })
      .then(res => Promise.reject('Product should not be created'))
      .catch(err => {
        expect(err.message).to.contain('Price should be higher than the minimal price in the DB')
        expect(err.statusCode).to.be.equal(422)
      })
  })

  it('should store a correct product', function() {
    return Product.create({ name: 'all good', price: 100 })
      .then(res => {
        expect(res.name).to.be.equal('all good')
        expect(res.price).to.be.equal(100)
      })
  })
})

describe('Hooks', function() {
  it('should not allow adding a product to non-existing category', function() {
    return Product.create({ name: 'new category', price: 100, categoryId: 9999 })
      .then(res => expect(res).to.be.equal(null))
      .catch(err => expect(err.message).to.be.equal('Error adding product to non-existing category'))
  })
})
