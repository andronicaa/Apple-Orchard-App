import React, { useState } from 'react'
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import styles from "./Style/OrchardMenu.module.css";
import Modal from 'react-bootstrap/Modal';
import AddProduct from './AddProduct';


export default function OrchardMenu() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
            <NavDropdown title="Management" id="collasible-nav-dropdown" className={styles.linkText}>
                <NavDropdown.Item href="/orchardinfo">Facturi</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                Utilaje
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Muncitori</NavDropdown.Item>
                <NavDropdown.Item onClick={handleShow}>Adauga produs</NavDropdown.Item>
                <NavDropdown.Item href="/daunatori">Daunatori</NavDropdown.Item>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header>
                        <strong>Adauga produs</strong>
                    </Modal.Header>
                    <Modal.Body>
                        <AddProduct handleClose={handleClose}/>
                    </Modal.Body>
                </Modal>
                <NavDropdown.Item href="/treatment-schedule">Program tehnologic</NavDropdown.Item>
            </NavDropdown>
            </Nav>
        </Navbar.Collapse>
        </Navbar>
    );
}
