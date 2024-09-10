const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/connection');
const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const cookieParser = require('cookie-parser');
const { getdata } = require('../utilities/getdata');
const app = express();

app.use(express.json());
app.use(cookieParser());

// Make a Transaction
exports.maketransection = async (req, res) => {
  const { toaccount_id, amount } = req.body;
  console.log( toaccount_id, amount)
  const account_number = req.cookies.accountno;  // Accessing cookie correctly
  console.log(account_number);

  try {
    const timedate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const transectionid = `TX${amount}-${timedate}`;
    const [[{ balance }]] = await db.query("SELECT balance FROM bankaccountsaccounts WHERE account_number = ?", [account_number]);
        if (balance <= 0 || balance < amount) {
      return res.status(400).json({ message: 'Transaction failed due to insufficient funds' });
    }
    const newBalance = Number(balance) - Number(amount);
    console.log(newBalance, timedate, account_number);
    await db.query(
      'UPDATE bankaccountsaccounts SET balance = ?, last_transaction_date = ? WHERE account_number = ?',
      [newBalance, timedate, account_number]
    );
    const [[{ balance: toAccountBalance }]] = await db.query("SELECT balance FROM bankaccountsaccounts WHERE account_number = ?", [toaccount_id]);
    const updatedToAccountBalance = Number(toAccountBalance) + Number(amount);
    await db.query(
      'UPDATE bankaccountsaccounts SET balance = ? WHERE account_number = ?',
      [updatedToAccountBalance, toaccount_id]
    );
    await db.query(
      'INSERT INTO transection (transectionid, fromaccount_id, toaccount_id, amount, timedate) VALUES (?, ?, ?, ?, ?)',
      [transectionid, account_number, toaccount_id, amount, timedate]
    );
    res.status(200).json({ message: 'Transaction successful', transectionid });
  } catch (err) {
    console.error('Transaction error:', err);
    res.status(500).json({ error: 'Transaction failed', reason: err.message });
  }
};
  exports.gettransections = async (req, res) => {
  const account_number = req.cookies.accountno;  // Accessing cookie correctly
  console.log(account_number);
  try {
    const [account] = await db.query('SELECT * FROM transection WHERE fromaccount_id = ? OR toaccount_id = ?', [account_number, account_number]);
    if (account.length === 0) return res.status(404).json({ error: 'No transactions found' });
    res.json(account);
  } catch (err) {
    console.error('Failed to retrieve transactions:', err);
    res.status(500).json({ error: 'Failed to retrieve transactions', reason: err.message });
  }
};
exports.getAllTransections = async (req, res) => {
  try {
    const accounts = await db.query('SELECT * FROM transection');
    
    res.json(accounts);
  } catch (err) {
    console.error('Failed to retrieve all transactions:', err);
    res.status(500).json({ error: 'Failed to retrieve all transactions', reason: err.message });
  }
};
