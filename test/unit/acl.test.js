const { app, expect, request } = require('../common')

describe('ACL', function() {
  describe('Category', function() {
    it('should return 200 when listing categories', function() {
      return request
        .get('/api/categories')
        .set('AccessToken', 'mudar1234')
        .expect(200);
    })

    it('should return 401 when creating categories', function() {
      return request
        .post('/api/categories')
        .send({ name: 'My category' })
        .expect(401);
    })

    it('should return 401 when updating categories', function() {
      return request
        .patch('/api/categories/1')
        .send({ name: 'My category' })
        .expect(401);
    })

    it('should return 401 when deleting categories', function() {
      return request
        .delete('/api/categories/1')
        .expect(401);
    })
  })

  describe('Product', function() {
    it('should return 200 when listing products', function() {
      return request
        .get('/api/products')
        .expect(200);
    })

    it('should return 401 when creating products', function() {
      return request
        .post('/api/products')
        .send({ name: 'My product' })
        .expect(401);
    })

    it('should return 401 when updating products', function() {
      return request
        .patch('/api/products/1')
        .send({ name: 'My product' })
        .expect(401);
    })

    it('should return 401 when deleting products', function() {
      return request
        .delete('/api/products/1')
        .expect(401);
    })

    it('should return 200 when buying a product', function() {
      return app.models.Product.create({ name: 'test', price: 100 })
        .then(res => request
          .post(`/api/products/${res.id}/buy`)
          .send({ quantity: 200 })
          .expect(200)
        );
    })
  })
})
