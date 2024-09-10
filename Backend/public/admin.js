document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:5000/api/auth/accounts'; // Replace with your actual API endpoint

    const fetchUserDetails = async () => {
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

            const data = await response.json();
            displayUserDetails(["account_name", "account_number", "account_type", "balance", "branch_name", "email", "status", "userstatus","last_transaction_date", "activated"], data);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const getToken = () => {
        return document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    };

    const displayUserDetails = (columns, data) => {
        const userDetailsDiv = document.getElementById('user-details');
        userDetailsDiv.innerHTML = '';
    
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
    
        // Create table rows for each user
        data.forEach(user => {
            const row = document.createElement('tr');
    
            // Add user details to the row
            row.innerHTML = `
                <td>${user.account_name}</td>
                <td>${user.account_number}</td>
                <td>${user.account_type}</td>
                <td>$${user.balance.toFixed(2)}</td>
                <td>${user.branch_name}</td>
                <td>${user.email}</td>
                <td>${user.status}</td>
                <td>${user.userstatus}</td>
                <td>${user.last_transaction_date}</td>
                <td>${user.activated}</td>
                <td>
                    <button class="update-btn" onclick="showEditForm('${user.account_number}')">Update</button>
                    <button class="delete-btn" onclick="deleteUser('${user.account_number}')">Delete</button>
                </td>
            `;
    
            // Append the row to the table
            table.appendChild(row);
    
            // Add the edit form for the user (initially hidden)
            const editRow = document.createElement('tr');
            // Add labels to the edit form fields
editRow.innerHTML = `
<td colspan="${columns.length + 1}">
<div class="edit-form" id="edit-form-${user.account_number}" style="display: none;">
<h3>Edit User Details</h3>

<label for="edit-account_name-${user.account_number}">Account Name:</label>
<input type="text" id="edit-account_name-${user.account_number}" placeholder="Account Name" value="${user.account_name}">

<label for="edit-account_type-${user.account_number}">Account Type:</label>
<select id="edit-account_type-${user.account_number}">
    <option value="Savings" ${user.account_type === 'Savings' ? 'selected' : ''}>Savings</option>
    <option value="Checking" ${user.account_type === 'Checking' ? 'selected' : ''}>Checking</option>
    <option value="Credit" ${user.account_type === 'Credit' ? 'selected' : ''}>Credit</option>
    <!-- Add other options as needed -->
</select>

<label for="edit-balance-${user.account_number}">Balance:</label>
<input type="number" id="edit-balance-${user.account_number}" placeholder="Balance" value="${user.balance}">

<label for="edit-branch_name-${user.account_number}">Branch Name:</label>
<input type="text" id="edit-branch_name-${user.account_number}" placeholder="Branch Name" value="${user.branch_name}">

<label for="edit-email-${user.account_number}">Email:</label>
<input type="email" id="edit-email-${user.account_number}" placeholder="Email" value="${user.email}">

<label for="edit-status-${user.account_number}">Status:</label>
<select id="edit-status-${user.account_number}">
    <option value="Active" ${user.status === 'Active' ? 'selected' : ''}>Active</option>
    <option value="Inactive" ${user.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
    <option value="Suspended" ${user.status === 'Suspended' ? 'selected' : ''}>Suspended</option>
    <!-- Add other options as needed -->
</select>

<label for="edit-userstatus-${user.account_number}">User Status:</label>
<select id="edit-userstatus-${user.account_number}">
    <option value="Active" ${user.userstatus === 'Active' ? 'selected' : ''}>Active</option>
    <option value="Inactive" ${user.userstatus === 'Inactive' ? 'selected' : ''}>Inactive</option>
    <!-- Add other options as needed -->
</select>

<label for="edit-activate-${user.account_number}">Activated:</label>
<select id="edit-activate-${user.account_number}">
    <option value="true" ${user.activated === true ? 'selected' : ''}>True</option>
    <option value="false" ${user.activated === false ? 'selected' : ''}>False</option>
</select>

<button class="save-btn" onclick="saveUser('${user.account_number}')">Save</button>
<button class="cancel-btn" onclick="hideEditForm('${user.account_number}')">Cancel</button>
</div>
</td>
`;

            // Append the edit form row to the table
            table.appendChild(editRow);
        });
    
        // Append the table to the user details div
        userDetailsDiv.appendChild(table);
    };

    const logout = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/logout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include' // Include cookies in the request
            });

            if (response.ok) {
                window.location.href = 'http://localhost:5000/login'; // Redirect to the login page
            } else {
                throw new Error('Logout failed');
            }
        } catch (error) {
            console.error('There was a problem with the logout operation:', error);
        }
    };

    document.getElementById('logout').addEventListener('click', logout);

    fetchUserDetails();
});

// Show the edit form for a specific user
const showEditForm = (userId) => {
    document.getElementById(`edit-form-${userId}`).style.display = 'block';
};

// Hide the edit form for a specific user
const hideEditForm = (userId) => {
    document.getElementById(`edit-form-${userId}`).style.display = 'none';
};

// Save the updated user details
const saveUser = (userId) => {
    const updatedDetails = {
        account_name: document.getElementById(`edit-account_name-${userId}`).value,
        account_type: document.getElementById(`edit-account_type-${userId}`).value,
        balance: parseFloat(document.getElementById(`edit-balance-${userId}`).value),
        branch_name: document.getElementById(`edit-branch_name-${userId}`).value,
        email: document.getElementById(`edit-email-${userId}`).value,
        status: document.getElementById(`edit-status-${userId}`).value,
        userstatus: document.getElementById(`edit-userstatus-${userId}`).value,
        activated: document.getElementById(`edit-activate-${userId}`).value === 'true'
    };

    fetch(`http://localhost:5000/api/auth/account/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(updatedDetails)
    })
    .then(response => response.json())
    .then(data => {
        alert('User updated successfully!');
        location.reload(); // Reload the page to see the changes
    })
    .catch(error => {
        console.error('There was a problem with the update operation:', error);
    });
};

// Function to delete a user
const deleteUser = (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`http://localhost:5000/api/auth/account/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Account deleted successfully') {
                alert('User deleted successfully!');
                location.reload(); // Reload the page to see the changes
            } else {
                throw new Error('Delete operation failed');
            }
        })
        .catch(error => {
            console.error('There was a problem with the delete operation:', error);
        });
    }
};

const getToken = () => {
    return document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
};
