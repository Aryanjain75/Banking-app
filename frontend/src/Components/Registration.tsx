/* eslint-disable no-unused-vars */
import * as React from 'react';
import { Button, Divider, TextField, Typography, Select, MenuItem, InputLabel, FormControl, FormHelperText, Checkbox, FormControlLabel, Grid, IconButton, InputAdornment } from '@mui/material';
import { gsap } from 'gsap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Correct import for navigation
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const palette = {
    primary: '#1E90FF',
    secondary: '#FFD700',
    background: '#F5F5F5',
    error: '#FF6347',
    text: '#333333',
};

export function Registrations() {
    const [formData, setFormData] = React.useState({
        name: '',
        accountType: '',
        balance: '',
        branchName: '',
        contactNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        userStatus: '',
        terms: false,
    });

    const [formErrors, setFormErrors] = React.useState({
        name: '',
        accountType: '',
        balance: '',
        branchName: '',
        contactNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        userStatus: '',
        terms: '',
    });

    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const navigate = useNavigate(); // Hook for navigation

    // Regex patterns
    const patterns = {
        name: /^[a-zA-Z ]+$/,
        contactNumber: /^[0-9]{10}$/,
        email: /\S+@\S+\.\S+/,
        password: /.{8,}/,
    };

    // Validate form fields
    const validateForm = () => {
        let errors = {
            name: '',
            accountType: '',
            balance: '',
            branchName: '',
            contactNumber: '',
            email: '',
            password: '',
            confirmPassword: '',
            userStatus: '',
            terms: '',
        };

        if (!patterns.name.test(formData.name)) {
            errors.name = 'Name must contain only letters and spaces';
        } else if (formData.name.trim() === '') {
            errors.name = 'Name is required';
        } else if (formData.name.length < 3) {
            errors.name = 'Name must be at least 3 characters long';
        }

        if (!formData.accountType) {
            errors.accountType = 'Please select an account type';
        }

        if (Number(formData.balance) <= 0) {
            errors.balance = 'Please enter a valid deposit amount';
        }

        if (formData.branchName.trim() === '') {
            errors.branchName = 'Branch name is required';
        }

        if (!patterns.contactNumber.test(formData.contactNumber)) {
            errors.contactNumber = 'Please enter a valid 10-digit contact number';
        }

        if (!patterns.email.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!patterns.password.test(formData.password)) {
            errors.password = 'Password must be at least 8 characters long';
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.userStatus) {
            errors.userStatus = 'Please select your status';
        }

        if (!formData.terms) {
            errors.terms = 'You must agree to the terms and conditions';
        }

        setFormErrors(errors);

        return Object.values(errors).every((error) => error === '');
    };

    // Handle form field changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post("http://localhost:5000/api/auth/register", formData);
                console.log('Form data:', response);
                if (response.data.message) {
                    alert(`Your account number is ${response.data.account_number}`);
                    navigate("/Login"); // Use navigate for redirection
                } else {
                    alert(`Server is in trouble: ${response.data.error}`);
                }
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        }
    };

    React.useEffect(() => {
        gsap.fromTo('#registerForm', { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1 });
        gsap.fromTo('.form-field', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 1, stagger: 0.2 });
    }, []);

    return (
        <div id="root" className='h-full pt-48 pb-48' style={{
            backgroundImage: 'url("https://th.bing.com/th?id=OIP.LYHzqIMKNO1742iwEkKvfAHaEK&w=333&h=187&c=8&rs=1&qlt=90&o=6&cb=13&dpr=1.3&pid=3.1&rm=2")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
        }}>
            <div style={{ backgroundColor: `rgb(245 245 245 / 60%)`, padding: '2rem', borderRadius: '8px', maxWidth: '600px', margin: 'auto' }}>
                <Typography gutterBottom variant="h4" component="div" align="center" style={{ color: palette.primary }}>
                    Bank Account Registration
                </Typography>
                <Divider variant="middle" style={{ margin: '20px 0', backgroundColor: palette.primary }} />

                <form id="registerForm" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="normal"
                                id="name"
                                name="name"
                                label={formErrors.name || "Full Name"}
                                error={!!formErrors.name}
                                value={formData.name}
                                onChange={handleInputChange}
                                helperText={formErrors.name}
                                className="form-field"
                                variant="outlined"
                                style={{ marginBottom: '16px' }}
                                InputLabelProps={{ style: { color: palette.text } }}
                                inputProps={{ style: { color: palette.text } }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth margin="normal" error={!!formErrors.accountType} className="form-field" variant="outlined">
                                <InputLabel id="account_type" style={{ color: palette.text }}>Account Type</InputLabel>
                                <Select
                                    labelId="account_type"
                                    id="account_type"
                                    name="accountType"
                                    value={formData.accountType}
                                    onChange={handleInputChange}
                                    label="Account Type"
                                    style={{ color: palette.text }}
                                >
                                    <MenuItem value="" disabled>Select Account Type</MenuItem>
                                    <MenuItem value="savings">Savings</MenuItem>
                                    <MenuItem value="current">Current</MenuItem>
                                    <MenuItem value="fixed_deposit">Fixed Deposit</MenuItem>
                                </Select>
                                <FormHelperText style={{ color: palette.error }}>{formErrors.accountType}</FormHelperText>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="normal"
                                type="number"
                                id="balance"
                                name="balance"
                                label={formErrors.balance || "Initial Deposit"}
                                error={!!formErrors.balance}
                                value={formData.balance}
                                onChange={handleInputChange}
                                helperText={formErrors.balance}
                                className="form-field"
                                variant="outlined"
                                style={{ marginBottom: '16px' }}
                                InputLabelProps={{ style: { color: palette.text } }}
                                inputProps={{ style: { color: palette.text } }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="normal"
                                id="branch_name"
                                name="branchName"
                                label={formErrors.branchName || "Branch Name"}
                                error={!!formErrors.branchName}
                                value={formData.branchName}
                                onChange={handleInputChange}
                                helperText={formErrors.branchName}
                                className="form-field"
                                variant="outlined"
                                style={{ marginBottom: '16px' }}
                                InputLabelProps={{ style: { color: palette.text } }}
                                inputProps={{ style: { color: palette.text } }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="normal"
                                type="tel"
                                id="contact_number"
                                name="contactNumber"
                                label={formErrors.contactNumber || "Contact Number"}
                                error={!!formErrors.contactNumber}
                                value={formData.contactNumber}
                                onChange={handleInputChange}
                                helperText={formErrors.contactNumber}
                                className="form-field"
                                variant="outlined"
                                style={{ marginBottom: '16px' }}
                                InputLabelProps={{ style: { color: palette.text } }}
                                inputProps={{ style: { color: palette.text } }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="normal"
                                type="email"
                                id="email"
                                name="email"
                                label={formErrors.email || "Email Address"}
                                error={!!formErrors.email}
                                value={formData.email}
                                onChange={handleInputChange}
                                helperText={formErrors.email}
                                className="form-field"
                                variant="outlined"
                                style={{ marginBottom: '16px' }}
                                InputLabelProps={{ style: { color: palette.text } }}
                                inputProps={{ style: { color: palette.text } }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="normal"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                label={formErrors.password || "Password"}
                                error={!!formErrors.password}
                                value={formData.password}
                                onChange={handleInputChange}
                                helperText={formErrors.password}
                                className="form-field"
                                variant="outlined"
                                style={{ marginBottom: '16px' }}
                                InputLabelProps={{ style: { color: palette.text } }}
                                inputProps={{ style: { color: palette.text } }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="normal"
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirm_password"
                                name="confirmPassword"
                                label={formErrors.confirmPassword || "Confirm Password"}
                                error={!!formErrors.confirmPassword}
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                helperText={formErrors.confirmPassword}
                                className="form-field"
                                variant="outlined"
                                style={{ marginBottom: '16px' }}
                                InputLabelProps={{ style: { color: palette.text } }}
                                inputProps={{ style: { color: palette.text } }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth margin="normal" error={!!formErrors.userStatus} className="form-field" variant="outlined">
                                <InputLabel id="user_status" style={{ color: palette.text }}>User Status</InputLabel>
                                <Select
                                    labelId="user_status"
                                    id="user_status"
                                    name="userStatus"
                                    value={formData.userStatus}
                                    onChange={handleInputChange}
                                    label="User Status"
                                    style={{ color: palette.text }}
                                >
                                    <MenuItem value="" disabled>Select Status</MenuItem>
                                    <MenuItem value="Admin">Employee</MenuItem>
                                    <MenuItem value="user">Customer</MenuItem>
                                </Select>
                                <FormHelperText style={{ color: palette.error }}>{formErrors.userStatus}</FormHelperText>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.terms}
                                        onChange={handleInputChange}
                                        name="terms"
                                        color="primary"
                                    />
                                }
                                label={<span>I agree to the <a href="#terms" style={{ color: palette.primary }}>terms and conditions</a></span>}
                                style={{ color: palette.text }}
                            />
                            {formErrors.terms && <Typography color="error">{formErrors.terms}</Typography>}
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                style={{ marginTop: '16px' }}
                            >
                                Register
                            </Button>
                        </Grid>
                    </Grid>
                    Already Registered?<Link to="http://localhost:5173/Login">Login</Link>
                </form>
            </div>
        </div>
    );
}
