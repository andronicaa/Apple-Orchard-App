import React, { useState } from 'react'
import styles from "./Header.module.css";
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../Firebase/context/AuthContext';
import { Link } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import TempProfile from '../Feed/TempProfile';


export default function Header() {
    const{ currentUser, logout } = useAuth();
    const[error, setError] = useState('');
    const history = useHistory();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    async function handleLogout() {
        setError("");

        try {
            await logout();
            history.push("/neauth-home");
        } catch {
            setError("Failed to log out");
        }
    }
    console.log(currentUser);
    return (
        <nav className={`navbar navbar-expand-lg ${styles.header}`}>
            <p className={styles.appName}>Măruleț</p>
            
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                <li className="nav-item active">
                    <a className="nav-link" href="#">
                        {
                            currentUser != null ? 
                            <>
                                <button onClick={handleShow} className={styles.profileButton}>Profil</button>
                                <Modal show={show} onHide={handleClose}>
                                    <Modal.Body>
                                        <TempProfile />
                                    </Modal.Body>
                                </Modal>
                            </>
                            :
                                <p className={styles.linkText}>About Us</p>
                        }
                        
                        <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">
                        {
                            currentUser != null ?
                                <Link to="/orchardinfo" className={styles.linkText}>Livada mea</Link>
                            :
                                <p className={styles.linkText}>Contact us</p>
                        }
                    </a> 
                </li>
                </ul>
            </div>
            {
                currentUser != null?
                    <button onClick={handleLogout} className={`btn btn-success ${styles.loginButton}`}>Logout</button>
                : 
                    <Link to="/login" className={styles.loginLink}><button className={`btn btn-success ${styles.loginButton}`}>Login</button></Link>
            }
            
            
        </nav>
    )
}
