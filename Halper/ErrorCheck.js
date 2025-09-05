async function ErrorCheck(error, req, res, next) {
  if (error) {
    console.error(error.message);
    return res.status(500).send({
      msg: 'Error found',
      error: error.message,
    });
  } else {
    next();
  }
}

module.exports = { ErrorCheck };
