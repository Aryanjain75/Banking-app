document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:5000/api/auth/account'; // Replace with your actual API endpoint

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
            displayUserDetails(data);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const getToken = () => {
        return document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    };

    const displayUserDetails = (data) => {
        const userDetailsDiv = document.getElementById('user-details');
        userDetailsDiv.innerHTML = '';
     
            userDetailsDiv.innerHTML += `
                <div class="user-detail" id="user-${data.account_number}">
                    <strong>Account Name:</strong> <span id="account_name-${data.account_number}">${data.account_name}</span><br>
                    <strong>Account Number:</strong> ${data.account_number}<br>
                    <strong>Account Type:</strong> <span id="account_type-${data.account_number}">${data.account_type}</span><br>
                    <strong>Balance:</strong> <span id="balance-${data.account_number}">${data.balance}</span><br>
                    <strong>Branch Name:</strong> <span id="branch_name-${data.account_number}">${data.branch_name}</span><br>
                    <strong>Email:</strong> <span id="email-${data.account_number}">${data.email}</span><br>
                    <strong>Status:</strong> <span id="status-${data.account_number}">${data.status}</span><br>
                    <strong>User Status:</strong> <span id="userstatus-${data.account_number}">${data.userstatus}</span><br>
                </div>
            `;
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

// Save the updated user details

// Function to delete a user

const getToken = () => {
    return document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
};
