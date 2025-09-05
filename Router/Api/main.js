let express = require('express');
let router = express.Router();
let user = require('./user');
let product = require('./product');
let category = require('./category');
let Cart = require('./cart');
let checkout = require('./Checkout');
let notification = require('./notification');
let peyment = require('./payment');

router.use('/user', user);
router.use('/product', product);
router.use('/category', category);
router.use('/Cart', Cart);
router.use('/checkout', checkout);
router.use('/notification', notification);
router.use('/payments', peyment);

module.exports = router;
