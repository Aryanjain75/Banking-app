/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import { Button, Divider, TextField, Typography, Grid, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { gsap } from 'gsap';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../Contextapis/Creditiontials.tsx'; // Import context

const palette = {
    primary: '#1E90FF',
    secondary: '#FFD700',
    background: '#F5F5F5',
    error: '#FF6347',
    text: '#333333',
};

function Login() {
    const { setValue } = useContext(MyContext); // Access context to set account_number
    const [formData, setFormData] = React.useState({
        account_number: '',
        password: '',
    });

    const [formErrors, setFormErrors] = React.useState({
        account_number: '',
        password: '',
    });

    const [showPassword, setShowPassword] = React.useState(false); // State for password visibility
    const navigate = useNavigate();

    const patterns = {
        password: /.{8,}/,
    };

    const validateForm = () => {
        let errors = {
            account_number: '',
            password: '',
        };

        if (!patterns.password.test(formData.password)) {
            errors.password = 'Password must be at least 8 characters long';
        }

        setFormErrors(errors);

        return Object.values(errors).every((error) => error === '');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post("http://localhost:5000/api/auth/login", formData, {
                    withCredentials: true,
                });
                console.log('Form data:', response);
                if (response.data.message) {
                    alert(`Your account number is ${response.data.message}`);
                    setValue(response.data.accountno);
                    navigate('/Dashboard'); // Redirect to dashboard
                } else {
                    alert(`Server is in Trouble: ${response.data.error}`);
                }
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        }
    };

    // Toggle password visibility
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
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
                    Bank Account Login
                </Typography>
                <Divider variant="middle" style={{ margin: '20px 0', backgroundColor: palette.primary }} />

                <form id="registerForm" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="normal"
                                id="account_number"
                                name="account_number"
                                label={formErrors.account_number || "Account Number"}
                                error={!!formErrors.account_number}
                                value={formData.account_number}
                                onChange={handleInputChange}
                                helperText={formErrors.account_number}
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
                                type={showPassword ? "text" : "password"} // Conditionally change input type
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
                                                onClick={handleClickShowPassword}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" fullWidth variant="contained" color="primary" className="form-field">
                                Login
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </div>
    );
}

export default Login;
