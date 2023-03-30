const router = require("express").Router();
const {Authorization, IsManager, TotalBankAccount} = require("../middleware/auth_middleware");
const {RegisterController,LoginController, GetAllInfo, AcceptSuscrib} = require("../controllers/auth.controller");

//auth

router.post("/register",TotalBankAccount, RegisterController);
router.post("/login", LoginController);
router.post("/getallinfo", Authorization, IsManager,GetAllInfo);
router.post("/acceptregister", Authorization, IsManager, TotalBankAccount, AcceptSuscrib);

module.exports = router;