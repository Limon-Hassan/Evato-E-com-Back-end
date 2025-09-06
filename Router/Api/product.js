let express = require('express');
let path = require('path');
const multer = require('multer');
const {
  Createproducts,
  readProduct,
  updateProducts,
  DeleteProduct,
} = require('../../AllController/productController');
const { ErrorCheck } = require('../../Halper/ErrorCheck');
const { searchProducts } = require('../../AllController/searchController');
const {
  makeReviews,
  getReviews,
} = require('../../AllController/reviewController');
let router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './productPhoto');
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
const productPhoto = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter,
});

router.post(
  '/Createproduct',
  productPhoto.array('photo', 12),
  ErrorCheck,
  Createproducts
);
router.post('/CreateReviews', ErrorCheck, makeReviews);
router.get('/getReviews', ErrorCheck, getReviews);
router.get('/product/search', ErrorCheck, searchProducts);
router.get('/GetProducts', ErrorCheck, readProduct);
router.patch(
  '/updateProduct/:id',
  productPhoto.array('photo', 12),
  ErrorCheck,
  updateProducts
);
router.delete('/Deleteproduct/:id', ErrorCheck, DeleteProduct);
module.exports = router;
