const express = require('express');
const { getAllTransections, maketransection,gettransections} = require('../controller/transection');
const router = express.Router();
const { adminMiddleware } = require('../middlewares/role');
const {authMiddleware}=require("../middlewares/auth");

router.get('/alltransaction', getAllTransections);
router.post('/transaction/',maketransection)
router.get('/transaction/', gettransections); 

module.exports = router;
