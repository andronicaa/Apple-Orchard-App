import React, { useState } from 'react'
import styles from "./Header.module.css";
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


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
            <a className={`navbar-brand ${styles.appName}`} href="#">Apple Orchard App</a>
            
        </nav>
    )
}
