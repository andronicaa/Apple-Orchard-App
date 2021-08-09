import React, { useState, useEffect } from 'react'
import styles from "./AuthHeader.module.css";
import firebase from '../../Firebase/firebase';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../Firebase/context/AuthContext';
import { Nav, Navbar, NavDropdown, Button } from "react-bootstrap";


export default function Header() {
    const{ currentUser, logout } = useAuth();
    const[error, setError] = useState('');
    const history = useHistory();
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
                <NavDropdown title={<span style={{color: 'rgb(255, 255, 255)'}}>Anunturi angajare</span>} id="collasible-nav-dropdown">
                <NavDropdown.Item href="/see-posts">Anunturi publicate</NavDropdown.Item>
                <NavDropdown.Item href="/saved-posts">Anunturi salvate</NavDropdown.Item>
                <NavDropdown.Item href="/daunatori">Oferte angajare</NavDropdown.Item>
                <NavDropdown.Item href="/treatment-schedule">Oferte acceptate</NavDropdown.Item>
                <NavDropdown.Item href="/treatment-schedule">Oferte resspinse</NavDropdown.Item>
            </NavDropdown>
            </Nav>
            <Nav>
                <Nav.Link className={styles.linkText}>Bine ai venit, {userName}</Nav.Link>
                <Button onClick={handleLogout} className={styles.actionButton}>Logout</Button>
            </Nav>
        </Navbar.Collapse>
        </Navbar>
    )
}



