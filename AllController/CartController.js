const CartSchema = require('../Model/CartSchema');
const productScema = require('../Model/productScema');
const { getIO } = require('../socket');

async function CreateCart(req, res, next) {
  let { user, product } = req.body;

  try {
    let productExist = await productScema.findOne({ _id: product });
    if (!productExist) {
      return res.status(404).send({ msg: 'product not found !' });
    }
    let existingCard = await CartSchema.findOne({
      user: user,
      product: product,
    });
    if (existingCard) {
      return res
        .status(400)
        .json({ msg: 'This product is already in your cart' });
    }
    let qty = 1;
    let addictionalFee = 100;
    let orginalPrice = productExist.price;
    let subtotal = orginalPrice * qty;
    let shippingCost = subtotal >= 5000 ? 0 : 200;
    let discount = qty > 10 || subtotal >= 5000 ? subtotal * 0.05 : 0;
    let total = subtotal + addictionalFee + shippingCost - discount;
    let Cart = new CartSchema({
      user: user,
      product,
      quantity: qty,
      additionalFees: addictionalFee,
      OrginalPrice: orginalPrice,
      subTotal: subtotal,
      shippingCost,
      discount,
      totalPrice: total,
    });

    await Cart.save();
    getIO().to(user).emit('cartADD', Cart);
    return res
      .status(200)
      .send({ msg: 'Product Added to Cart Successfully !', data: Cart });
  } catch (error) {
    next(error);
    return res.status(500).send({ msg: 'server error' });
  }
}

async function readcart(req, res, next) {
  let { id } = req.params;
  try {
    let Getcart = await CartSchema.find({ user: id }).populate(
      'product',
      'name photo price '
    );
    if (Getcart.length === 0) {
      return res.status(404).send({ msg: 'cart not found !' });
    }
    let CartData = Getcart.map(item => ({
      CartitemID: item._id,
      product: item.product,
      price: item.product.price,
      quantity: item.quantity,
    }));
    getIO().to(id).emit('CartData', CartData);
    return res.status(200).send(CartData);
  } catch (error) {
    next(error);
    return res.status(500).send({ msg: 'server Error!' });
  }
}

async function CartSummery(req, res, next) {
  let { id } = req.params;
  try {
    thisCartItem = await CartSchema.find({ user: id }).populate('product');
    if (!thisCartItem) {
      return res.status(404).send({ msg: 'Cart not Found !' });
    }
    let originalPrice = 0;
    let totalQuantity = 0;
    const additionalFees = 100;
    thisCartItem.forEach(item => {
      let productprice = item.product ? item.product.price : 0;
      let quantity = item.quantity || 0;
      originalPrice += productprice;
      totalQuantity += quantity;
    });
    let subtotal = originalPrice * totalQuantity;
    let shippingCost = subtotal >= 500 ? 0 : 200;
    let discount = totalQuantity > 5 || subtotal >= 5000 ? subtotal * 0.05 : 0;
    let totalPrice = subtotal + additionalFees + shippingCost - discount;
    let Cartsummery = {
      originalPrice,
      totalQuantity,
      shippingCost,
      subtotal,
      discount,
      totalPrice,
    };
    getIO().to(id).emit('cartSummery', Cartsummery);
    return res.status(200).send(Cartsummery);
  } catch (error) {
    next(error);
    return res.status(500).send({ msg: 'server error !' });
  }
}

async function IncreamentCart(req, res, next) {
  let { id } = req.params;
  let { action } = req.query;
  try {
    let cartItem = await CartSchema.findOne({ _id: id }).populate({
      path: 'product',
      select: 'price stock',
    });

    if (!cartItem) {
      return res.status(404).send({ msg: 'Cart item not found' });
    }
    if (action === 'Increment') {
      if (cartItem.quantity >= 20) {
        return res.status(400).send({ msg: 'Max quantity of 20 reached' });
      } else if (cartItem.quantity >= cartItem.product.stock) {
        return res.status(400).send({ msg: 'Not enough stock available' });
      } else {
        cartItem.quantity += 1;
      }
    } else if (action === 'Decrement') {
      if (cartItem.quantity <= 1)
        return res.status(400).send({ msg: 'Quantity cannot go below 1' });
      cartItem.quantity -= 1;
    } else {
      return res
        .status(400)
        .send({ msg: 'Invalid action or quantity cannot go below 1' });
    }
    let productPrice = cartItem.product ? cartItem.product.price : 0;
    let quantity = cartItem.quantity || 1;
    let additionalFees = cartItem.additionalFees || 100;
    let originalprice = productPrice;
    let subtotal = originalprice * cartItem.quantity;
    let shippingCost = subtotal >= 5000 ? 0 : 200;
    let discount = quantity > 10 || subtotal >= 5000 ? subtotal * 0.05 : 0;
    let totalprice = subtotal + shippingCost + additionalFees - discount;
    if (!isNaN(originalprice) && !isNaN(totalprice)) {
      cartItem.OrginalPrice = originalprice;
      cartItem.totalPrice = totalprice;
      cartItem.subTotal = subtotal;
      cartItem.discount = discount;
      cartItem.shippingCost = shippingCost;
    } else {
      return res.status(500).json({
        msg: 'Invalid price calculation',
        debug: { productPrice, quantity, additionalFees },
      });
    }
    await cartItem.save();
    getIO().to(cartItem.user.toString()).emit('cartItem', cartItem);
    return res.status(200).json({
      msg: `Cart ${
        action === 'Increment' ? 'Incremented' : 'Decremented'
      } successfully`,
      data: cartItem,
    });
  } catch (error) {
    next(error);
    return res.status(500).send({ msg: 'server error!' });
  }
}

async function DeleteCart(req, res, next) {
  let { id } = req.params;
  let { action, userid } = req.query;
  try {
    if (action === 'single') {
      let deleteCart = await CartSchema.findById(id);
      deleteCart.deleteOne();
      getIO().to(deleteCart.user.toString()).emit('cartDeleted', id);
      return res.status(200).send({ msg: 'cart delete Successfully !', id });
    } else if (action === 'clear') {
      let deleteManyCart = await CartSchema.deleteMany({ user: userid });
      getIO().to(userid).emit('CartDeleted', userid);
      return res
        .status(200)
        .send({ msg: 'All cart delete Successfully !', deleteManyCart });
    } else {
      return res.status(400).send({ msg: 'Invaild Action' });
    }
  } catch (error) {
    next(error);
  }
}
module.exports = {
  CreateCart,
  readcart,
  CartSummery,
  IncreamentCart,
  DeleteCart,
};
