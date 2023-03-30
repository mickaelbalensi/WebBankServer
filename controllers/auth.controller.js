const User = require("../models/user.model");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
const change = require('../services/webscrappingCurrency');
const {notify,notifyAdminRegister} = require('../services/notification');
const {getUserById} = require('../services/getters');

require("dotenv").config({ path: "./config/.env" });


module.exports.RegisterController = async (req, res) => {
  const exist = await User.findOne({ userName: req.body.userName });

  if (exist !== null)
    return res
      .status(303)
      .json({ userName: "This username already exists" })

  const hashedPassword = await bcrypt.hash(req.body.password,10);
  const user = await User.create({ 
    ...req.body,
    password : hashedPassword,
    firstSoldAccountShekel: parseInt(req.body.amount.replace(',', '')),
  });
  res.status(201).json({ user: user.id });
  await notifyAdminRegister(user);
};

module.exports.LoginController = async (req,res) => { 
  // Checks that the user exist
  const user = await User.findOne({ userName: req.body.userName });
  if (user === null)
    return res
      .status(404)
      .json({ email: "There is no account associated with this email" })

  // Compare password hash
  const passwordMatch = await bcrypt.compare(req.body.password, user.password);
  if (!passwordMatch)
    return res.status(400).json({ password: "The password is invalid" })

  // Create JWT, then return it
  const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, {
    expiresIn: 3600 * 24,
  })
  // if (user.suscribbed === 'true')
  return res
      .status(200)
      .json({
        id: user.id,
        token,
        name: user.name,
        manager: user.isAdmin,
        numAccount:user.numAccount,
        soldAccount: user.soldAccount,
        loanList:user.loanList,
        transactionList:user.transactionList,
        notificationList : user.notificationList
      })
  if (user.suscribbed === 'waiting for acceptance')
      return res.status(409).json({error: 'The inscription is waiting for acceptance'})

}
function calculateRateLevcoin(numAccount){
  return  1-(numAccount / 100)
}
module.exports.AcceptSuscrib = async(req,res)=>{
  let accept = req.body.accept;
  console.log('accept',accept,[accept]);
  let id = req.body.id;
  const user = await getUserById(id);

  if (accept==='false')
     return res.status(201).json({message: `the user ${user.name} is refused`})
  console.log('accept trueeee');
  const numAccount = req.totalCount
  const rateLevcoin = calculateRateLevcoin(numAccount)
  const numOfLevcoin = await change(user.firstSoldAccountShekel, rateLevcoin)

  await User.findByIdAndUpdate(id,{
    suscribbed:'true',
    numAccount : numAccount,
    soldAccount : numOfLevcoin,
    rateLevcoin : rateLevcoin
  }, (err) => console.log('err: ',err)).clone();
  console.log('suscribesd');
  return res.status(200).json({message: `the user ${user.name} is suscribbed`})
}

module.exports.GetAllInfo = async(req,res)=>{
  // console.log('id',req.body.id);
  let user = await getUserById(req.body.id);
  let response = {};
  let field = ['name','firstSoldAccountShekel']
  console.log('field',field);
  for(var i = 0; i < field.length; i++){
      response[field[i]]=user[field[i]]
  }
  return res.json(response).status(200);
}
