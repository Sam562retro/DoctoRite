const express = require('express');
const router = express.Router();
const schema = require('./users');
const otherSchema = require('./otherSchema');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const { send } = require('express/lib/response');
const { doc } = require('./users');

var session;

const dateToTime = (dataD) => {
    let data= new Date(dataD)
    let hrs = data.getHours()
    let mins = data.getMinutes()
    if(hrs<=9){
        hrs = '0' + hrs;
    }
    if(mins<10){
        mins = '0' + mins;
    }
    const postTime= hrs + ':' + mins
    return postTime
}

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
            schema.doc.findById(session.userid).then(data => {
                otherSchema.help.find().then(helpThem => {
                    res.render('dashboardMain', {data : data, helpThem : helpThem});
                }).catch(err => {
                    res.send(err);
                })
            }).catch(err => {
                res.send(err);
            })
        }else{
            res.redirect('/');
        }
    }else{
        res.redirect('/');
    }
})
router.get('/patient', (req, res) => {
    session=req.session;
    if(session.userid){
        if(session.type == '3'){
            schema.pat.findById(session.userid).then(data => {
                otherSchema.help.find().then(helpThem => {
                    res.render('dashboardMain', {data : data, helpThem : helpThem});
                }).catch(err => {
                    res.send(err);
                })
            }).catch(err => {
                res.send(err);
            })
        }else{
            res.redirect('/');
        }
    }else{
        res.redirect('/');
    }
})
router.get('/family', (req, res) => {
    session=req.session;
    if(session.userid){
        if(session.type == '2'){
            schema.fam.findById(session.userid).then(data => {
                otherSchema.help.find().then(helpThem => {
                    res.render('dashboardMain', {data : data, helpThem : helpThem});
                }).catch(err => {
                    res.send(err);
                })
            }).catch(err => {
                res.send(err);
            })
        }else{
            res.redirect('/');
        }
    }else{
        res.redirect('/');
    }
})

router.get('/family-status', (req, res) => {
    session=req.session;
    if(session.userid){
        if(session.type == '1'){
            schema.doc.findById(session.userid).then(data => {
                schema.fam.find({relatedDoc : data._id}).then(family => {
                    res.render('family-stat', {data : data, family : family});
                }).catch(err => {
                    res.send(err);
                })
            }).catch(err => {
                res.send(err);
            })
        }else if(session.type == '2'){
            schema.fam.findById(session.userid).then(data => {
                schema.fam.find({relatedDoc : data.relatedDoc}).then(family => {
                    schema.doc.find({_id : data.relatedDoc}).then(familyDoc => { 
                        res.render('family-stat', {data : data, family : family, familyDoc: familyDoc});
                    }).catch(err => {
                        res.send(err);
                    })
                }).catch(err => {
                    res.send(err);
                })
            }).catch(err => {
                res.send(err);
            })
        }else{
            res.redirect('/');
        }
    }else{
        res.redirect('/');
    }
})

