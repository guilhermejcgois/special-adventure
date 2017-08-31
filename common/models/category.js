'use strict';

module.exports = function(Category) {

  Category.observe('before delete', function(ctx) {
    return Category.app.models.Product
      .count({ categoryId: ctx.where.id})
      .then(res => {
        if (res > 0) {
          return Promise.reject(new Error('Error deleting category with products'))
        }
      })
  })

};
