document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:5000/transection/transaction/'; // Replace with your actual API endpoint
    const dropdowndataapi = "http://localhost:5000/api/auth/getaccountnumber/"; // Endpoint to fetch account numbers
    let transactions = [];

    // Function to fetch and display transactions
    const fetchTransactions = async () => {
        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            transactions = await response.json();
            console.log(transactions)
            displayTransactions(["transectionid","fromaccount_id","toaccount_id","amount","timedate"],transactions);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    // Function to get the token from cookies
    const getToken = () => {
        return document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    };

    // Function to display transactions
// Function to display transactions
const displayTransactions = (columns, transactions) => {
const transactionDetailsDiv = document.getElementById('transaction-details');
transactionDetailsDiv.innerHTML = '';

// Create a table structure
const table = document.createElement('table');
table.classList.add('transaction-table');

// Create the table header row
const headerRow = document.createElement('tr');
columns.forEach(column => {
const th = document.createElement('th');
th.textContent = column;
headerRow.appendChild(th);
});
table.appendChild(headerRow);

// Create the table body rows with transaction data
transactions.forEach(transaction => {
const row = document.createElement('tr');

columns.forEach(column => {
    const td = document.createElement('td');
    td.textContent = transaction[column];
    row.appendChild(td);
});

table.appendChild(row);
});

transactionDetailsDiv.appendChild(table);
};

    // Function to fetch account numbers and populate dropdowns
    const fetchAccountNumbers = async () => {
        try {
            const response = await fetch(dropdowndataapi, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch account numbers');
            }

            const accountNumbers = await response.json();
            populateDropdowns(accountNumbers);
        } catch (error) {
            console.error('There was a problem with fetching account numbers:', error);
        }
    };

    // Function to populate dropdowns with account numbers
    const populateDropdowns = (accountNumbers) => {
        const toAccountDropdown = document.getElementById('to-account');

        accountNumbers.forEach(account => {
            console.log(account.account_number);
            
            const optionTo = document.createElement('option');
            optionTo.value = account.account_number;
            optionTo.textContent = account.account_number;

            toAccountDropdown.appendChild(optionTo);
        });
    };

    // Function to make a transaction
    const makeTransaction = async () => {
        const toAccountId = document.getElementById('to-account').value;
        const amount = document.getElementById('amount').value;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({  toaccount_id: toAccountId, amount })
            });

            if (!response.ok) {
                alert('Transaction failed due to low balance');
            }
            if(response.ok){
                const transaction = await response.json();
                alert('Transaction successful!');
            }
            
            displayTransactions();
        } catch (error) {
            console.error('There was a problem with the transaction:', error);
        }
    };

    // Function to handle logout
    const logout = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/logout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (response.ok) {
                window.location.href = 'http://localhost:5000/login';
            } else {
                throw new Error('Logout failed');
            }
        } catch (error) {
            console.error('There was a problem with the logout operation:', error);
        }
    };

    document.getElementById('logout').addEventListener('click', logout);
    document.getElementById('create-transaction').addEventListener('click', makeTransaction);
    
    // Fetch transactions and account numbers on page load
    fetchTransactions();
    fetchAccountNumbers();
});
