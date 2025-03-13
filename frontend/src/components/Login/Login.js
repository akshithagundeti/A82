import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { BASE_URL } from '../../App';
import axios from 'axios';
import NavBar from '../NavBar/NavBar';

const Login = ({onLoginOrSignup}) => {
  const navigate = useNavigate();
  const url = `${BASE_URL}/users/login`;
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: ''
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

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);

    // If there are any errors, return false
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    console.log( formData );
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted successfully', formData);
      // Proceed with form submission logic (e.g., API call)
        try{
            const response = await axios.post(url, formData);
            const token = response.data.token;
            localStorage.setItem('token', token);
            localStorage.setItem('email', formData.email );
            localStorage.setItem('userid', response.data.userid );
            localStorage.setItem('toastShown', 'not-shown');
            onLoginOrSignup(); // Call the onLoginOrSignup function passed from the App component
            navigate('/homepage'); // Redirect to homepage after successful signup
        }
        catch( error ){
            let newErrors = {};
            if (error.response && error.response.data) {
                newErrors['password'] = error.response.data.message;
            } else {
                newErrors['password'] = 'An error occurred during signup';
            }
            setErrors(newErrors);
        }
    }
  };

  return (
    <div>
      <NavBar/>
      <div className="login-form-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <div>Login</div>
          <hr />
          
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={errors.email ? 'error login-form' : 'login-form'}
              aria-label="Email"
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
              className={errors.password ? 'error login-form' : 'login-form'}
              aria-label="Password"
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>
          <div>
              {errors.message && <p className='error-text'>{errors.message}</p>}
          </div>

          <div className="form-group">
            <button type="submit" className="login-button">Login</button>
          </div>

          <div>
            Don't have an account? <Link to="/signup" role="menuitem">Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;