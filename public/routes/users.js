const express = require ('express');
const router = express.Router();
const { check, validationResult} = require('express-validator');
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');
const User = require('../../models/Users');
const auth = require('../../middleware/auth');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json())

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

router.get('/main',
  async(req,res)=>{
    res.render('../views/Main');
  })

router.get('/member',
  async (req,res)=>{
    if (!req.session.user){
      res.redirect('../users/signin')
    } else {
      res.render('../views/Member');
    }
  }
);

router.get('/bootstrap',
async (req,res)=>{
    res.render('../views/bootstrap');
    })

router.get('/signin',
  async (req,res) => {
    if (req.session.user){
      res.redirect('../users/member')
    } else {
      res.render('../views/signin');
    }
  }
);

router.get('/register',
  async (req,res) => {
    if (req.session.user){
        res.redirect('/users/member');
    } else {
        res.render('../views/signinform');
    }
  }
);



router.get('/me', auth, async (req,res) => {
  try{
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (e) {
    res.send({message: "Error in Fetching user"});
  }
});

//delivery
router.get('/delivery',
  async(req,res)=>{
    res.render('../views/delivery');
})

//logout
router.get('/logout',
    async(req,res) => {
        req.session.destroy();

        //redirect to login
        res.redirect('../users/main');
    }
);


//desc
router.get('/airpods',
  async(req,res)=>{
    res.render('../desc/airpods');
})

router.get('/baju',
  async(req,res)=>{
    res.render('../desc/baju');
})

router.get('/beras',
  async(req,res)=>{
    res.render('../desc/beras');
})

router.get('/bunga',
  async(req,res)=>{
    res.render('../desc/bunga');
})

router.get('/chitato',
  async(req,res)=>{
    res.render('../desc/chitato');
})

router.get('/cookies',
  async(req,res)=>{
    res.render('../desc/cookies');
})

router.get('/ig',
  async(req,res)=>{
    res.render('../desc/ig');
})

router.get('/japota',
  async(req,res)=>{
    res.render('../desc/japota');
})

router.get('/jeans',
  async(req,res)=>{
    res.render('../desc/jeans');
})

router.get('/jolly',
  async(req,res)=>{
    res.render('../desc/jolly');
})

router.get('/kotak',
  async(req,res)=>{
    res.render('../desc/kotak');
})

router.get('/maechee',
  async(req,res)=>{
    res.render('../desc/maechee');
})

router.get('/masker',
  async(req,res)=>{
    res.render('../desc/masker');
})

router.get('/mobil',
  async(req,res)=>{
    res.render('../desc/mobil');
})

router.get('/momogi',
  async(req,res)=>{
    res.render('../desc/momogi');
})

router.get('/nescafe',
  async(req,res)=>{
    res.render('../desc/nescafe');
})

router.get('/parfum',
  async(req,res)=>{
    res.render('../desc/parfum');
})

router.get('/pensil',
  async(req,res)=>{
    res.render('../desc/pensil');
})

router.get('/potabi',
  async(req,res)=>{
    res.render('../desc/potabi');
})

router.get('/roti',
  async(req,res)=>{
    res.render('../desc/roti');
})

router.get('/royco',
  async(req,res)=>{
    res.render('../desc/royco');
})

router.get('/samsung',
  async(req,res)=>{
    res.render('../desc/samsung');
})

router.get('/spidol',
  async(req,res)=>{
    res.render('../desc/spidol');
})

router.get('/sunsilk',
  async(req,res)=>{
    res.render('../desc/sunsilk');
})

router.get('/tas',
  async(req,res)=>{
    res.render('../desc/tas');
})

router.get('/teh',
  async(req,res)=>{
    res.render('../desc/teh');
})

router.get('/tiketkucing',
  async(req,res)=>{
    res.render('../desc/tiketkucing');
})

router.get('/kue',
  async(req,res)=>{
    res.render('../desc/kue');
})

router.get('/beat',
  async(req,res)=>{
    res.render('../desc/beat');
})

router.post('/signin',
[
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
        min: 8
    })
],
    async(req,res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const email = req.body.email;
        const password = req.body.password;
        try{
            let user = await User.findOne({
                email
            });
            if(!user){
                res.render('../../views/signin', {error: 'User Not Exist'});
            } else {
                    const isMatch = await bcrypt.compare(password, user.password);
                        if(!isMatch){
                            res.render('../../views/signin', {error: 'Incorrect Password!'});
                        } else {
                            const payload = {
                                user: {
                                id: user.id
                                }
                            };

                            jwt.sign(
                                payload,
                                "randomString",
                                {
                                    expiresIn: 3600
                                },
                                (err, token) => {
                                    if(err) {
                                        throw err;
                                    } else {
                                        console.log({token});
                                        req.session.user = "member";
                                        res.redirect('../users/member');
                                    }

                                }
                            );
                        }
                }
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: "Server Error"
            });
        }
    }
);



router.post('/register',
    [
        check("username", "Please enter a valid name")
        .not()
        .isEmpty(),
        check("email", "Please enter a valid email")
        .not()
        .isEmpty(),
        check("password", "Please enter a valid password").isLength({
            min: 8
        }),
        check("repeatpassword", "enter the password again").isLength({
          min: 8
        })
    ],
    async(req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const repeatpassword = req.body.repeatpassword;

        try{
            let user = await User.findOne({
                username
            });
            if (user) {
                res.render('/views/signinform', {error: 'User Already Exists'});
            } else{
                user = new User({
                    username,
                    email,
                    password,
                    repeatpassword
                });

                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
                user.repeatpassword = await bcrypt.hash(repeatpassword, salt);

                await user.save();

                const payload = {
                    user: {
                        id: user.id
                    }
                };

                jwt.sign(
                    payload,
                    "randomString", {
                        expiresIn: 10000
                    },
                    (err, token) => {
                        if (err) {
                            throw err;
                        } else {
                            console.log({token});
                            req.session.user = "client";
                            res.redirect('/users/member');
                        }

                    }
                );
            }
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);

module.exports  = router;

/*router.post('/signin',
  async (req, res) => {
      // get user input
      const username = req.body.name;
      const password = req.body.password;

      //check username and password
      if(username === "admin" && password === "admin") {
          //session
          req.session.user = "admin";

          //login success and redirect to member area
          res.redirect('/users/member');
      } else {
          res.render('../views/signin', { layout: false, error: 'Wrong username or password.'});
      }
  });*/
