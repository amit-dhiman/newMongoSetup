
const saveData = async (model, data) => {
    try {
        let saveData = await model.create(data);
        return saveData;
    } catch (err) {
        throw err;
    }
}


const findAndUpdate = async (model,query,update) => {
    console.log('---------model,query,update,options------------',model,query,update);
    try {
        const user = await model.findOneAndUpdate(query,update,{new:true}).lean();
        return user;
    } catch (err) {
        throw err;
    }
}



const getData = async (model, query,projection,options) => {
    try {
        let getData= await model.findOne(query,projection,options).lean();
        return getData;
    } catch (err) {
        throw err;
    }
}

const checkEmail = async (model, email,projection,options) => {
    try {
        let getData= await model.findOne({email:email.toLowerCase()},projection,options).lean();
        return getData;
    } catch (err) {
        throw err;
    }
}

const updateOneData = async (model, query, data) => {
    try {
        let updateData = await model.updateOne(query,data).lean();
        console.log('-------updateData-------',updateData);
        return updateData;
    } catch (err) {
        throw err;
    }
}


async function getSkipedData(model, query, projection, options, pagenumber) {
    try {
        let findData = await model.find(query, projection, options).skip(pagenumber).limit(10).sort({createdAt:-1}).lean();
        return resolve(findData);
    } catch (err) {
        return reject(err);
    }
}

async function getDataLimit(model, query, projection, options, limit) {
    try {
        let findData = await model.find(query, projection, options).limit(limit).sort({createdAt:-1}).lean();
        return resolve(findData);
    } catch (err) {
        return reject(err);
    }
}



async function getPopulate(model, query, projection, options,collectionOptions) {
    try {
        let data = await model.find(query, projection, options).populate(collectionOptions).exec();
        return data;
    } catch (err) {
        return reject(err);
    }
}






module.exports={ 
    saveData, getData, checkEmail, updateOneData, findAndUpdate, getDataLimit, getSkipedData, getPopulate, 

};

