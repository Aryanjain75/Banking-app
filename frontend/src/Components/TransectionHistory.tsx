import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

interface Transaction {
    transectionid: string;
    fromaccount_id: string;
    toaccount_id: string;
    amount: number;
    timedate: string;
}

interface TransactionHistoryProps {
    transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
    const transactionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (transactionRef.current) {
            gsap.from(transactionRef.current, { opacity: 0, duration: 1, y: 20 });
        }
    }, []);

    return (
        <div ref={transactionRef} className="mb-8 shadow-lg rounded-lg overflow-hidden">
            <motion.table
                className="min-w-full bg-white table-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
                    <tr>
                        <th className="py-2 px-4">Transaction ID</th>
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
            </motion.table>
        </div>
    );
};

export default TransactionHistory;
