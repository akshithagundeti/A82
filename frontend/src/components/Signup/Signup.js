import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';
import { BASE_URL } from '../../App';
import axios from 'axios'; // Import Axios
import NavBar from '../NavBar/NavBar';

const Signup = ({onLoginOrSignup}) => {
    const navigate = useNavigate();
    const url = `${BASE_URL}/users/signup`;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: ''
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
        ...prevData,
        [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name) {
        newErrors.name = 'Name is required';
        }

        // Email validation
        if (!formData.email) {
        newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
        }

        // Password validation
        if (!formData.password) {
        newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
        }

        // Confirm Password validation
        if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        }

        // Phone Number validation
        if (!formData.phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Phone number must be 10 digits';
        }

        setErrors(newErrors);

        // If there are any errors, return false
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form submitted successfully', formData);
            // Proceed with form submission logic (e.g., API call)
            axios.post(url, formData)
            .then(response => {
                if( response.data.success ){
                    const token = response.data.token;
                    localStorage.setItem('token', token);
                    localStorage.setItem('email', formData.email );
                    localStorage.setItem('userid', response.data.userid );
                    localStorage.setItem('toastShown', 'not-shown');
                    onLoginOrSignup(); // Call the onLoginOrSignup function passed from the App component
                    navigate('/homepage'); // Redirect to homepage after successful signup
                } else{
                    let newErrors = {};
                    newErrors['email'] = response.data.message;
                    setErrors(newErrors);
                }
            })
            .catch(error => {
                let newErrors = {};
                if (error.response && error.response.data) {
                    newErrors['email'] = error.response.data.message;
                } else {
                    newErrors['messages'] = 'An error occurred during signup. Please try again later';
                }
                setErrors(newErrors);
            });

        }
    };

    return (
        <div>
            <NavBar/>
        <div className="signup-form-container">
        <form className="signup-form" onSubmit={handleSubmit}>
            <div>Sign up</div>
            <hr />
            
            <div className="form-group">
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className={errors.name ? 'error signup-form' : 'signup-form'}
                aria-label="Name"
                required
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

            <div className="form-group">
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={errors.email ? 'error signup-form' : 'signup-form'}
                aria-label="Email"
                required
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div className="form-group">
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={errors.password ? 'error signup-form' : 'signup-form'}
                aria-label="Password"
                required
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            <div className="form-group">
            <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={errors.confirmPassword ? 'error signup-form' : 'signup-form'}
                aria-label="Confirm Password"
                required
            />
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
            </div>

            <div className="form-group">
            <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className={errors.phoneNumber ? 'error signup-form' : 'signup-form'}
                aria-label="Phone Number"
                required
            />
            {errors.phoneNumber && <p className="error-text">{errors.phoneNumber}</p>}
            </div>

            <div className="form-group">
            <button type="submit" className="signup-button">Sign Up</button>
            </div>

            <div>
            Already have an account? <Link to="/login" role="menuitem">Login</Link>
            </div>
        </form>
        </div>
        
        </div>
    );
};

export default Signup;
