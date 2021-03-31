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
        <Navbar collapseOnSelect expand="lg" className={styles.navbar}>
        <Navbar.Brand href="/" className={styles.logoName}>
            Măruleț
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
            <Nav.Link href="#features">Buget</Nav.Link>
            <Nav.Link href="#pricing">Statistici</Nav.Link>
            <NavDropdown title="Management" id="collasible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Facturi</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                Utilaje
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Muncitori</NavDropdown.Item>
                <NavDropdown.Item onClick={handleShow}>Adauga produs</NavDropdown.Item>
                <NavDropdown.Item href="/daunatori">Daunatori</NavDropdown.Item>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header>
                        Adauga produs
                    </Modal.Header>
                    <Modal.Body>
                        <AddProduct />
                    </Modal.Body>
                </Modal>
            </NavDropdown>
            </Nav>
        </Navbar.Collapse>
        </Navbar>
    );
}
