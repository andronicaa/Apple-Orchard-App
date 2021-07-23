import React from 'react'
import styles from "./Header.module.css";
import { Nav, Navbar, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';


export default function NeauthHeader() {
    
    return (
        <Navbar collapseOnSelect expand="lg"variant="light" className={styles.navbar}>
        <Navbar.Brand href="/" className={styles.linkText}>
            Măruleț
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
                <Nav.Link href="#about" className={styles.linkText}>Despre noi</Nav.Link>
                <Nav.Link href="#contact" className={styles.linkText}>Contact</Nav.Link>
            </Nav>
            <Nav>
                <Link to="/login"><Button className={styles.actionButton}>Login</Button></Link>
            </Nav>
        </Navbar.Collapse>
        </Navbar>
    )
}