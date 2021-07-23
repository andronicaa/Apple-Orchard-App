import React, { useState, useEffect } from 'react';
import styles from "./Header.module.css";
import firebase from '../../Firebase/firebase';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../Firebase/context/AuthContext';
import { Link } from "react-router-dom";
import { Nav, Modal, Button } from 'react-bootstrap';
import TempProfile from '../Feed/TempProfile';


export default function Grower1() {
    const{ currentUser, logout } = useAuth();
    const[error, setError] = useState('');
    const history = useHistory();
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (eventKey) => {eventKey.preventDefault(); console.log("AM INTRAT AICI")};
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
        <div className="d-flex flex-row justify-content-between">
            <Nav as="ul">
                <Nav.Item as="li">
                    <Nav.Link href="/" className={styles.appName}>Marulet</Nav.Link>
                </Nav.Item>
                <Nav.Item >
                    <Nav.Link diabled={true} onSelect={handleShow} className={styles.linkText}>Profil</Nav.Link>
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Body>
                                <TempProfile />
                            </Modal.Body>
                        </Modal>
                </Nav.Item>
                <Nav.Item as="li">
                    <Nav.Link href="/orchardinfo" className={styles.linkText}>Livada mea</Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                    <Nav.Link href="/posts-tab" className={styles.linkText}>Anunturi postate</Nav.Link>
                </Nav.Item>
            </Nav>
            {
                loading == false ?
                (
                    <p>Bine ai venit, {userName}</p>
                )
                :
                (
                    <div></div>
                )
            }
            {
                currentUser != null?
                    <button onClick={handleLogout} className={`btn btn-success ${styles.loginButton}`}>Logout</button>
                : 
                    <Link to="/login" className={styles.loginLink}><button className={`btn btn-success ${styles.loginButton}`}>Login</button></Link>
            }      
        </div>
    )
}
