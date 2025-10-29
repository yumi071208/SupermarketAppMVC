const db = require('../db');

const Product = {
  getAll: function(callback) {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
  },

  getById: function(id, callback) {
    const sql = 'SELECT * FROM products WHERE id = ?';
    db.query(sql, [id], (err, results) => {
      if (err) return callback(err);
      return callback(null, results[0]);
    });
  },

  add: function(product, callback) {
    const sql = 'INSERT INTO products (productName, quantity, price, image) VALUES (?, ?, ?, ?)';
    const params = [product.productName, product.quantity, product.price, product.image];
    db.query(sql, params, (err, result) => {
      if (err) return callback(err);
      return callback(null, { insertId: result.insertId });
    });
  },

  update: function(id, product, callback) {
    const sql = 'UPDATE products SET productName = ?, quantity = ?, price = ?, image = ? WHERE id = ?';
    const params = [product.productName, product.quantity, product.price, product.image, id];
    db.query(sql, params, (err, result) => {
      if (err) return callback(err);
      return callback(null, { affectedRows: result.affectedRows });
    });
  },

  delete: function(id, callback) {
    const sql = 'DELETE FROM products WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) return callback(err);
      return callback(null, { affectedRows: result.affectedRows });
    });
  }
};

module.exports = Product;