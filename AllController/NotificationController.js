const Notification = require('../Model/notifiactionSchema');
const { getIO } = require('../socket');

async function createNotify(req, res, next) {
  try {
    const { user, message, type } = req.body;

    if (!user || !message) {
      return res.status(400).send({ msg: 'User and message are required!' });
    }

    let newNotify = new Notification({ user, message, type });
    await newNotify.save();

    getIO().to(user.toString()).emit('notification', {
      _id: newNotify._id,
      message: newNotify.message,
      type: newNotify.type,
      isRead: newNotify.isRead,
      createdAt: newNotify.createdAt,
    });

    res.status(201).send({ msg: 'Notification created', data: newNotify });
  } catch (error) {
    next(error);
    res.status(500).send({ msg: 'Server error!' });
  }
}

async function getNotify(req, res, next) {
  try {
    const { userId } = req.params;
    let notifications = await Notification.find({ user: userId }).sort({
      createdAt: -1,
    });
    res.status(200).send(notifications);
  } catch (error) {
    next(error);
    res.status(500).send({ msg: 'Server error!' });
  }
}

async function ReadNotify(req, res) {
  try {
    const { id } = req.params;
    let notify = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notify) return res.status(404).send({ msg: 'Notification not found' });

    res.status(200).send({ msg: 'Notification marked as read', data: notify });
  } catch (error) {
    next(error);
    res.status(500).send({ msg: 'Server error!' });
  }
}

module.exports = { createNotify, getNotify, ReadNotify };
