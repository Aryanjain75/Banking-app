import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Transaction {
    transectionid: string;
    fromaccount_id: string;
    toaccount_id: string;
    amount: number;
    timedate: string;
}

interface AccountNumber {
    account_number: string;
}

const Transaction: React.FC = () => {
    const apiUrl = 'http://localhost:5000/transection/transaction/';
    const dropdowndataapi = "http://localhost:5000/api/auth/getaccountnumber/";
    
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accountNumbers, setAccountNumbers] = useState<AccountNumber[]>([]);
    const [toAccountId, setToAccountId] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    
    const transactionRef = useRef<HTMLDivElement>(null);
    const transactionFormRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        fetchTransactions();
        fetchAccountNumbers();

        // GSAP Animation for transaction table on mount
        if (transactionRef.current) {
            gsap.from(transactionRef.current, { opacity: 0, duration: 1, y: 20 });
        }

        // GSAP Animation for the form
        if (transactionFormRef.current) {
            gsap.from(transactionFormRef.current, { opacity: 0, duration: 1, x: -20 });
        }
    }, []);

    const getToken = (): string => {
        return document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    };
    const fetchTransactions = async () => {
        try {
            const response = await axios.get(apiUrl, {
                withCredentials: true,
              });
            console.log(response);
            setTransactions(response.data);
        } catch (error) {
            console.error('There was a problem fetching transactions:', error);
        }
    };

    const fetchAccountNumbers = async () => {
        try {
            const response = await axios.get(dropdowndataapi, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            setAccountNumbers(response.data);
        } catch (error) {
            console.error('There was a problem fetching account numbers:', error);
        }
    };

    const makeTransaction = async () => {
        try {
            console.log(  toAccountId, amount );
            const response = await axios.post(apiUrl, 
                { toaccount_id: toAccountId, amount }, 
                {
                    withCredentials: true,
                  }
            );
            if (response.status === 200) {
                alert('Transaction successful!');
                fetchTransactions();
            } else {
                alert('Transaction failed due to low balance');
            }
        } catch (error) {
            console.error('There was a problem with the transaction:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/logout', {
                withCredentials: true,
            });
            if (response.status === 200) {
                navigate("/Login"); // Use navigate for redirection
            } else {
                alert('Logout failed');
            }
        } catch (error) {
            console.error('There was a problem with the logout operation:', error);
        }
    };

    return (
        <div className="min-h-screen p-8">
            <motion.h2
                className="text-3xl font-bold text-center mb-8 text-indigo-600"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                Transactions
            </motion.h2>

            {/* Transaction Table */}
            <div  className="mb-8 shadow-lg rounded-lg overflow-hidden">
                <table className="min-w-full bg-white table-auto">
                    <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
                        <tr>
                            <th className="py-2 px-4">Transection ID</th>
                            <th className="py-2 px-4">From Account</th>
                            <th className="py-2 px-4">To Account</th>
                            <th className="py-2 px-4">Amount</th>
                            <th className="py-2 px-4">Date/Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <motion.tr
                                key={transaction.transectionid}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.1 * transactions.indexOf(transaction) }}
                                className="text-gray-700"
                            >
                                <td className="py-2 px-4">{transaction.transectionid}</td>
                                <td className="py-2 px-4">{transaction.fromaccount_id}</td>
                                <td className="py-2 px-4">{transaction.toaccount_id}</td>
                                <td className="py-2 px-4">{transaction.amount}</td>
                                <td className="py-2 px-4">{transaction.timedate}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Transaction Form */}
            <div  className="mb-8 bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Create Transaction</h3>
                <div className="flex flex-col mb-4">
                    <label className="mb-2 font-medium">To Account</label>
                    <select
                        id="to-account"
                        value={toAccountId}
                        onChange={(e) => setToAccountId(e.target.value)}
                        className="p-2 border rounded-md bg-black"
                    >
                        <option value="">Select To Account</option>
                        {accountNumbers.map((account) => (
                            <option key={account.account_number} value={account.account_number}>
                                {account.account_number}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col mb-4">
                    <label className="mb-2 font-medium">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="p-2 border rounded-md"
                    />
                </div>

                <button
                    onClick={makeTransaction}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                >
                    Submit Transaction
                </button>
            </div>

            {/* Logout Button */}
            <button
                id="logout"
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
            >
                Logout
            </button>
        </div>
    );
};

export default Transaction;
