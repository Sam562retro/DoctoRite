const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./server/router');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
//****End of imports****


const connection = () => {
    mongoose.connect('mongodb://localhost/DoctorsHelp', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Connected With Mongo DB');
};

connection();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

app.use(cookieParser());
app.use('/', router);
//********* listening to port ********
app.listen(3000);