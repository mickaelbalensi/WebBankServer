const User = require("../models/user.model");
const transfer = require('../services/transfer');
const {notify} = require('../services/notification');
const {
    loanID2Loan,
    updateLoanStatus,
    updateLoanDate,
    updateLoanDuration, 
    updateRefundDate,
    bankAccount2User} = require('../services/loan');
const { updateOne } = require("../models/user.model");

module.exports.TransferController = async (req,res) => {
    const userFrom = req.user;
    const {dest, amount} = req.body;
    const amount2Transfer = eval(amount);
    const destinataire = await User.findOne({numAccount : dest}).clone();
    if (destinataire === null)
        return res.status(404).json({message : 'This user don\'t exists'});
    if (destinataire.numAccount === userFrom.numAccount)
        return res.status(409).json({message : 'You can\'t transfer to yourself'})
    if (await transfer(userFrom, destinataire, amount2Transfer)){
        await notify(userFrom ,destinataire,'transfer', amount);
        return res.status(200).json({message : 'The transfer executed by success'});
    }
    return res.status(409).json({message : 'There are not enough in your bank account'})
}
module.exports.BorrowRequestController = async (req,res) =>{
    const borrower = req.user;
    const {numAccount, amountLoan} = req.body;

    const lender = await User.findOne({numAccount : numAccount});
    if (lender.numAccount === borrower.numAccount)
        return res.status(409).json({message : 'You can\'t borrow yourself'})
    
    if (borrower.soldAccount < 2 * amountLoan)
        return res.status(409).json({message : 'You can\'t request amount more than 50% of your sold account'});
    
    if (lender === null)
        return res.status(409).json({message : 'This number doesn\'t associted with any account' });
        
    const dateRequest = new Date();
    const loan = {
        id : Date.now().toString(36),
        borrowerAccount : borrower.numAccount,
        lenderAccount : numAccount,
        amount : amountLoan,
        dateRequest : dateRequest
    }

    let loanListBorrower = borrower.loanList;
    let loanListLender = lender.loanList;
    loanListBorrower.push(loan);
    loanListLender.push(loan);

    await User.updateOne({numAccount: borrower.numAccount}, {loanList: loanListBorrower}, function(err) {
        if (err) {
          console.log(err);
        }
    }).clone();

    await User.updateOne({numAccount: lender.numAccount},{loanList:loanListLender}, function(err) {
        if (err) {
          console.log(err);
        }
    }).clone();
    await notify(borrower, lender,'borrow', amountLoan);
    res.status(200).json({message:'The borrow request sended with success'});
}
module.exports.LoanController = async(req,res)=>{
    const {accept, loanID, duration} = req.body;
    const lender = req.user;
    const loan = loanID2Loan(lender, loanID);
    let status = accept === 'decline' ? 'declined':
                   loan.amount > 0.6 * lender.soldAccount ? 'refused' : 'accepted';
    
    // update status loan request for lender 
    await updateLoanStatus(lender,loanID, status);

    // update status loan request for borrower 
    const borrower = await bankAccount2User(loan.borrowerAccount);
    await updateLoanStatus(borrower, loanID, status);
    if (status === 'declined')
        return res.status(200).json({message : `The loan request ${loanID} is ${status}`})     

    if (status !== 'accepted')
        return res.status(409).json({message : `The loan request ${loanID} is ${status} because you can\'t loan more than 60% of your sold account`})     
    amount = loan.amount;
    await transfer(lender, borrower, amount);
    status = 'loaned';
    await updateLoanStatus(lender,loanID, status);
    await updateLoanStatus(borrower, loanID, status);
    await updateLoanDate(borrower, loanID, new Date());
    await updateLoanDate(borrower, loanID, new Date());
    await updateLoanDuration(borrower, loanID, duration);
    await updateLoanDuration(borrower, loanID, duration);

    await notify(lender, borrower,'loan', amount);
    return res.status(200).json({message : `The loan request ${loanID} is ${status}`})
}

module.exports.RefundController = async(req,res)=>{

    const loanId = req.body.id; 
    const borrower = req.user; 

    let loan = loanID2Loan(borrower, loanId);  
    let status = loan.status; 
    // console.log(status)

    let lender = await bankAccount2User(loan.lenderAccount); 
    // console.log(lender)
     
    if (status !== 'loaned') 
        return res.status(401).json({message : `You can't refund this loan`})      
    let amount = loan.amount; 
    await transfer(borrower, lender, amount); 
    status = 'refunded' 
    await updateLoanStatus(lender,loanId, status); 
    await updateLoanStatus(borrower, loanId, status);
    
    await updateRefundDate(lender, loanId, new Date());
    await updateRefundDate(borrower, loanId, new Date());

    await notify(borrower, lender,'refund', amount);
    return res.status(200).json({message: "Refund done"});
};

module.exports.MarkAllAsReadController = async(req,res)=>{
    const user = req.user; 
    const idList = req.body.ids;
    // console.log('idlist',idList);
    user.notificationList.map((notif)=> {notif.isUnRead = idList.includes(notif.id) ? false : true})
    // console.log(user.notificationList);
    await User.updateOne({numAccount: user.numAccount},{notificationList: user.notificationList}, function(err) {
        if (err) {
          console.log(err);
        }
    }).clone();
}