const Model = require("../models/index");
const User = Model.users;

const libs = require('../libs/queries');
const commonFunc = require('../libs/commonFunc');
const ERROR = require('../config/responseMsgs').ERROR;
const SUCCESS = require('../config/responseMsgs').SUCCESS;
require('dotenv').config();
const CONFIG = require('../config/scope');


const signup = async (req, res) => {

  try {
    let { firstName, lastName, email, password, deviceType, deviceToken } = req.body;

    email = email.toLowerCase();
    const checkEmail = await libs.checkEmail(User, email);

    if (checkEmail) return ERROR.EMAIL_ALREADY_EXIST(res);
    // if (checkEmail) return res.status(ERROR.EMAIL_ALREADY_EXIST.statusCode).json(ERROR.EMAIL_ALREADY_EXIST);

    let data = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: await commonFunc.securePassword(password),
    };

    if (deviceType) {
      data.deviceType = deviceType
    }
    if (deviceToken) {
      data.deviceToken = deviceToken
    }

    let saveData = await libs.saveData(User, data);

    let token_info = { _id: saveData._id, email: saveData.email };
    console.log('----------token_info-----------',token_info);

    let token = await commonFunc.generateAccessToken(User, token_info, process.env.user_secretKey);
    return SUCCESS.DEFAULT(res, token)
  } catch (err) {
    console.log('-----er------',err);
    ERROR.ERROR_OCCURRED(res, err);
    // res.status(500).json(err.toString());
  }
};



const userlogin = async (req, res) => {
  try {
    let { email, password } = req.body;

    let data = { email: email.toLowerCase() };

    let getData = await libs.getData(User, data);

    if (!getData) return ERROR.INVALID_EMAIL(res);

    let match = await commonFunc.compPassword(password, getData.password);

    if (!match) return ERROR.WRONG_PASSWORD(res);

    let token_info = { _id: getData._id, email: getData.email };
    console.log('----------token_info-----------',token_info);

    let token = await commonFunc.generateAccessToken(User, token_info, process.env.user_secretKey);

    if (!token) return ERROR.SOMETHING_WENT_WRONG(res);

    return SUCCESS.DEFAULT(res, token);
  } catch (err) {
    ERROR.ERROR_OCCURRED(res, err);
  }
};

const sociallogin = async (req, res) => {
  try {
    let { socialKey } = req.body;

    let data = { socialKey: socialKey };

    let getData = await libs.getData(User, data);
    let token_info = null;

    if (getData) {
      token_info = { _id: getData._id, socialKey: getData.socialKey };

      let token = await commonFunc.generateAccessToken(User, token_info, process.env.user_secretKey);

      SUCCESS.DEFAULT(res, token)
    } else {

      let data = { socialKey: socialKey };

      let saveData = await libs.saveData(User, data);

      token_info = { _id: saveData._id, email: saveData.email, socialKey: saveData.socialKey };

      let token = await commonFunc.generateAccessToken(User, token_info, process.env.user_secretKey);

      return SUCCESS.DEFAULT(res, token);
    }
  } catch (err) {
    ERROR.ERROR_OCCURRED(res, err);
  }
};


const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userData = req.findData;

    if (newPassword != confirmPassword) return res.status(404).json({ message: 'old password and new password doesnt matched' });

    const passwordMatches = await commonFunc.compPassword(oldPassword, userData.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Incorrect old password' });
    }
    let newhashPassword = await commonFunc.securePassword(newPassword);

    let upatedData = await libs.findAndUpdate(User,{_id:userData._id}, { password: newhashPassword });

    res.status(202).json(upatedData);

    // return SUCCESS.DEFAULT(res,upatedData);
  } catch (err) {
    res.status(500).json(err.message);
  }
};


