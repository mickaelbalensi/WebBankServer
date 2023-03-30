const User = require("../models/user.model");
const {notifyAdminEmptyAccount} = require('./notification');

async function extractSold(account){
    const customerBank = await User.findOne({numAccount : account}).clone();
    return customerBank.soldAccount;
}

async function checkSold(account,amount){
    const actualSold = await extractSold(account);
    return  actualSold > amount ? 1 :
            actualSold < amount ? -1 : 0
}

async function updateSold(account,amount){
    await User.updateOne({numAccount:account}, {soldAccount :amount}, function(err) {
        if (err) {
          console.log(err);
        }
    }).clone()
    return;
}

async function addTransaction(bankCustomer,amount, from, creditBool){
    let transaction = {
        date : new Date(),
        acutalAmount :bankCustomer.soldAccount,
        bankCustomer :from.name,
    }   

    if(creditBool) {
        transaction.credit = amount;
        // atansion g douyer en sommant le amount
        transaction.acutalAmount += amount;
    }
    else{
        // atansion g douyer en enlvant le amount
        transaction.debit = amount;
        transaction.acutalAmount -= amount;

    }
        
    let transactionList = bankCustomer.transactionList;
    transactionList.push(transaction);
    await User.updateOne(
        {numAccount:bankCustomer.numAccount}, 
        {$set : {transactionList:transactionList}},
        function(err) {
            if (err) {
              console.log(err);
            }
        }).clone()    
}

async function transfer(from,to,amount){
    let soldeOk = await checkSold(from.numAccount,amount);
    if (soldeOk === -1)
        return false
    let extractFrom = await extractSold(from.numAccount);
    const soldFrom = parseInt(extractFrom) - amount;
    await updateSold(from.numAccount,soldFrom);

    let extractTo = await extractSold(to.numAccount);
    const soldTo = parseInt(extractTo) + parseInt(amount);
    await updateSold(to.numAccount,soldTo)

    await addTransaction(from,amount,to,false);
    await addTransaction(to,amount,from,true);

    if (soldeOk === 0)
        await notifyAdminEmptyAccount(from)
    return true
}

module.exports = transfer;