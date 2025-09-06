let express = require('express');
require('dotenv').config();
var cookieParser = require('cookie-parser');
const router = require('./Router/main');
const dbConnection = require('./Config/dbconfig');
const { ErrorCheck } = require('./Halper/ErrorCheck');
let cors = require('cors');
let http = require('http');
let app = express();
const { init: initSocket } = require('./socket');
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

let server = http.createServer(app);
const io = initSocket(server);

io.on('connection', socket => {
  console.log('✅ User connected:', socket.id);

  socket.on('joinUser', ({ userId }) => {
    socket.join(userId);
  });

  socket.on('joinAdmin', ({ adminId }) => {
    socket.join('adminRoom');
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});
app.use(express.static('uploads'));
app.use(express.static('productPhoto'));
app.use(router);
app.use(ErrorCheck);
dbConnection();
app.get('/', (req, res) => {
  res.send('Hello World !');
});
let PORT = process.env.MY_SERVER_PORT || 5990;
server.listen(PORT, () => {
  console.log('Server Is Ready ! ' + PORT);
});

module.exports = { app, server };
