'use strict';
const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({

  firstName: {type: String, default:null},

  lastName: { type: String, default:null },

  email: { type: String, default:null },

  socialKey: { type: String, default:null },

  mobileNumber: {type: String, default:null },

  password: { type: String, default:null },

  otp: {type: Number, default:null},
  
  accessToken: { type: String, default:null },

  deviceType:{type:String,enum : ["Android","Apple","Windows"], default:"Android"},

  deviceToken: { type: String, default:null },    // token 

  createdAt: { type: Number, default: Date.now(new Date()) },
  isDeleted: { type: Boolean, default: false},
});


module.exports= mongoose.model('users', UsersSchema);


