const router = require("express").Router();
const {Authorization} = require("../middleware/auth_middleware");
const {TransferController,BorrowRequestController,LoanController, RefundController, MarkAllAsReadController} = require("../controllers/bank.controller");

router.post('/transfer',Authorization, TransferController);
router.post('/borrow',Authorization, BorrowRequestController);
router.post('/loan',Authorization, LoanController);
router.post('/refund', Authorization, RefundController);
router.post('/markAllAsRead', Authorization, MarkAllAsReadController);

module.exports = router;