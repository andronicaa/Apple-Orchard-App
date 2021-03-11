import React, { useState } from 'react'
import { Card, Button, Alert } from 'react-bootstrap';
import { useAuth } from './context/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import styles from "./Styles/MainPage.module.css";
import Profile from "./Components/TempProfile";
export default function MainPage() {
    const[error, setError] = useState('');
    const{ currentUser, logout } = useAuth();
    const history = useHistory();

    async function handleLogout() {
        setError("");

        try {
            await logout();
            history.push("/neauth-home");
        } catch {
            setError("Failed to log out");
        }
    }


    return (
    <>
     <div className={styles.profileCard}>
        <Profile />
     </div>
    </>
    )
}
