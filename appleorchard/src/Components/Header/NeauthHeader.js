import React from 'react'
import styles from "./Header.module.css";
import { Link } from "react-router-dom";


export default function NeauthHeader() {
    
    return (
        <nav className={`navbar navbar-expand-lg ${styles.header}`}>
            <p className={styles.appName}>Măruleț</p>
            
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                <li className="nav-item active">
                    <a className="nav-link" href="#About">
                        <p>About Us</p>
                        <span class="sr-only">(current)</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#Contact">
                        <p>Contact us</p>
                    </a> 
                </li>
                </ul>
            </div>
                <Link to="/login" className={styles.loginLink}><button className={`btn btn-success ${styles.loginButton}`}>Login</button></Link>
        </nav>
    )
}