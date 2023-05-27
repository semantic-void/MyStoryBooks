const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const serverless = require('serverless-http');
// Load config
dotenv.config({ path: './config/config.env' });

// Passport config
require('./config/passport')(passport);

connectDB();

const PORT = process.env.PORT || 3000;
const app = express();

// Body parser Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

//Logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Handlebars helper
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require('./helpers/hbs.js');

// Handlebars
app.engine(
  '.hbs',
  exphbs.engine({
    helpers: { formatDate, stripTags, truncate, editIcon, select },
    defaultLayout: 'main',
    extname: '.hbs',
  })
);
app.set('view engine', '.hbs');
app.set('views', './views');

// Sessions
app.use(
  session({
    secret: 'mouse in the house',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      mongooseConnection: mongoose.connection,
    }),
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set Globle variable 'throught middleware'
app.use(function (req, res, next) {
  // The res.locals sets local variable
  res.locals.user = req.user || null;
  next();
});

// Static Folder (public)
app.use(express.static(path.join(__dirname, 'public')));

// deafening routs
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

// Error pages middlewear
app.use(function (req, res, next) {
  res.status(404);
  if (req.accepts('html')) {
    res.render('error/404', { url: req.url });
    return;
  }
  res.status(500);
  if (req.accepts('html')) {
    res.render('error/500');
    return;
  }
  res.send('Internal Server Error');
});

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} made on PORT ${PORT}`)
);
// cross-env NODE_ENV = production node app
module.exports.handler = serverless(app);
