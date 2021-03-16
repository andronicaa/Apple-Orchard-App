import React, { useState } from 'react'
import styles from "./Header.module.css";
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../Firebase/context/AuthContext';
import { Link } from "react-router-dom";


export default function Header() {
    // vreau sa am user-ul curent pentru a-i afisa numele in header
    const{ currentUser, logout } = useAuth();
    const[error, setError] = useState('');
    const history = useHistory();

    async function handleLogout() {
        setError("");

        try {
            await logout();
            history.push("/login");
        } catch {
            setError("Failed to log out");
        }
    }
    return (
        <nav className={`navbar navbar-expand-lg ${styles.header}`}>
            <p className={styles.appName}>Măruleț</p>
            
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                <li className="nav-item active">
                    <a className="nav-link" href="#">
                        {
                            currentUser.uid ? 
                                <Link to="/profile"><p className={styles.linkText}>Profil</p></Link>
                            :
                                <p className={styles.linkText}>About Us</p>
                        }
                        
                        <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">
                        {
                            currentUser.uid ?
                                <p className={styles.linkText}>Livada mea</p>
                            :
                            <p className={styles.linkText}>Contact</p>
                        }
                        </a> 
                </li>
                </ul>
            </div>
            <div>
                <Link to="/login" className={styles.loginLink}><button className={`btn btn-success ${styles.loginButton}`}>Login</button></Link>
            </div>
        </nav>
    )
}
