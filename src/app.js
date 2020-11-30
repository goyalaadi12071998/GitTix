const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth-routes/auth-routes');
const userRoutes = require('./routes/user-routes/user-routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan());

app.use(cookieSession({    
    name: 'session',
    resave: true,
    saveUninitialized: false,
    secret: process.env.JWT_SECRET,
    keys: [process.env.JWT_SECRET]
}));

app.use(authRoutes);
app.use(userRoutes);

module.exports = app;