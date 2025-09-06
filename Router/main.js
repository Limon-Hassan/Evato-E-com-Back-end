let express = require('express');
let router = express.Router();
let Api = require('./Api/main');

let Baseurl = process.env.BASE_URL;
router.use(Baseurl, Api);
router.use(Baseurl, (req, res) => {
  res.status(404).send("No Api Route Found")
})
module.exports = router;
