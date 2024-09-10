import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

interface AccountNumber {
    account_number: string;
}

interface TransactionPanelProps {
    onTransactionSubmit: (toAccountId: string, amount: string) => void;
    accountNumbers: AccountNumber[];
}

const TransactionPanel: React.FC<TransactionPanelProps> = ({ onTransactionSubmit, accountNumbers }) => {
    const [toAccountId, setToAccountId] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const transactionFormRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (transactionFormRef.current) {
            gsap.from(transactionFormRef.current, { opacity: 0, duration: 1, x: -20 });
        }
    }, []);

    const handleSubmit = () => {
        onTransactionSubmit(toAccountId, amount);
        setToAccountId('');
        setAmount('');
    };

    return (
        <div ref={transactionFormRef} className="mb-8 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Create Transaction</h3>

            <div className="flex flex-col mb-4">
                <label className="mb-2 font-medium">To Account</label>
                <select
                    value={toAccountId}
                    onChange={(e) => setToAccountId(e.target.value)}
                    className="p-2 border rounded-md"
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
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="p-2 border rounded-md"
                />
            </div>

            <button
                onClick={handleSubmit}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
            >
                Submit Transaction
            </button>
        </div>
    );
};

export default TransactionPanel;
