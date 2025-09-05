const sendEmailer = require('../Halper/sendEmail');
const CartSchema = require('../Model/CartSchema');
const CheckoutSchema = require('../Model/CheckoutSchema');
const { getIO } = require('../socket');

async function checkout(req, res, next) {
  let { id } = req.params;
  let {
    name,
    email,
    address,
    city,
    phone,
    paymentMethod,
    delivery,
    paymentStatus,
  } = req.body;
  try {
    let Cartitems = await CartSchema.find({ user: id }).populate('product');
    if (!Cartitems) {
      return res.status(404).send({ msg: 'cart not found!' });
    }
    let OrginalPrice = 0;
    let additionalFees = 0;
    let totalQuantity = 0;

    Cartitems.forEach(item => {
      let productPrice = item.product ? item.product.price : 0;
      let quantity = item.quantity || 1;
      let Fees = item.additionalFees || 100;
      OrginalPrice += productPrice;
      totalQuantity += quantity;
      additionalFees += Fees;
    });
    let subTotal = 0;
    Cartitems.forEach(item => {
      subTotal += item.product.price * item.quantity;
    });
    let discount = totalQuantity > 5 || subTotal >= 5000 ? subTotal * 0.05 : 0;
    let shippingCost = subTotal >= 5000 ? 0 : 200;
    let totalPrice = subTotal + additionalFees + shippingCost - discount;
    let items = Cartitems.map(items => ({
      product: items.product,
      quantity: items.quantity,
      price: items.product.price,
      name: items.product.name,
    }));
    const orderID = `ORD-${uuidv4().split('-')[0].toUpperCase()}`;
    let newOder = new CheckoutSchema({
      user: id,
      cartitem: items,
      quantity: totalQuantity,
      totalPrice,
      uniqueOrderID: orderID,
      additionalFees,
      discount,
      shippingCost,
      name,
      email,
      address,
      city,
      phone,
      paymentMethod,
      paymentStatus,
      delivery,
    });
    await newOder.save();
    getIO().to(id).emit('orderPlaced', {
      msg: 'Order placed successfully!',
      orderID: uniqueOrderId,
      order: newOder,
    });
    await CartSchema.deleteMany({ user: id });
    getIO().to(id).emit('cartDeleted', id);
    sendEmailer(email, 'orderConfirmed', { name: name, orderID: orderID });
    return res
      .status(200)
      .send({ msg: 'order placed successfully !', order: newOder });
  } catch (error) {
    next(error);
    return res.status(500).send({ msg: 'server error!' });
  }
}

async function ReadCheckout(req, res, next) {
  let { id } = req.params;
  let { action, orderId } = req.query;

  try {
    if (action === 'single' && orderId) {
      let singleOder = await CheckoutSchema.findOne({ _id: orderId }).populate(
        'cartitem.product'
      );
      return res
        .status(200)
        .send({ msg: 'single cart found !', data: singleOder });
    } else {
      let checkout = await CheckoutSchema.find({ user: id }).populate(
        ' cartitem.product'
      );
      if (!checkout) {
        return res.status(404).send({ msg: 'checkout not found !' });
      } else {
        return res.send({ msg: 'all product found !', data: checkout });
      }
    }
  } catch (error) {
    next(error);
    return res.status(500).send({ msg: 'server error !' });
  }
}

async function AdminReadCheckout(req, res, next) {
  let { id } = req.params;

  try {
    let allCheckout = await CheckoutSchema.find({});
    if (!allCheckout) {
      return res.status(404).send({ msg: 'checkout not found !' });
    } else {
      return res.send({
        msg: 'all product found successfully !',
        data: allCheckout,
      });
    }
  } catch (error) {
    next(error);
    return res.status(500).send({ msg: 'server error !' });
  }
}

async function updateCheckout(req, res, next) {
  let orderID = req.params.id;
  let { action } = req.query;
  try {
    let userRoll = await CheckoutSchema.findOne({ _id: orderID }).populate(
      'user'
    );

    if (
      userRoll.delivery === 'cancelation_rejected' ||
      userRoll.delivery === 'return_rejected'
    ) {
      return res.status(400).json({ msg: "You can't update this order!" });
    }
    if (userRoll.user.Roll === 'user' && action === 'request') {
      userRoll.delivery = 'cancelation_requested';
    } else if (userRoll.user.Roll === 'user' && action === 'return') {
      userRoll.delivery = 'return_requested';
    } else {
      return res.status(400).send({ msg: 'invaild action for this user !' });
    }
    await userRoll.save();
    getIO()
      .to(userRoll.user._id.toString())
      .emit('orderStatus', {
        orderId: userRoll._id,
        deliveryStatus: userRoll.delivery,
        msg: `Your order status changed to ${userRoll.delivery}`,
      });

    return res.json({ msg: 'Order status updated', userRoll });
  } catch (error) {
    next(error);
    return res.status(500).send({ msg: 'server error !' });
  }
}

async function AdminDecision(req, res, next) {
  let { id } = req.params;
  let { action } = req.query;
  let adminID = req.user.Role;
  try {
    let adminWork = await CheckoutSchema.findOne({ _id: id }).populate('user');

    if (
      adminID === 'admin' &&
      (adminWork.delivery === 'cancelation_requested' ||
        adminWork.delivery === 'cancelation_rejected')
    ) {
      if (action === 'accept') {
        adminWork.delivery = 'canceled';
        sendEmailer(adminWork.user.email, 'orderCancel', {
          name: adminWork.user.name,
          orderID: adminWork.uniqueOrderID,
        });
      } else if (action === 'reject') {
        adminWork.delivery = 'cancelation_rejected';
      } else {
        return res.status(400).send({ msg: 'invaild action for admin !' });
      }
    } else if (
      adminID === 'admin' &&
      adminWork.delivery === 'return_requested'
    ) {
      if (action === 'returned') {
        adminWork.delivery = 'returned';
        sendEmailer(adminWork.user.name, 'orderReturn', {
          name: adminWork.user.name,
          orderID: adminWork.uniqueOrderID,
        });
      } else if (action === 'return_rejected') {
        adminWork.delivery = 'return_rejected';
      }
    } else {
      return res.status(400).send({ msg: 'you are not admin !' });
    }

    await adminWork.save();
    getIO()
      .to(adminWork.user._id.toString())
      .emit('orderStatusUpdate', {
        orderId: adminWork._id,
        orderStatus: adminWork.delivery,
        msg: `Your order status changed to ${order.delivery}`,
      });
    return res
      .status(200)
      .send({ msg: 'order status updated !', data: adminWork });
  } catch (error) {
    next(error);
    return res.status(500).send({ msg: 'server error !' });
  }
}

module.exports = {
  checkout,
  ReadCheckout,
  AdminReadCheckout,
  updateCheckout,
  AdminDecision,
};
