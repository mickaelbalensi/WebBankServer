const UserModel = require("../models/user.model");
const { Types } = require("mongoose");
const ObjectID = require("mongoose").Types.ObjectID;

// Get All users

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select();
  res.status(200).json(users);
};

// Find a specific user by id
module.exports.userInfo = (req, res) => {
  console.log(req.params);
  if (!Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("ID unkwnown : " + req.params.id);
  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("ID unknown : " + err);
  }).select();
};

//update soldAccount
module.exports.updateUsers = async (req, res) => {
  if (!Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("ID unkwnown : " + req.params.id);
  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          soldAccount: req.body.soldAccount,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        if (err) return res.status(500).send({ message: err });
      }
    );
  } catch (error) {
    return res.status(500).json({ message: err });
  }
};

module.exports.updateController = async (req,res) => {
  const user = req.user;
  
  UserModel.findByIdAndUpdate(user.id, req.body, function(err) {
    if (err) {
      console.log(err);
    }
  })
  return res.status(200).json({id: user.id, nameConnected: req.user.name});
};

module.exports.updateUser = async(req, res)=>{
  let user = req.user
  let value = req.body

  await UserModel.findByIdAndUpdate(user.id, value , function(err) {
      if (err){
        console.log(err);
        return res.status(400).json();
      }
      }).clone()
  
  return res.status(200).json(
      {
          type:'POST', 
          status: 'success', 
          code: 'OK',
      });
};

module.exports.GetItemController = async(req,res)=>{
  let field = req.body.field;
  let user = req.user;
  let response = {};
  // console.log("controller")

  // console.log(field)
  for(var i = 0; i < field.length; i++){
      response[field[i]]=user[field[i]]
  }
  return res.json(response).status(200);
}

module.exports.bankInfo= async (req, res) => {
  let sum = 0
  let numOfAccount = 0
  let numOfLoan = 0
  let numOfTransaction = 0
  console.log("ici")
  const users = await UserModel.find().select();
  users.forEach(myFunction)
  function myFunction(item) {
    sum += item.soldAccount;
    numOfAccount += 1
    item.loanList.forEach(myFunction2)
    function myFunction2(item2){
      if(item2.status == "loaned")
        numOfLoan +=1
    }
    item.transactionList.forEach(myFunction3)
    function myFunction3(item2){
        numOfTransaction += 1
    }
  }
  console.log(sum);
  // console.log(numOfAccount)
  // console.log(numOfLoan)
  // console.log(numOfTransaction)

  res.status(200).json({sum: sum, numOfAccount: numOfAccount, numOfLoan: numOfLoan, numOfTransaction: numOfTransaction/2} )
}