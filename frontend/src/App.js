
import './App.css';
import { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import Reports from './components/Reports/Reports';
import Summary from './components/Summary/Summary';

export const FRONTEND_BASE_URL = `http://localhost:8080`;
export const BASE_URL = `http://localhost:3000/api`;

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if there's a token in localStorage
        const token = localStorage.getItem('token');
        if (token) {
            console.log(token)
            setIsLoggedIn( true );
            console.log( isLoggedIn );
            // navigate('/homepage'); // Redirect to homepage after successful signup
        }
    }, []); // Empty dependency array to run only once when component mounts

    const handleSignup = () => {
        setIsLoggedIn(true);
    };

    const handleSignout = () => {
        setIsLoggedIn(false);
    }

    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route
                        path='/dashboard'
                        element={isLoggedIn ? <Dashboard onLogout={handleSignout}/> : <Navigate to="/" />}
                    />
                    <Route 
                        path='/login' 
                        element={ isLoggedIn ? <Dashboard onLogout={handleSignout}/> : <Login onLoginOrSignup={handleSignup} /> } 
                    />
                    <Route 
                        path='*'
                        element={ isLoggedIn ? <Dashboard onLogout={handleSignout}/> : <Signup onLoginOrSignup={handleSignup} />} 
                    />
                    <Route 
                        path='/summary' 
                        element={ isLoggedIn ? <Summary onLogout={handleSignout}/> : <Signup onLoginOrSignup={handleSignup} />}
                    />
                    <Route 
                        path='/reports' 
                        element={ isLoggedIn ? <Reports onLogout={handleSignout}/> : <Signup onLoginOrSignup={handleSignup} />}
                    />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
