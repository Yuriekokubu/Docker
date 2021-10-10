const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const redis = require('redis');
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
} = require('./config/config');

let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT,
});

const postRoutes = require('./routes/postRoute');
const userRoutes = require('./routes/userRoute');

const app = express();
app.use(express.json());

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose
    .connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'mydb',
    })
    .then(() => console.log('Successfully Connected to DB'))
    .catch((e) => {
      console.log(e);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

app.enable('trust proxy');
app.use(cors({}));
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      resave: false,
      saveUninitialized: false,
      httpOnly: true,
      maxAge: 60000,
    },
  })
);

app.get('/api/v1', (req, res) => {
  res.send('<h2>DOCKer 2222</h2>');
  console.log('Yeah it ran');
});

app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/users', userRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));
