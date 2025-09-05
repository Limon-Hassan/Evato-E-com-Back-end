let express = require('express');
const {
  CreateCart,
  readcart,
  CartSummery,
  IncreamentCart,
  DeleteCart,
} = require('../../AllController/CartController');
const { ErrorCheck } = require('../../Halper/ErrorCheck');
let router = express.Router();

router.post('/createCart', ErrorCheck, CreateCart);
router.get('/readCart/:id', ErrorCheck, readcart);
router.get('/CartSummery/:id', ErrorCheck, CartSummery);
router.put('/Increament/:id', ErrorCheck, IncreamentCart);
router.delete('/DeleteCart/:id', ErrorCheck, DeleteCart);

module.exports = router;
