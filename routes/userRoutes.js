const router = require("express").Router();

const {Authorization} = require("../middleware/auth_middleware");
const userController = require("../controllers/user.controller");
const {GetItemController}  = require("../controllers/user.controller");

// userDisplay
router.get("/",Authorization, userController.getAllUsers);

//choise by id
router.get("/:id", userController.userInfo);

//update
router.post("/updateprofile",Authorization,userController.updateUser);

router.post("/updateUser",Authorization, userController.updateController);

router.post("/getinfo", Authorization, GetItemController);
router.get("/bankinfo", ()=>{console.log('heeere'); return userController.bankInfo});

//export
module.exports = router;
