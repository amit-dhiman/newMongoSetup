const libs = require('./queries');
const ERROR = require('../config/responseMsgs').ERROR;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
let nodeMailer = require('nodemailer');
require('dotenv').config()


const accountSid = process.env.accountSid;          // For tiwilio
const authToken = process.env.authToken;
const client = require('twilio')(accountSid, authToken);



const generateAccessToken = async (model, token_data, secret_key) => {
  try {
    console.log('-----------token_data-----------',token_data);

    const gen_token = jwt.sign(token_data,secret_key);
    console.log('------gen_token------',gen_token);

    let update = { accessToken: gen_token };

    if (token_data.deviceToken) {
      update.deviceToken = token_data.deviceToken;
    }
    if (token_data.deviceType) {
      update.deviceType = token_data.deviceType;
    }

    let updatedData= await libs.findAndUpdate(model,{_id:token_data._id},update);
    console.log('-----------updatedData----------',updatedData);
    return updatedData;
  } catch (err) {
    console.log('-------token-----errr',err);
    throw err;
  }
};


const verify_token = (secret_key,model) => {
  return async(req, res, next) => {
    try {
      let token = req.headers.authorization;
      if(!token) return ERROR.TOKEN_REQUIRED(res);
      
      const decoded = jwt.verify(token,secret_key);
      console.log('------decoded-------',decoded);
      if(decoded){
        const findData = await model.findOne({accessToken: token});
        if(findData){
          req.findData = findData;
          next();
        }else{
          return ERROR.UNAUTHORIZED(res)
        }
      }else{ return ERROR.INVALID_TOKEN(res);}
    } catch (err) {
      return ERROR.ERROR_OCCURRED(res,err)
    }
  }
}


const securePassword = async(password )=>{
  try {
    let hash = await bcrypt.hash(password, 10);
    return hash;
  } catch (error) {
    throw error;
  }
}

const compPassword = async (password ,dbPassword)=>{
  try {
    let result = await bcrypt.compare(password, dbPassword);
    return result;
  } catch (err) {
    throw err
  }
}


let sendMail = (otp,email)=>{

  let transport = nodeMailer.createTransport({
  host:"smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth:{
    user:"amitdhiman212001@gmail.com",
    pass: "agbgvwuoetonakyx"
  }  
})

let options ={
  from:"amit.dharmani12@gmail.com",
  // from: email,
  to:"amit.dharmani12@gmail.com",
  subject:"from nodemailer",
  text: `your otp is: ${otp}`
}

transport.sendMail(options, function(err, info){
  if(err){
    console.log('-----email err---------',err)
  }else{
    console.log("email has been sent" + info.response)
  }
})
}


const sendSms = async (number,otp)=>{
  try {
    console.log('-----sendSms----------');
    let result = await client.messages.create({
        body: `Hello, this is a otp ${otp}`,
        from: +12518423377,
        to: number
    })
    .then(message => console.log('Message sent:', message.sid))
    .catch(error => console.error('---Error sending message:--', error));
    
    return result;
  } catch (err) {
    throw err
  }
}








module.exports= { 
  generateAccessToken,
  verify_token, 
  securePassword,
  compPassword, sendMail,sendSms
}
