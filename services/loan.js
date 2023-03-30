const User = require("../models/user.model");

function loanID2Loan(customerBank, loanID){
    const [loan] = customerBank.loanList.filter((loan)=> loan.id === loanID);
    return loan;
}
async function bankAccount2User(bankAccount){
    customerBank = await User.findOne({numAccount : bankAccount});
    return customerBank;
}
async function updateLoanStatus(customerBank,loanID,status){
    customerBank.loanList.map((loan)=> {loan.id === loanID && (loan.status = status)});     
    await User.updateOne({numAccount: customerBank.numAccount},{$set : {loanList:customerBank.loanList}},function(err) {
        if (err) 
            console.log(err);
    }).clone();
}
async function updateLoanDate(customerBank,loanID,dateLoan){  
    customerBank.loanList.map((loan)=> {loan.id === loanID && (loan.dateLoan = dateLoan)});       
    await User.updateOne({numAccount: customerBank.numAccount},{$set : {loanList:customerBank.loanList}},function(err) {  
        if (err)   
            console.log(err);  
    }).clone();  
} 
 
async function updateLoanDuration(customerBank,loanID,duration){  
    customerBank.loanList.map((loan)=> {loan.id === loanID && (loan.duration = duration)});       
    await User.updateOne({numAccount: customerBank.numAccount},{$set : {loanList:customerBank.loanList}},function(err) {  
        if (err)   
            console.log(err);  
    }).clone();  
}
async function updateRefundDate(customerBank,loanID,dateRefund){ 
    customerBank.loanList.map((loan)=> {loan.id === loanID && (loan.dateRefund = dateRefund)});      
    await User.updateOne({numAccount: customerBank.numAccount},{$set : {loanList:customerBank.loanList}},function(err) { 
        if (err)  
            console.log(err); 
    }).clone(); 
}



module.exports = {
    loanID2Loan, 
    updateLoanDate, 
    updateLoanDuration, 
    updateLoanStatus, 
    updateRefundDate,
    bankAccount2User};