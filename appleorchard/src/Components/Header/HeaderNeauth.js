import React from 'react'
import styles from "./Header.module.css";
export default function HeaderNeauth() {
    return (
        <nav className={`navbar navbar-expand-lg ${styles.header}`}>
            <a className={`navbar-brand ${styles.appName}`} href="#">Apple Orchard App</a>
            {/* <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button> */}
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                <li className="nav-item active">
                    <a className="nav-link" href="#">About Us <span class="sr-only">(current)</span></a>
                </li>
                {/* <li class="nav-item">
                    <a class="nav-link" href="#">Features</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Pricing</a>
                </li> */}
                </ul>
            </div>
        </nav>
    )
}
