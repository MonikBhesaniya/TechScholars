const express = require('express');
const auth = require('../../middleware/auth'); 
const User = require('../../models/User');
const jwt = require('jsonwebtoken'); 
const config = require('config');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');  
const router = express.Router();

//@route   GET api/auth
//@desc    Get user info 
//@access  public
router.get("/", auth, async (req,res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error'); 
    }
});

//@route   POST api/auth
//@desc    Authenticate user and get token
//@access  public
router.post("/", [
    check('email','Please enter a valid email address').isEmail(),
    check('password', 'Passowrd is required').exists()
], 
async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); 
    }

    const { email, password } = req.body;

    try{
        let  user = await User.findOne({ email });
        
        // See the user does not exixt
        if(!user){
           return res.status(400).json({ errors: [{ msg: 'Invalid Crdentials' }] }); 
        }
    
        //Password match
        const isMatch = await bcrypt.compare(password, user.password);
        
        if(!isMatch){
            return res.status(400).json({ errors: [{ msg: 'Invalid Crdentials' }] }); 
        }

        //Return jsonwebtoken
        const paylode = {
            user: {
                id: user.id
            }
        } 

        jwt.sign(
            paylode, 
            config.get('jwtsecret'),
            { expiresIn: 360000 },
            (err, token) => {
                if(err) throw err;
                res.json({ token });
            } 
            );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');    
    }
});
 

module.exports = router; 