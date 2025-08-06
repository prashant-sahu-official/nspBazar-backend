const User = require("../models/user");
const jwt = require('jsonwebtoken') ;
const bcrypt = require("bcryptjs");


async function signup(req, res){
    const {name, email, password} = req.body ;
    console.log(name, email, password) ;
    try{
    const userExist = await User.findOne({email}) ;
    
    if(userExist){
        return res.status(400).json({message: "User already Exist"}) 
    }

    const user = new User({name, email, password}) ;
    await user.save() ;
     
    const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'}) ;

    res.json({token, user:{ id: user._id, name: user.name, role: user.role} }) ;
    }
    catch(err){
        res.status(500).json({msg:err.message}) ;
    }
} 

async function login(req, res) {
    const {email, password} = req.body ;
    
    try{
    const user = await User.findOne({email}) ;
    console.log(user) ;
    if(!user){
        return res.status(400).json({message: "User not exist"}) ;
    }

      const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Wrong password' });

    const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'}) ;

    res.json({token, user:{ id: user._id, name: user.name, role: user.role} }) ;
    }
    catch(err){
        res.status(500).json({error: err.message}) ;
    }
}

exports.signup = signup ;
exports.login = login ;