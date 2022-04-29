const express = require('express');
const router = express.Router();
const schema = require('./users');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

var session;

router.get('/', (req, res) => {
    session=req.session;
    if(session.userid){
        if(session.type == '1'){
            res.redirect('/doctor');
        }else if(session.type == '2'){
            res.redirect('/family');
        }else if(session.type == '3'){
            res.redirect('/patient');
        }
    }else{
        res.render('home');
    }
})
router.get('/login', (req, res) => {
    res.render('login')
})
router.get('/signUp', (req, res) => {
    schema.doc.find().then(data => {
        res.render('signup', {doctorsList : data})
    }).catch(err => {
        res.send(err);
    })
})
router.post('/login', (req, res) => {
    if(req.body.typeAcc == '1'){
        schema.doc.find({email : req.body.email, password: req.body.password}).then(data => {
            session=req.session;
            session.userid=data[0]._id;
            session.type = '1';
            res.redirect('/');
        }).catch(err => {
            res.send(err);
        })
    }else if(req.body.typeAcc == '2'){
        schema.fam.find({email : req.body.email, password: req.body.password}).then(data => {
            session=req.session;
            session.userid=data[0]._id;
            session.type = '2';
            res.redirect('/');
        }).catch(err => {
            res.send(err);
        })
    }else if(req.body.typeAcc == '3'){
        schema.pat.find({email : req.body.email, password: req.body.password}).then(data => {
            session=req.session;
            session.userid=data[0]._id;
            session.type = '3';
            res.redirect('/');
        }).catch(err => {
            res.send(err);
        })
    }
})
router.post('/signUp', (req, res) => {
    console.log(req.body)
    if(req.body.typeAcc === '1'){
        const addData = new schema.doc({
            typeAcc : req.body.typeAcc,
            name : req.body.firstName + " " + req.body.lastName,
            email : req.body.email,
            PhoneNo : req.body.phoneNo,
            covidStatus : req.body.covidStat === 'true',
            address : req.body.address,
            health : req.body.healthInfo,
            freeTimeStart : new Date().setHours(req.body.InputStartFreeTime.slice(0,2), req.body.InputStartFreeTime.slice(3)),
            freeTimeEnd : new Date().setHours(req.body.InputEndFreeTime.slice(0,2), req.body.InputEndFreeTime.slice(3)),
            password : req.body.password
        }).save().catch(err => {
            res.send(err);
        }).then(data => {
            session=req.session;
            session.userid=data._id;
            session.type = '1';
            res.redirect(`/`);
        })
    }else if(req.body.typeAcc === '2'){
        const addData = new schema.fam({
            typeAcc : req.body.typeAcc,
            name : req.body.firstName + " " + req.body.lastName,
            email : req.body.email,
            PhoneNo : req.body.phoneNo,
            covidStatus : req.body.covidStat === 'true',
            address : req.body.address,
            health : req.body.healthInfo,
            password : req.body.password,
            relatedDoc : req.body.InputRelatedDoc
        }).save().catch(err => {
            res.send(err);
        }).then(data => {
            session=req.session;
            session.userid=data._id;
            session.type = '2';
            res.redirect(`/`);
        })
    }else if(req.body.typeAcc === '3'){
        const addData = new schema.pat({
            typeAcc : req.body.typeAcc,
            name : req.body.firstName + " " + req.body.lastName,
            email : req.body.email,
            PhoneNo : req.body.phoneNo,
            covidStatus : req.body.covidStat === 'true',
            address : req.body.address,
            health : req.body.healthInfo,
            password : req.body.password,
        }).save().catch(err => {
            res.send(err);
        }).then(data => {
            session=req.session;
            session.userid=data._id;
            session.type = '3';
            res.redirect(`/`);
        })
    }
})
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})


router.get('/doctor', (req, res) => {
    session=req.session;
    if(session.userid){
        if(session.type == '1'){
            res.render('doctorHome');
        }else{
            res.redirect('/');
        }
    }else{
        res.redirect('/');
    }
})
router.get('/doctor/askHelp', (req, res) => {})
router.post('/doctor/askHelp', (req, res) => {})


router.get('/patient', (req, res) => {
    session=req.session;
    if(session.userid){
        if(session.type == '3'){
            res.render('patientHome');
        }else{
            res.redirect('/');
        }
    }else{
        res.redirect('/');
    }
})
router.get('/patient/appointment', (req, res) => {})
router.post('/patient/appointment', (req, res) => {})
router.get('/patient/ask-doctors', (req, res) => {})
router.post('/patient/ask-doctors', (req, res) => {})
router.get('/patient/ask-for-rooms', (req, res) => {})
router.post('/patient/ask-for-room', (req, res) => {})


router.get('/family', (req, res) => {
    session=req.session;
    if(session.userid){
        if(session.type == '2'){
            res.render('familyHome');
        }else{
            res.redirect('/');
        }
    }else{
        res.redirect('/');
    }
})


router.get('/help-a-doctor', (req, res) => {})
router.get('/update-health', (req, res) => {})
router.post('/update-health', (req, res) => {})


module.exports = router;