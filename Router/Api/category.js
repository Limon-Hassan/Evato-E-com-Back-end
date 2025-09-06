let express = require('express');
let router = express.Router();
let path = require('path');
const multer = require('multer');
const {
  addCategory,
  ReadCategory,
  UpdateCategory,
  DeleteCategory,
} = require('../../AllController/categoryController');
const { ErrorCheck } = require('../../Halper/ErrorCheck');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueName + path.extname(file.originalname)
    );
  },
});
function fileFilter(req, file, cb) {
  const fileTypes = /jpeg|jpg|png|gif|svg/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed (jpg, png, gif, svg)!'), false);
  }
}
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter,
});
router.post(
  '/createCategory',
  upload.array('image', 12),
  ErrorCheck,
  addCategory
);
router.get('/getCategory', ErrorCheck, ReadCategory);
router.patch(
  '/UpdateCategory/:id',
  upload.array('image', 12),
  ErrorCheck,
  UpdateCategory
);
router.delete('/DeleteCategory/:id', ErrorCheck, DeleteCategory);
module.exports = router;
