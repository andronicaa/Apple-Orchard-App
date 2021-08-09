import React from 'react'
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import styles from "./Style/OrchardMenu.module.css";


export default function OrchardMenu() {

    return (
        <Navbar collapseOnSelect expand="lg" className={styles.navbar} variant="light">
        <Navbar.Brand href="/" className={styles.linkText}>
            Măruleț
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
            <Nav.Link href="#features" className={styles.linkText}>Buget</Nav.Link>
            <Nav.Link href="/statistics" className={styles.linkText}>Statistici</Nav.Link>
            <NavDropdown title={<span style={{color: 'rgb(255, 255, 255)'}}>Management</span>} id="collasible-nav-dropdown">
                <NavDropdown.Item href="/orchardinfo">Facturi</NavDropdown.Item>
                <NavDropdown.Item href="/daunatori">Daunatori</NavDropdown.Item>
                <NavDropdown.Item href="/treatment-schedule">Program tehnologic</NavDropdown.Item>
                <NavDropdown.Item href="/treatment-schedule">Inventar</NavDropdown.Item>
            </NavDropdown>
            </Nav>
        </Navbar.Collapse>
        </Navbar>
    );
}
