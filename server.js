require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoStore = require('connect-mongo');
const passport = require('passport');


// Database connection
const url = 'mongodb://localhost/pizza';
// var mongoClient = require('mongodb').MongoClient;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedtopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database Connected');
}).on('error', () => {
    console.log("connection failed");
})

//session store
const sessionStorage = MongoStore.create({
    mongoUrl: url,
    dbName: 'pizza',
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60,
    autoRemove: "native"
});

// session configuration
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStorage,
    cookie: { maxAge: 1000 * 60 * 24 } // 24hour session
}))

//passport config
const passportInit = require('./app/config/passport')
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Assests
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

// Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.user;
    next();
})

//set template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs');

require('./routes/web')(app)

app.listen(PORT, () => {
    console.log("listening on port " + PORT);
})