router.get('/help-a-person/:id', (req, res) => {
    otherSchema.help.findById(req.params.id).then(helpData => {
        session=req.session;
            if(session.userid){
                if(session.type == '1'){
                    schema.doc.findById(session.userid).then(data => {
                        res.render('help-show', {data : data, helpData:helpData});
                    }).catch(err => {
                        res.send(err);
                    })
                }else if(session.type == '2'){
                    schema.fam.findById(session.userid).then(data => {
                        res.render('help-show', {data : data, helpData:helpData});
                    }).catch(err => {
                        res.send(err);
                    })
                }else if(session.type == '3'){
                    schema.pat.findById(session.userid).then(data => {
                        res.render('help-show', {data : data, helpData:helpData});
                    }).catch(err => {
                        res.send(err);
                    })
                }else{
                    res.redirect('/');
                }
            }else{
                res.redirect('/');
            }
    }).catch(err => {res.send(err);})
})
router.post('/help-a-person/:id', (req, res) => {
    otherSchema.help.findByIdAndDelete(req.params.id).catch(err => {res.send(err)});
    res.redirect('/')
})
router.get('/ask-for-help', (req, res) => {
    otherSchema.help.find().then(data => {
        if(data.length < 9){
            session=req.session;
            if(session.userid){
                if(session.type == '1'){
                    schema.doc.findById(session.userid).then(data => {
                        res.render('ask-help', {data : data, canAsk: true});
                    }).catch(err => {
                        res.send(err);
                    })
                }else if(session.type == '2'){
                    schema.fam.findById(session.userid).then(data => {
                        res.render('ask-help', {data : data, canAsk: true});
                    }).catch(err => {
                        res.send(err);
                    })
                }else if(session.type == '3'){
                    schema.pat.findById(session.userid).then(data => {
                        res.render('ask-help', {data : data, canAsk: true});
                    }).catch(err => {
                        res.send(err);
                    })
                }else{
                    res.redirect('/');
                }
            }else{
                res.redirect('/');
            }
        }else{
            session=req.session;
            if(session.userid){
                if(session.type == '1'){
                    schema.doc.findById(session.userid).then(data => {
                        res.render('ask-help', {data : data, canAsk: false});
                    }).catch(err => {
                        res.send(err);
                    })
                }else if(session.type == '2'){
                    schema.fam.findById(session.userid).then(data => {
                        res.render('ask-help', {data : data, canAsk: false});
                    }).catch(err => {
                        res.send(err);
                    })
                }else if(session.type == '3'){
                    schema.pat.findById(session.userid).then(data => {
                        res.render('ask-help', {data : data, canAsk: false});
                    }).catch(err => {
                        res.send(err);
                    })
                }else{
                    res.redirect('/');
                }
            }else{
                res.redirect('/');
            }
        }
    })
})
router.post('/ask-for-help', (req, res) => {
    const addData = new otherSchema.help({
        typeAcc : req.body.userType,
        name : req.body.name,
        email : req.body.email,
        PhoneNo : req.body.phoneNo,
        userId : req.body.userId,
        need : req.body.need,
        explanation : req.body.explanation
    }).save().catch(err => {
        res.send(err);
    }).then(data => {
        res.redirect(`/`);
    })
})
router.get('/consult-a-doctor', (req, res) => {
    session=req.session;
    if(session.userid){
        if(session.type == '3'){
            schema.pat.findById(session.userid).then(data => {
                schema.doc.find().then(dataDoc => {
                    let dataDocArr = []
                    dataDoc.forEach(function(docData){
                        obj = docData;
                        obj.password = undefined;
                        obj.typeAcc = undefined;
                        obj.covidStatus = undefined;
                        obj.address = undefined;
                        obj.health = undefined;
                        obj.freeTimeStart = undefined;
                        obj.freeTimeEnd = undefined;
                        dataDocArr.push(obj)
                    })
                    res.render('consult-docs', {data : data, dataDocs: dataDocArr});
                }).catch(err => {res.send(err)})
            }).catch(err => {
                res.send(err);
            })
        }else{
            res.redirect('/');
        }
    }else{
        res.redirect('/');
    }
})
router.get('/profile/:typeAccount/:id', (req, res) => {
        session=req.session;
        if(session.userid){
            if(req.params.typeAccount == '1'){
                schema.doc.findById(req.params.id).then(data => {
                    let x = false;
                    if(data._id == session.userid){
                        x = true;
                    }
                    res.render('profile', {data : data, yourAcc : x});
                }).catch(err => {
                    res.send(err);
                })
            }else if(req.params.typeAccount == '2'){
                schema.fam.findById(req.params.id).then(data => {
                    let x = false;
                    if(data._id == session.userid){
                        x = true;
                    }
                    res.render('profile', {data : data, yourAcc : x});
                }).catch(err => {
                    res.send(err);
                })
            }else if(req.params.typeAccount == '3'){
                schema.pat.findById(req.params.id).then(data => {
                    let x = false;
                    if(data._id == session.userid){
                        x = true;
                    }
                    res.render('profile', {data : data, yourAcc : x});
                }).catch(err => {
                    res.send(err);
                })
            }else{
                res.redirect('/');
            }
        }else{
            res.redirect('/');
        }
})
router.get('/edit-profile', (req, res) => {
    session=req.session;
    if(session.userid){
        if(session.type == '1'){
            schema.doc.findById(session.userid).then(data => {
                res.render('edit-profile', {data : data});
            }).catch(err => {
                res.send(err);
            })
        }else if(session.type == '2'){
            schema.fam.findById(session.userid).then(data => {
                res.render('edit-profile', {data : data});
            }).catch(err => {
                res.send(err);
            })
        }else if(session.type == '3'){
            schema.pat.findById(session.userid).then(data => {
                res.render('edit-profile', {data : data});
            }).catch(err => {
                res.send(err);
            })
        }else{
            res.redirect('/');
        }
    }else{
        res.redirect('/')
    }
})
router.post('/edit-profile', (req, res) => {
    dat = req.body;
    session = req.session;
    if(session.type == '1'){
        console.log(dat);
        dat.freeTimeStart = new Date().setHours(dat.freeTimeStart.slice(0,2), dat.freeTimeStart.slice(3));
        dat.freeTimeEnd = new Date().setHours(dat.freeTimeEnd.slice(0,2), dat.freeTimeEnd.slice(3));
        console.log(dat.freeTimeStart);
        schema.doc.findOneAndUpdate({_id : session.userid}, dat).then(data => {
            res.redirect('/')
        }).catch(err => res.send(err))
    }else if(session.type == '2'){
        schema.fam.findOneAndUpdate({_id : session.userid}, dat).then(data => {
            res.redirect('/')
        }).catch(err => res.send(err))
    }else if(session.type == '3'){
        schema.pat.findOneAndUpdate({_id : session.userid}, dat).then(data => {
            res.redirect('/')
        }).catch(err => res.send(err))
    }else{
        res.redirect('/')
    }
})

module.exports = router;