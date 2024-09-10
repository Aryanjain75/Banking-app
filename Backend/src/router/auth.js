const express = require('express');
const { register, login,logout, getAccount, getAllAccounts, updateAccount, deleteAccount ,getAllAccountnumbers} = require('../controller/auth');
const router = express.Router();
const { adminMiddleware } = require('../middlewares/role');
const {authMiddleware}=require("../middlewares/auth");
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

router.get('/accounts', getAllAccounts); // Get all accounts
router.get('/account/',authMiddleware, getAccount); // Get a single account by account_number
router.put('/account/:id',authMiddleware,adminMiddleware, updateAccount); // Update account by account_number
router.delete('/account/:id', deleteAccount); // Delete account by account_number
router.get("/getaccountnumber/",getAllAccountnumbers);
router.get("/getyouraccountnumber/",getAllAccountnumbers);

module.exports = router;
