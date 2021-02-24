import React from 'react'
import styles from "./Header.module.css";
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';


export default function HeaderNeauth() {
    return (
        <nav className={`navbar navbar-expand-lg ${styles.header}`}>
            <a className={`navbar-brand ${styles.appName}`} href="#"><i className={`fas fa-apple-alt ${styles.appleLogo}`}></i>Măruleț</a>
            
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                <li className="nav-item active">
                    <a className="nav-link" href="#">About Us <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Contact</a>
                </li>
                {/* <li class="nav-item">
                    <a class="nav-link" href="#">Pricing</a>
                </li> */}
                </ul>
            </div>
            <div>
                <Link to="/login">Login</Link>
            </div>
        </nav>
    )
}
