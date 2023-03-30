const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema({
    from : { type: String, required: true },
    fromID : { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: {type: Date,required: true},
    isUnRead: {type: Boolean,default : true},
})

const LoanSchema = mongoose.Schema({
  _id: false,
  id: { type: String, required: true },
  borrowerAccount : { type: Number, required: true },
  lenderAccount: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'asked'},
  dateRequest : {type: Date, required: true},
  dateLoan : {type: Date},
  dateRefund : {type: Date},
  duration: {type: Number}
})
const TransactionSchema = mongoose.Schema({
  date  :{type:Date,required:true},
  acutalAmount :{type:Number,required:true},
  credit  :{type:Number},
  debit :{type:Number} , 
  bankCustomer :{type:String,required:true}
})
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLen: 55,
    unique: true,
    trim: true,
  },
  userName: {
    type: String,
    required: true,
    minLength: 3,
    maxLen: 55,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 3,
    maxLen: 55,
    trim: true,
  },
  numAccount : {
    type: Number
  },
  soldAccount: {
    type: Number, default:'0'
  },
  firstSoldAccountShekel: {
    type: Number, required:true
  },
  rateLevcoin : {
    type: Number
  },
  
  suscribbed : {type:String, default: "waiting for acceptance"},
  loanList :  {type:[LoanSchema], default:[]},
  isAdmin : {type: Boolean, default:false},
  transactionList : {type:[TransactionSchema], default:[]},
  notificationList : {type:[NotificationSchema], default:[]},
});

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
