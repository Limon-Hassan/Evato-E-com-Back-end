const productScema = require('../Model/productScema');
const ReviewsSchema = require('../Model/ReviewsSchema');
let { getIO } = require('../socket');

async function makeReviews(req, res, next) {
  let { productId, rating, comment } = req.body;
  let userID = req.user.id;
  try {
    let reviews = await ReviewsSchema.create({
      user: userID,
      product: productId,
      comment,
      rating,
    });
    await productScema.findByIdAndUpdate(productId, {
      $push: { reviews: reviews._id },
    });

    getIO().emit('reviewCreated', {
      productId,
      review: await reviews.populate('user', 'name'),
    });

    res.status(200).send({ msg: 'review added successfully', data: reviews });
  } catch (error) {
    next(error);
  }
}

async function getReviews(req, res, next) {
  let productId = req.params.id;
  try {
    let GetReviews = await ReviewsSchema.find({ product: productId }).populate(
      'user',
      'name'
    );
    if (GetReviews.length === 0) {
      res.status(404).send({ msg: 'no reviews found' });
    }
    res.send({ msg: 'reviews found', data: GetReviews });
  } catch (error) {
    next(error);
  }
}


module.exports = { makeReviews, getReviews };
