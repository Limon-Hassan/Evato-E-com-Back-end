let express = require('express');
const {
  checkout,
  ReadCheckout,
  AdminReadCheckout,
  updateCheckout,
  AdminDecision,
} = require('../../AllController/checkOutController');
const { ErrorCheck } = require('../../Halper/ErrorCheck');
const authMidleware = require('../../Midleware/authMidleware');
const AdminMidleware = require('../../Midleware/AdminMidleware');
let router = express.Router();

router.post('/MakeCheckout/:id', ErrorCheck, checkout);
router.get('/getCheckout/:id', ErrorCheck, ReadCheckout);
router.get('/adminCheckout/:id', ErrorCheck, AdminReadCheckout);
router.patch('/updateCheckout/:id', ErrorCheck, authMidleware, updateCheckout);
router.patch('/AdminDecision/:id', ErrorCheck, AdminMidleware, AdminDecision);

module.exports = router;
