document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent the default form submission

    // Regex patterns for validation
    const patterns = {
        account_name: /^[a-zA-Z\s]+$/, // Only letters and spaces
        branch_name: /^[a-zA-Z\s]+$/,  // Only letters and spaces
        contact_number: /^[0-9]{10}$/, // Only 10-digit numbers
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Email format
    };

    let valid = true;
    const form = e.target;
    const inputs = form.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        const errorElement = document.getElementById(input.id + 'Error');
        const pattern = patterns[input.id];

        if (pattern && !pattern.test(input.value)) {
            valid = false;
            input.style.borderColor = 'red';
            if (errorElement) {
                errorElement.style.display = 'block';
            }
        } else {
            input.style.borderColor = '#ddd';
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }
    });

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;

    if (password !== confirmPassword) {
        valid = false;
        document.getElementById('confirm_password').style.borderColor = 'red';
        const confirmPasswordError = document.getElementById('confirmPasswordError');
        if (confirmPasswordError) {
            confirmPasswordError.style.display = 'block';
        }
    }

    if (!document.getElementById('terms').checked) {
        valid = false;
        document.getElementById('terms').style.borderColor = 'red';
        const termsError = document.getElementById('termsError');
        if (termsError) {
            termsError.style.display = 'block';
        }
    }

    if (!valid) {
        alert('Please fill out all fields correctly.');
        return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        
        if (response.ok) {
            const result = await response.json();
            alert('Registration successful! Account Number: ' + result.account_number);
            window.location.href = "http://localhost:5000/login";
        } else {
            const errorData = await response.json();
            alert('Registration failed: ' + errorData.reason);
        }
    } catch (error) {
        alert('An error occurred. Please try again later.');
    }
});