const logout = async (req, res) => {
  try {
    const logoutUser = await libs.updateOneData(User, {_id: req.findData._id},{accessToken: null } );

    return SUCCESS.DEFAULT(res, "User logged out");
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//  --------------get my profile----------

const userProfile = async (req, res) => {
  try {
    // const getProfile = await libs.getData(req.findData,{accessToken:null});

    return SUCCESS.DEFAULT(res, req.findData);
  } catch (err) {
    res.status(500).json(err.message);
  }
};


const editUserProfile = async (req, res) => {
  try {
    const userData = req.findData;

    const { firstName, lastName, deviceType, deviceToken } = req.body;

    let update = {};

    if (firstName) { update.firstName = firstName }
    if (lastName) { update.lastName = lastName }
    if (deviceType) { update.deviceType = deviceType }
    if (deviceToken) { update.deviceToken = deviceToken }

    const editProfile = await libs.findAndUpdate(User,{_id:userData._id}, update);

    // let token_info = { id: editProfile.id, email: editProfile.email, socialKey: editProfile.socialKey };

    // const genToken = await commonFunc.generateAccessToken(editProfile, token_info, process.env.user_secretKey);

    // console.log('---------gentok------------', genToken);

    return SUCCESS.DEFAULT(res, editProfile);
  } catch (err) {
    ERROR.ERROR_OCCURRED(req, err);
  }
};


const forgotPassword = async (req, res) => {
  try {
    let email = req.body.email;
    if (!email) {
      return res.status(400).send("email required")
    }
    const getEmail = await libs.checkEmail(User, email);

    if (getEmail) {
      const otp = Math.floor(100000 + Math.random() * 900000);
      console.log('-------otp------', otp);

      // Sending mail
      commonFunc.sendMail(otp, email);

      const updateData = await libs.findAndUpdate(User, {email: getEmail.email}, { otp: otp });
      console.log('-----------------updateData---------------',updateData);

      return SUCCESS.OTP_SENT(res,updateData.accessToken,"otp sent to the gmaill");
    } else {
      return ERROR.INVALID_EMAIL(res);
    }
  } catch (err) {
    // throw err
    res.status(500).send(err.toString());
  }
};


const numberLogin = async (req, res) => {
  try {
    const mobileNumber = req.body.mobileNumber;

    if (!mobileNumber) return res.status(400).send("mobileNumber is Required");

    const getData = await libs.getData(User, { mobileNumber: mobileNumber });
    const otp = Math.floor(100000 + Math.random() * 900000);

    if (getData) {
      commonFunc.sendSms(`+${mobileNumber}`, otp);

      let updatedData = await libs.findAndUpdate(User,{_id:getData._id}, { otp: otp });

      return SUCCESS.OTP_SENT(res, updatedData.accessToken, "otp sent to the mobile number");
    } else {

      commonFunc.sendSms(`+${mobileNumber}`, otp);

      let data = { mobileNumber: mobileNumber, otp: otp };

      const saveData = await libs.saveData(User, data);

      let token_info = { _id: saveData._id, email: saveData.email, mobileNumber: saveData.mobileNumber };

      let updatedData= await commonFunc.generateAccessToken(User, token_info, process.env.user_secretKey);
      return SUCCESS.OTP_SENT(res,updatedData.accessToken,"otp sent to the mobile number");
    }
  } catch (err) {
    console.log('--------err number login--------',err);
    ERROR.ERROR_OCCURRED(res, err);
  }
};


const verifyOtp = async (req, res) => {
  try {
    const {otp} = req.body;
    const userData = req.findData;
    if (!otp) {
      return res.status(400).send("otp is required");
    }
    
    if (otp == userData.otp) {
      let verified = await libs.findAndUpdate(User, {_id:userData._id}, { otp: null })
      SUCCESS.DEFAULT(res, verified);
    } else {
      ERROR.WRONG_OTP(res);
    }

  } catch (err) {
    res.status(500).json(err.message);
  }
};









module.exports = { signup, userlogin, sociallogin, changePassword, logout, userProfile, editUserProfile, forgotPassword,numberLogin, verifyOtp,  };

