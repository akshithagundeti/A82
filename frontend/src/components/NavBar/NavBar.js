import React, { useState } from 'react';
import './NavBar.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const NavBar = ({onLogout}) => {
    const navigate = useNavigate();
    const location = useLocation(); // Use useLocation hook instead of global location object
    const token = localStorage.getItem('token');

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const navigateTo = ( path ) => {
        if( token ){
            navigate(path);
        } else{
            alert('Please login to view this page');
        }
    }

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
        onLogout();
    }

    return (
        <nav className="navbar" aria-label="Main Navigation">
        <div className="navbar-container">
            <div className="navbar-logo" style={{cursor:'pointer'}} role="img" aria-label="UNCC Logo">
                <img src="uncc.png" alt="Logo" className="navbar-logo-img"/>
                <span style={{color:'white'}}>UNCC</span>
            </div>
            <div className={isOpen ? 'navbar-menu active' : 'navbar-menu'} aria-expanded={isOpen}>
            <ul className="navbar-items" role="menubar">
                <li role="none" className={`navbar-item ${location.pathname === '/dashboard' ? 'active' : ''} ${location.pathname === '/' ? 'active' : ''}`}><Link to="/dashboard" role="menuitem" aria-current={location.pathname === '/dashboard' ? 'page' : undefined}  onClick={() => navigateTo('/dashboard')}>Home</Link></li>
                <li role="none" className={`navbar-item ${location.pathname === '/summary' ? 'active' : ''}`}><Link to="/summary" role="menuitem" aria-current={location.pathname === '/summary' ? 'page' : undefined}  onClick={() => navigateTo('/summary')}>Summary</Link></li>
                <li role="none" className={`navbar-item ${location.pathname === '/reports' ? 'active' : ''}`}><Link to="/reports" role="menuitem" aria-current={location.pathname === '/reports' ? 'page' : undefined}  onClick={() => navigateTo('/reports')}>Reports</Link></li>
                {token ? 
                <li role="none" className="navbar-item" onClick={handleLogout}><Link to="/login" role="menuitem">Logout</Link></li>
                : <li></li>
                }
            </ul>
            </div>
            <div className="navbar-toggle" onClick={toggleMenu} role="button" aria-label="Toggle Menu" aria-expanded={isOpen}>
            <i className={isOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
            </div>
        </div>
        </nav>
    );
};
export default NavBar;