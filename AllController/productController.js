const categorySchema = require('../Model/categorySchema');
const productScema = require('../Model/productScema');
let path = require('path');
let fs = require('fs');
let { getIO } = require('../socket');

async function Createproducts(req, res, next) {
  let { name, discription, price, category, stock } = req.body;
  if (!name || !discription || !price) {
    return res.status(400).send({ msg: 'please Enter all the fields !' });
  }
  try {
    let photo = req.files;
    let Photos = [];
    photo.forEach(element => {
      Photos.push(process.env.Host_Name + '/' + element.filename);
    });
    let product = new productScema({
      name,
      discription,
      category,
      photo: Photos,
      price,
      stock,
    });
    await product.save();
    if (category && category.length > 0) {
      await categorySchema.updateMany(
        { _id: { $in: category } },
        { $push: { Product: product._id } }
      );
    }
    getIO().emit('productCreated', product);
    return res
      .status(200)
      .send({ msg: 'Product added successfully !', data: product });
  } catch (error) {
    next(error);
    return res.status(500).send({ msg: 'server Error !' });
  }
}

async function readProduct(req, res, next) {
  let { id } = req.params;
  try {
    if (id) {
      let singleProduct = await productScema.findById(id).populate('category');
      return res.send(singleProduct);
    } else {
      getallproducts = await productScema.find().populate('category');
      return res.send(getallproducts);
    }
  } catch (error) {
    next(error);
    return res.status(500).send({ msg: 'server Error !' });
  }
}

<<<<<<< HEAD
async function topProducts(req, res, next) {
  try {
    const topProducts = await productScema
      .find()
      .sort({ sold: -1 })
      .limit(10)
      .populate({
        path: 'category',
        select: 'name discription image',
      });

    getIO().emit('topProductsUpdate', topProducts);

    res.status(200).json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    next(error);
  }
}

=======
>>>>>>> a4f14cb52bfcad1cbc4fb2db7fdfe6c65c312330
async function updateProducts(req, res, next) {
  let { id } = req.params;
  let {
    ChangeName,
    ChangeDriscription,
    ChangePrice,
    ChangeCategory,
    Changestock,
  } = req.body;
  try {
    let photo = req.files;
    let Photos = [];
    if (Array.isArray(photo)) {
      photo.forEach(element => {
        Photos.push(process.env.Host_Name + '/' + element.path);
      });
    } else {
      Photos.push(process.env.Host_Name + photo.photo);
    }

    let updateProduct = await productScema.findByIdAndUpdate(
      { _id: id },
      {
        name: ChangeName,
        discription: ChangeDriscription,
        price: ChangePrice,
        category: ChangeCategory,
        photo: Photos,
        stock: Changestock,
      },
      { new: true }
    );

    getIO().emit('productupdated', updateProduct);
    return res.send({
      msg: 'Product update Successfully !',
      data: updateProduct,
    });
  } catch (error) {
<<<<<<< HEAD
    next(error);
=======
    console.log(error);
>>>>>>> a4f14cb52bfcad1cbc4fb2db7fdfe6c65c312330
    return res.status(500).send({ msg: 'server Error !' });
  }
}

async function DeleteProduct(req, res, next) {
  let { id } = req.params;
  try {
    let Deleteproducts = await productScema.findOne({ _id: id });
    if (!Deleteproducts) {
      return res.status(404).send({ msg: 'product not found !' });
    }
    await Deleteproducts.deleteOne();
    let Deletepromise = Deleteproducts.photo.map(element => {
      return new Promise((resolve, reject) => {
        let deletePhoto = path.join(
          __dirname,
          '../productPhoto',
          element.split('/').pop()
        );

        fs.unlink(deletePhoto, err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
    await Promise.all(Deletepromise);
    getIO().emit('productDeleted', id);
    return res.send({ msg: 'Product delete successfully !', id });
  } catch (error) {
    next(error);
    return res.status(500).send({ msg: 'server Error !' });
  }
}

<<<<<<< HEAD
module.exports = {
  Createproducts,
  readProduct,
  updateProducts,
  topProducts,
  DeleteProduct,
};
=======
module.exports = { Createproducts, readProduct, updateProducts, DeleteProduct };
>>>>>>> a4f14cb52bfcad1cbc4fb2db7fdfe6c65c312330
