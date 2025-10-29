const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();

// Import controllers and middleware
const UserController = require('./controllers/UserController');
const ProductController = require('./controllers/ProductController');
const { checkAuthenticated, checkAdmin, validateRegistration } = require('./middleware/auth');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Set up view engine
app.set('view engine', 'ejs');

// Enable static files
app.use(express.static('public'));

// Enable form processing
app.use(express.urlencoded({ extended: false }));

// Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}));

app.use(flash());

// Routes
app.get('/', (req, res) => {
    res.render('index', { user: req.session.user });
});

// User routes
app.get('/register', UserController.showRegister);
app.post('/register', validateRegistration, UserController.register);
app.get('/login', UserController.showLogin);
app.post('/login', UserController.login);
app.get('/logout', UserController.logout);

// Product routes
app.get('/inventory', checkAuthenticated, checkAdmin, ProductController.showInventory);
app.get('/shopping', checkAuthenticated, ProductController.showShopping);
app.get('/product/:id', checkAuthenticated, ProductController.showProduct);
app.get('/addProduct', checkAuthenticated, checkAdmin, ProductController.showAddProduct);
app.post('/addProduct', checkAuthenticated, checkAdmin, upload.single('image'), ProductController.addProduct);
app.get('/updateProduct/:id', checkAuthenticated, checkAdmin, ProductController.showUpdateProduct);
app.post('/updateProduct/:id', checkAuthenticated, checkAdmin, upload.single('image'), ProductController.updateProduct);
app.get('/deleteProduct/:id', checkAuthenticated, checkAdmin, ProductController.deleteProduct);

// Cart routes
app.post('/add-to-cart/:id', checkAuthenticated, ProductController.addToCart);
app.get('/cart', checkAuthenticated, ProductController.showCart);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));