const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/connection');
const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(cookieParser());

exports.register = async (req, res) => {
  const { name, accountType, balance, branchName, password, userStatus, email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const activated = true;
    const opening_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const account_number = `${email.split("@")[0]}${Date.now()}`;
    const accountStatus = "completed";
    await db.query(
      'INSERT INTO bankaccountsaccounts (activated, account_number, account_name, account_type, balance, opening_date, status, branch_name, password, userstatus, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)',
      [activated, account_number, name, accountType, balance, opening_date, accountStatus, branchName, hashedPassword, userStatus, email]
    );

    res.status(201).json({ message: 'User registered successfully!', account_number });
  } catch (err) {
    res.status(500).json({ error: 'User registration failed', reason: err.sqlMessage });
  }
};

exports.login = async (req, res) => {
  const { account_number, password } = req.body;

  try {
    const [user] = await db.query('SELECT * FROM bankaccountsaccounts WHERE account_number = ? AND activated=true', [account_number]);

    if (user.length === 0) {
      return res.status(400).json({ error: 'Invalid account number or password' });
    }

    const validPassword = await bcrypt.compare(password, user[0].password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid account number or password' });
    }

    const token = jwt.sign(
      { id: user[0].id, role: user[0].userstatus },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
    res.cookie('accountno', account_number, { httpOnly: true, maxAge: 3600000 });

    res.json({ message: "Successfully logged in", flag: true,accountno: account_number });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.logout = async (req, res) => {
  try {
    res.cookie('token', undefined, { httpOnly: true, maxAge: 0 });
    res.cookie('accountno', undefined, { httpOnly: true, maxAge: 0 });
    res.status(200).json({ message: "Logout successfully" });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log out', reason: err.message });
  }
};

exports.getAccount = async (req, res) => {
  const account_number = req.cookies.accountno;
  try {
    console.log(account_number);
    const [account] = await db.query('SELECT * FROM bankaccountsaccounts WHERE account_number = ? AND activated=true', [account_number]);
    if (account.length === 0) return res.status(404).json({ error: 'Account not found' });
    res.json(account[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve account' });
  }
};

exports.getAllAccounts = async (req, res) => {
  try {
    const [accounts] = await db.query('SELECT * FROM bankaccountsaccounts');
    res.json(accounts);
    console.log(accounts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve accounts' });
  }
};

exports.getAllAccountnumbers = async (req, res) => {
  try {
    const [accounts] = await db.query('SELECT account_number FROM bankaccountsaccounts');
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve accounts' });
  }
};

exports.updateAccount = async (req, res) => {
  const  account_number  = req.params.id;
  const { account_name, account_type, balance, status, branch_name, userstatus, email, activated } = req.body;

  try {
    if (!account_name || !account_type || balance === undefined || !status || !branch_name || !userstatus || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const [result] = await db.query(
      'UPDATE bankaccountsaccounts SET account_name = ?, account_type = ?, balance = ?, status = ?, branch_name = ?, userstatus = ?, email = ?, activated = ? WHERE account_number = ?',
      [account_name, account_type, balance, status, branch_name, userstatus, email, activated, account_number]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json({ message: 'Account updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update account', reason: err.sqlMessage || err.message });
  }
};

exports.deleteAccount = async (req, res) => {
  const  account_number = req.params.id; // Destructure account_number from req.params
  try {
    if (!account_number) {
      return res.status(400).json({ error: 'Account number is required' });
    }

    // Delete all transactions related to the account
    await db.query('DELETE FROM transection WHERE fromaccount_id = ? OR toaccount_id = ?', [account_number, account_number]);

    // Perform the delete operation on the bankaccounts table
    const result = await db.query('DELETE FROM bankaccountsaccounts WHERE account_number = ?', [account_number]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({ message: 'Account and associated transactions deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to delete account', reason: err.sqlMessage || err.message });
  }
};

