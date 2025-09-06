const { default: mongoose } = require('mongoose');

function dbConnection() {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log('DATABSE CONNECTED SUCCESSFULLY');
    })
    .catch(err => {
      console.log(err);
    });
}
module.exports = dbConnection;
