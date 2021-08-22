import React, { useState, useEffect } from 'react'
import styles from "./AuthHeader.module.css";
import firebase from '../../Firebase/firebase';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../Firebase/context/AuthContext';
import { Nav, Navbar, NavDropdown, Button, Modal, Form } from "react-bootstrap";
import men_avatar from '../../Imgs/empl_avatar_boy.png';
import girl_avatar from '../../Imgs/empl_avatar_girl.png';
import UpdateEmployeeProfile from './UpdateEmployeeProfile';

export default function Header() {
    const{ currentUser, logout } = useAuth();
    const[error, setError] = useState('');
    const history = useHistory();
    const [userName, setUserName] = useState('');
    const [profile, setProfile] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => {setShowForm(false); setShow(false)};
    const handleCloseForm = () => setShow(false);
    const refProfile = firebase.firestore().collection("users").doc(currentUser.uid);

    function getUserName() {
        var userName = "";
        refProfile.onSnapshot(doc => {
            userName = doc.data().firstName + " " + doc.data().lastName;
            setUserName(userName);
            setProfile(doc.data());
            console.log("Profilul este: ", doc.data());
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
        <Navbar collapseOnSelect expand="lg"variant="light" className={styles.navbar} >
        <Navbar.Brand href="/" className={styles.linkText}>
            Măruleț
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
                <Nav.Link className={styles.linkText} onClick={e => handleShow()}>Profil</Nav.Link>
                <Nav.Link className={styles.linkText} href="/employee-task">Task</Nav.Link>
                <NavDropdown title={<span style={{color: 'rgb(255, 255, 255)'}}>Anunturi angajare</span>} id="collasible-nav-dropdown">
                <NavDropdown.Item href="/see-posts">Anunturi publicate</NavDropdown.Item>
                <NavDropdown.Item href="/saved-posts">Anunturi salvate</NavDropdown.Item>
                <NavDropdown.Item href="/responses">Oferte angajare</NavDropdown.Item>
            </NavDropdown>
            </Nav>
            <Nav>
                <Nav.Link className={styles.linkText}>Bine ai venit, {userName}</Nav.Link>
                <Button onClick={handleLogout} className={styles.actionButton}>Logout &nbsp; <i className="fa fa-sign-out" aria-hidden="true"></i></Button>
            </Nav>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header>
                    Profil {userName}
                </Modal.Header>
                <Modal.Body>
                    {
                        showForm ?
                            <UpdateEmployeeProfile profile={profile} handleClose={handleClose} />
                        :
                        <>  
                            <div className={styles.imgContainer}>
                                {
                                    profile.sex == 'F' ?
                                        <img src={girl_avatar} alt="Avatar" className={styles.img}/>
                                    :
                                        <img src={men_avatar} alt="Avatar" className={styles.img}/>


                                }
                            </div>
                        {
                        loading == false ?
                        
                            <div>
                            <p><strong>Nume: </strong>{profile.lastName}</p>      
                            <p><strong>Prenume: </strong>{profile.firstName}</p>      
                            <p><strong>Varsta: </strong>{profile.age}</p>      
                            <p><strong>Email: </strong>{profile.email}</p>  
                            <p><strong>Permis de conducere: </strong>{profile.hasDriverLicense}</p>      
                            {
                                profile.hasDriverLicense == 'DA' ?
                                    <p><strong>Categorii permis: </strong>{profile.driverCateg}</p>      
                                :
                                    <div></div>

                            }    
                            </div>
                            
                        :
                        <div></div>
                        }
                        </>
                    
                    }
                    
                </Modal.Body>
                <Modal.Footer>
                    <div className={styles.updateButtonContainer}>
                        {
                            showForm == false ?
                                <Button className={styles.updateButton} onClick={e => setShowForm(!showForm)}>Editează profil</Button>
                            :
                                <div></div>
                        }
                    </div>
                </Modal.Footer>
            </Modal>
        </Navbar.Collapse>
        </Navbar>
    )
}



