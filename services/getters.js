const User = require("../models/user.model");


async function getAdmin(){
    admin = await User.findOne({isAdmin : true});
    return admin;
}
async function getUserById(id){
    user = await User.findById(id);
    return user;
}

module.exports = {
    getAdmin,
    getUserById
};