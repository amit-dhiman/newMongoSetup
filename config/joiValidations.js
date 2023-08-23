const joi = require('joi');

const signupUserValid= async (req,res,next)=>{
    let validation = joi.object({
        firstName: joi.string().optional(),
        lastName: joi.string().optional(),
        password: joi.string().min(6).regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .message('Password must be at least 6 characters, include at least 1 uppercase letter, 1 lowercase letter, 1 Number.and atleast 1 special case').required(),
        email: joi.string().email().required(),
        deviceType: joi.string().valid("Android","Apple","Windows").optional(),
        deviceToken: joi.string().optional(),
    })

    let {error}= validation.validate(req.body);
    if(error){
        console.log('------------joi err-----------',error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}


const loginUserValid= async (req,res,next)=>{
    let validation = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(6).regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .message('Password must be at least 6 characters, include at least 1 uppercase letter, 1 lowercase letter, 1 Number.and atleast 1 special case').required(),
        deviceType: joi.string().valid("Android","Apple","Windows").optional(),
        deviceToken: joi.string().optional(),
    })

    let {error}= validation.validate(req.body);
    if(error){
        console.log('--------joi err-------',error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

const socialloginUserValid= async (req,res,next)=>{
    let validation = joi.object({
        socialKey: joi.string().required(),
        deviceType: joi.string().valid("Android","Apple","Windows").optional(),
        deviceToken: joi.string().optional(),
    })

    let {error}= validation.validate(req.body);
    if(error){
        console.log('--------err-------',error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}


const changePasswordValid= async (req,res,next)=>{
    let validation = joi.object({
        oldPassword: joi.string().required(),
        newPassword: joi.string().min(6).regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .message('Password must be at least 6 characters, include at least 1 uppercase letter, 1 lowercase letter, 1 Number.and atleast 1 special case').required(),
        confirmPassword: joi.string().min(6).regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .message('Password must be at least 6 characters, include at least 1 uppercase letter, 1 lowercase letter, 1 Number.and atleast 1 special case').required(),
        deviceType: joi.string().valid("Android","Apple","Windows").optional(),
        deviceToken: joi.string().optional(),
    })

    let {error}= validation.validate(req.body);
    if(error){
        console.log('--------joi err-------',error);
        return res.status(400).json({error: error.details[0].message});
    }
    next();
}

const editUserValid= async (req,res,next)=>{
    let validation = joi.object({
        firstName: joi.string().optional(),
        lastName: joi.string().optional(),
        deviceType: joi.string().valid("Android","Apple","Windows").optional(),
        deviceToken: joi.string().optional(),
    })

    let {error}= validation.validate(req.body);
    if(error){
        console.log('--------joi err-------',error);
        return res.status(400).json({error: error.details[0].message});
    }
    next();
}


module.exports= { signupUserValid,loginUserValid, changePasswordValid, socialloginUserValid, editUserValid };

