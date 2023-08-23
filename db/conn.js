const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.mongodbUrl).then(()=>{
    console.log('-------database connected----');
}).catch((err)=>{
    console.log('------db err------',err);
})


