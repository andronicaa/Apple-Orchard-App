import React, { useState, useEffect } from 'react';
import styles from "./AuthHeader.module.css";
import firebase from '../../Firebase/firebase';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../Firebase/context/AuthContext';
import { Nav, Navbar, Button } from "react-bootstrap";


export default function Grower1() {
    const{ currentUser, logout } = useAuth();
    const history = useHistory();
    const [error, setError] = useState('');
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const refProfile = firebase.firestore().collection("users").doc(currentUser.uid);
    function getUserName() {
        var userName = "";
        refProfile.onSnapshot(doc => {
            userName = doc.data().firstName + " " + doc.data().lastName;
            setUserName(userName);
            setTimeout(function() {
                setLoading(false);
            }, 1000);
        })
        
    }
    async function handleLogout() {
        setError("");

        try {
            await logout();
            // setTimeout
            history.push("/neauth-home");
        } catch {
            setError("Failed to log out");
        }
    }

    useEffect(() => {
        getUserName();
    }, []);
    return (
        <Navbar collapseOnSelect expand="lg"variant="light" className={styles.navbar}>
        <Navbar.Brand href="/" className={styles.linkText}>
            Măruleț
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
                <Nav.Link href="/grower-profile" className={styles.linkText}>Profil</Nav.Link>
                <Nav.Link href="/orchardinfo" className={styles.linkText}>Livada mea</Nav.Link>
                <Nav.Link href="/posts-tab" className={styles.linkText}>Anunturi postate</Nav.Link>
                <Nav.Link href="/forum" className={styles.linkText}>Forum</Nav.Link>
            </Nav>
            <Nav>
                <Nav.Link className={styles.linkText}>Bine ai venit, {userName}</Nav.Link>
                <Button onClick={handleLogout} className={styles.actionButton}>Logout &nbsp; <i className="fa fa-sign-out" aria-hidden="true"></i></Button>
            </Nav>
        </Navbar.Collapse>
        </Navbar>
    )
}
