const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const { engine, create } = require('express-handlebars');
const MongoStore = require('connect-mongo');

//  CUSTOM MODULES
const connectDB = require('./config/db');
const passportConfig = require('./config/passport')
const indexRoutes = require('./routes/indexRoutes');
const authRoutes = require('./routes/authRoutes');
const storiesRoutes = require('./routes/storiesRoutes');
// HANDLEBARS HELPERS
const { formatDate, truncate, stripTags, editIcon, select } = require('./helpers/hbs');

// LOAD CONFIG
dotenv.config({ path: './config/config.env'});

// PASSPORT CONFIG
passportConfig(passport)

const app = express();
const PORT = process.env.PORT || 5000;

// CONNECT MONGOOSE TO DB
connectDB();

// MORGAN MIDDLEWARE FOR LOGGING PAGE REQUEST
if (process.env.NODE_ENV === 'develoopment') {
    app.use(morgan('dev'));
}

// REGISTER VIEW ENGINE
const hbs = create({
    helpers: {
      formatDate,
      truncate,
      stripTags,
      editIcon,
      select
    }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

// EXPRESS SESSION MIDDLEWARE - used for passport middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 3 * 24 * 60 * 60
    }) //store login session
}));

// PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

// SET GLOBAL VARIABLE
app.use((req, res, next) => {
    // get access to the logged in user
    res.locals.user = req.user || null;
    next();
})

// STATIC FILES MIDDLEWARE
app.use(express.static('public'));

// BODY PARSER - FORM DATA MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// METHOD OVERRIDE FOR PUT & DELETE
app.use(methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  }));

// INDEX ROUTES
app.use('/', indexRoutes);

// AUTH ROUTES
app.use('/auth', authRoutes);

// STORIES ROUTES
app.use('/stories', storiesRoutes);

app.listen(PORT, () => console.log(`Server launched on port ${PORT} and running in ${process.env.NODE_ENV}`));