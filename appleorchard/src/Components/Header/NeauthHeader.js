import React from 'react'
import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import Nav from 'react-bootstrap/Nav'


export default function NeauthHeader() {
    
    return (
        <div className="d-flex flex-row justify-content-between">
        <Nav defaultActiveKey="/home" as="ul">
            <Nav.Item as="li">
                <Nav.Link href="/home" className={styles.appName}>Măruleț</Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
                <Nav.Link eventKey="link-1" className={styles.linkText}>About us</Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
                <Nav.Link eventKey="link-2" className={styles.linkText}>Contact us</Nav.Link>
            </Nav.Item>
        </Nav>
            <Link to="/login" className={styles.loginLink}><button className={`btn btn-success ${styles.loginButton}`}>Login</button></Link>
        </div>
    )
}