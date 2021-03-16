import React, { useState } from 'react';
import { useAuth } from '../../Firebase/context/AuthContext';
import { useHistory } from 'react-router-dom';
import styles from "./Styles/MainPage.module.css";
import Profile from "../Feed/TempProfile";
import Header from "../Header/Header";


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
        <Header />
        <div className={styles.profileCard}>
        </div>
    </>
    )
}
