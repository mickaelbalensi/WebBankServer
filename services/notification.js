const bankAccount2User = require('./loan');
const {getAdmin} = require('./getters');
const User = require('../models/user.model');

async function notify(senderUser, receiverUser, title, amount){
    const notification = {
        from : senderUser.name,
        title : title,
        description : `${senderUser.name} ${title}ed you ${amount} Levcoins`,
        createdAt : new Date()
    }
    receiverUser.notificationList.unshift(notification);

    await User.updateOne(
        {numAccount:receiverUser.numAccount}, 
        {$set : {notificationList: receiverUser.notificationList}},
        (err)=>err && console.log('add notifif eror : ',err)
    ).clone();
}

async function notifyAdminRegister(senderUser){
    const notification = {
        from : senderUser.name,
        title : 'register',
        fromID : senderUser.id,
        description : `${senderUser.name} requests to suscribe`,
        createdAt : new Date()
    }
    const admin = await getAdmin();
    admin.notificationList.unshift(notification);
    await User.updateOne(
        {numAccount:admin.numAccount}, 
        {$set : {notificationList: admin.notificationList}},
        (err)=>err && console.log('add notifif eror : ',err)
    ).clone();
}
async function notifyAdminEmptyAccount(senderUser){
    const notification = {
        from : senderUser.name,
        title : 'Empty Account',
        fromID : senderUser.id,
        description : `The account ${senderUser.numAccount} of ${senderUser.name} decreases to 0`,
        createdAt : new Date()
    }
    const admin = await getAdmin();
    admin.notificationList.unshift(notification);
    await User.updateOne(
        {numAccount:admin.numAccount}, 
        {$set : {notificationList: admin.notificationList}},
        (err)=>err && console.log('add notifif eror : ',err)
    ).clone();
}

module.exports = {
    notify,
    notifyAdminRegister,
    notifyAdminEmptyAccount
};