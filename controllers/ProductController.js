const Product = require('../models/Product');

const ProductController = {
  showInventory: function(req, res) {
    Product.getAll((err, products) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error fetching products');
      }
      res.render('inventory', { products: products, user: req.session.user });
    });
  },

  showShopping: function(req, res) {
    Product.getAll((err, products) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error fetching products');
      }
      res.render('shopping', { user: req.session.user, products: products });
    });
  },

  showProduct: function(req, res) {
    const productId = req.params.id;
    Product.getById(productId, (err, product) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error fetching product');
      }
      if (!product) {
        return res.status(404).send('Product not found');
      }
      res.render('product', { product: product, user: req.session.user });
    });
  },

  showAddProduct: function(req, res) {
    res.render('addProduct', { user: req.session.user });
  },

  addProduct: function(req, res) {
    const product = {
      productName: req.body.name,
      quantity: req.body.quantity,
      price: req.body.price,
      image: req.file ? req.file.filename : null
    };

    Product.add(product, (err, result) => {
      if (err) {
        console.error("Error adding product:", err);
        return res.status(500).send('Error adding product');
      }
      res.redirect('/inventory');
    });
  },

  showUpdateProduct: function(req, res) {
    const productId = req.params.id;
    Product.getById(productId, (err, product) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error fetching product');
      }
      if (!product) {
        return res.status(404).send('Product not found');
      }
      res.render('updateProduct', { product: product });
    });
  },

  updateProduct: function(req, res) {
    const productId = req.params.id;
    const product = {
      productName: req.body.name,
      quantity: req.body.quantity,
      price: req.body.price,
      image: req.file ? req.file.filename : req.body.currentImage
    };

    Product.update(productId, product, (err, result) => {
      if (err) {
        console.error("Error updating product:", err);
        return res.status(500).send('Error updating product');
      }
      res.redirect('/inventory');
    });
  },

  deleteProduct: function(req, res) {
    const productId = req.params.id;
    Product.delete(productId, (err, result) => {
      if (err) {
        console.error("Error deleting product:", err);
        return res.status(500).send('Error deleting product');
      }
      res.redirect('/inventory');
    });
  },

  addToCart: function(req, res) {
    const productId = parseInt(req.params.id);
    const quantity = parseInt(req.body.quantity) || 1;

    Product.getById(productId, (err, product) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error fetching product');
      }

      if (product) {
        if (!req.session.cart) {
          req.session.cart = [];
        }

        const existingItem = req.session.cart.find(item => item.id === productId);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          req.session.cart.push({
            id: product.id,
            productName: product.productName,
            price: product.price,
            quantity: quantity,
            image: product.image
          });
        }

        res.redirect('/cart');
      } else {
        res.status(404).send("Product not found");
      }
    });
  },

  showCart: function(req, res) {
    const cart = req.session.cart || [];
    res.render('cart', { cart, user: req.session.user });
  }
};

module.exports = ProductController;