let express = require('express');
const {
  createPayment,
  capturePayment,
} = require('../../AllController/paymentController');
const { ErrorCheck } = require('../../Halper/ErrorCheck');
let router = express.Router();

router.post('/payment', ErrorCheck, createPayment);
router.post('/capture', ErrorCheck, capturePayment);

module.exports = router;
