 // GSAP animation for form
 gsap.from("form", { 
    duration: 1, 
    scale: 1.2,
    y: -50, 
    opacity: 0, 
    ease: "power2.out" 
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent form submission
    const accountNumber = document.getElementById('account_number');
    const password = document.getElementById('password');
    let valid = true;

    // Regex for validating account number and password

    // Validate Account Number
    if (accountNumber.value.trim()=="") {
        valid = false;
        accountNumber.style.borderColor = 'red';
        document.getElementById('accountNumberError').style.display = 'block';
    } else {
        accountNumber.style.borderColor = '#ddd';
        document.getElementById('accountNumberError').style.display = 'none';
    }

    // Validate Password
    if (password.value.trim()=="") {
        valid = false;
        password.style.borderColor = 'red';
        document.getElementById('passwordError').style.display = 'block';
    } else {
        password.style.borderColor = '#ddd';
        document.getElementById('passwordError').style.display = 'none';
    }

    if (valid) {
        const formData = {
            account_number: accountNumber.value,
            password: password.value
        };

        // Sending data using Fetch API
        fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.flag) {
                alert('Login successful!');
                // Redirect to dashboard or another page
                window.location.href = "http://localhost:5000/entry";
            } else {
                alert('Login failed: ' + data.error);
            }
        })
        .catch(error => {
            alert('An error occurred. Please try again later.');
        });
    } else {
        alert('Please fill out the form correctly.');
    }
});
