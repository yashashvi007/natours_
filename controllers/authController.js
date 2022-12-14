const User = require('./../models/userModel')
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')
const APIFeatures = require('../utils/apiFeatures')
const AppError = require('../utils/appError')

const signToken = id => {
    return jwt.sign({id} , process.env.JWT_SECRET , {
        expiresIn : process.env.JWT_EXPIRES_IN
    } )
}

exports.signup = catchAsync(async (req ,res)=>{
    const newUser = await User.create({
        name : req.body.name , 
        email : req.body.email , 
        password : req.body.password , 
        passwordConfirm : req.body.passwordConfirm
    })

    const token = jwt.sign({id : newUser._id} , process.env.JWT_SECRET , {
        expiresIn : process.env.JWT_EXPIRES_IN
    } )

    res.status(201).json({
        status : 'success' , 
        data : {
            user : newUser , 
            token
        }
    })
})

exports.login = catchAsync (async (req ,res , next)=>{
    const {email , password} = req.body
    if(!email || !password ){
        return next(new AppError('Please provide email and password!' , 400))
    }
    
    const user = await User.findOne({email}).select('+password')
   
    if(!user || !(await user.correctPassword(password , user.password))){
        return next(new AppError('Incorrect email or password' , 401))
    }

    const token = signToken(user._id)
    res.status(200).json({
        status : 'success' ,
        user,
        token
    })
})


exports.protect = catchAsync(async (req , res , next)=>{
    let token ; 
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer') ){
        token = req.headers.authorization.split(' ')[1]
    }

    if(!token){
        return next(new AppError('You are not logged in! Please log in to get access' , 401))
    }

    const decoded = await jwt.verify(token , process.env.JWT_SECRET)
    log(decoded)

    next()
})