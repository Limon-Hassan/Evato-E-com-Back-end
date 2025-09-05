const express = require('express');
const { ErrorCheck } = require('../../Halper/ErrorCheck');
const {
  createNotify,
  getNotify,
  ReadNotify,
} = require('../../AllController/NotificationController');
let router = express.Router();

router.post('/CreateNotify', ErrorCheck, createNotify);
router.get('/:userId', ErrorCheck, getNotify);
router.post('/:id/read', ErrorCheck, ReadNotify);

module.exports = router;
