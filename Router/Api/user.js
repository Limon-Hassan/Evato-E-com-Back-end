let express = require('express');
let router = express.Router();
const {
  registation,
  login,
  Adminregistation,
  alluser,
  adminUsers,
  otpVerify,
  resntOTP,
} = require('../../AllController/AuthController');
const authMidleware = require('../../Midleware/authMidleware');
const AdminMidleware = require('../../Midleware/AdminMidleware');

router.post('/registation', registation);
router.post('/Adminregistation', Adminregistation);
router.post('/login', login);
router.post('/otp-verify', otpVerify);
router.post('/resent-otp', resntOTP);
router.get('/users', authMidleware, alluser);
router.get('/adminusers', AdminMidleware, adminUsers);

module.exports = router;
