import React, { useRef, useEffect, useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import styles from '../SignUp/Styles/AddProfile.module.css'
import firebase from '../../Firebase/firebase';
import { useAuth } from '../../Firebase/context/AuthContext';

export default function UpdateProfile({handleCloseEdit}) {

    
    const { currentUser } = useAuth();
    // formular pentru modificare profil
    const firstName = useRef();
    const lastName = useRef() ;
    const age = useRef();
    const email = useRef();
    const companyName = useRef();
    const driverCateg = useRef();
    const hasDriverLicense = useRef();
    const job = useRef();
    const phoneNumber = useRef();
    const address = useRef();
    const [p, setProfile] = useState([]);
    const [loading, setLoading] = useState(true);
    const refProfile = firebase.firestore().collection("users").doc(currentUser.uid);

    function getProfile() {
        const items = [];
        refProfile.onSnapshot(doc => {
            items.push(doc.data());
            console.log("Profilul este: ", items);
            setProfile(items);
            setTimeout(function() {
                setLoading(false);
            }, 1000);
        })
    }
    function editProfile(e, lastName, firstName, age, address, email, phoneNumber) {
        e.preventDefault();
        refProfile.update(
            {
                firstName: firstName,
                lastName: lastName, 
                age: age,
                address: address, 
                email: email,
                phoneNumber: phoneNumber
            }
        ).then(() => {console.log("s-a facut update")}).catch(err => console.log(err));
        handleCloseEdit();
    }

    useEffect(() => {
        getProfile();
    }, []);
    // end formular modificare profil
    return (
        <div className={styles.updateContainer}>
            <div className="text-center">
                <h5 style={{color: "#871f08"}}>Editeaza profil</h5>
            </div>
            {
                loading == false ?
                (
                    <Form>
            
                
                <div>
                <Form.Group className={styles.inputItem}>
                <Form.Label htmlFor="lastname"><strong className={styles.tags}>Nume</strong></Form.Label>
                <InputGroup>
                    <InputGroup.Prepend id="inputGroupPrependLastName">
                        <InputGroup.Text>
                            <i className={`fa fa-user ${styles.icons}`} aria-hidden="true" />
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control 
                        ref={lastName}
                        type="text"
                        defaultValue={p[0].lastName}
                        aria-describedby="inputGroupPrependLastName"
                        required
                        className={styles.formInputControl}
                    />
                </InputGroup>
                </Form.Group>
                <Form.Group className={styles.inputItem}>
                <Form.Label htmlFor="firstname"><strong className={styles.tags}>Prenume</strong></Form.Label>
                <InputGroup>
                    <InputGroup.Prepend id="inputGroupPrependFirstName">
                        <InputGroup.Text>
                            <i className={`fa fa-user ${styles.icons}`} aria-hidden="true" />
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control 
                        ref={firstName}
                        type="text"
                        defaultValue={p[0].firstName}
                        aria-describedby="inputGroupPrependFirstName"
                        required
                    />
                </InputGroup>
                </Form.Group>
            <Form.Group className={styles.inputItem}>
            <Form.Label htmlFor="age"><strong className={styles.tags}>Vârsta</strong></Form.Label>
                <InputGroup>
                    <InputGroup.Prepend id="inputGroupPrependAge">
                        <InputGroup.Text>
                            <i className={`fa fa-child ${styles.icons}`} aria-hidden="true" />
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control 
                        ref={age}
                        type="number"
                        min="0"
                        defaultValue={p[0].age}
                        aria-describedby="inputGroupPrependAge"
                        required
                    />
                </InputGroup>
            </Form.Group>
            <Form.Group className={styles.inputItem}>
            <Form.Label htmlFor="address"><strong className={styles.tags}>Adresa</strong></Form.Label>
                <InputGroup>
                    <InputGroup.Prepend id="inputGroupPrependAddress">
                        <InputGroup.Text>
                            <i className={`fa fa-address-card ${styles.icons}`} aria-hidden="true"></i>
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control 
                        ref={address}
                        type="text"
                        defaultValue={p[0].address}
                        aria-describedby="inputGroupPrependAddress"
                        required
                    />
                </InputGroup>
            </Form.Group>
            <Form.Group className={styles.inputItem}>
            <Form.Label htmlFor="address"><strong className={styles.tags}>Email</strong></Form.Label>
                <InputGroup>
                    <InputGroup.Prepend id="inputGroupPrependEmail">
                        <InputGroup.Text>
                            <i className={`fa fa-envelope ${styles.icons}`} aria-hidden="true"></i>
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control 
                        ref={email}
                        type="email"
                        defaultValue={p[0].email}
                        aria-describedby="inputGroupPrependEmail"
                        required
                    />
                </InputGroup>
        </Form.Group>
        <Form.Group className={styles.inputItem}>
            <Form.Label htmlFor="phone-number"><strong className={styles.tags}>Nr. Telefon</strong></Form.Label>
                <InputGroup>
                    <InputGroup.Prepend id="inputGroupPrependPhoneNumber">
                        <InputGroup.Text>
                            <i className={`fa fa-phone ${styles.icons}`} aria-hidden="true"></i>
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control 
                        ref={phoneNumber}
                        type="text"
                        defaultValue={p[0].phoneNumber}
                        aria-describedby="inputGroupPrependPhoneNumber"
                        required
                    />
                </InputGroup>
        </Form.Group>
            </div>
               
            <div className="text-center">
                <Button className={styles.saveEditButton}
                    onClick={e => editProfile(e, lastName.current.value, firstName.current.value, age.current.value, address.current.value, email.current.value, phoneNumber.current.value)}
                >Salveaza</Button>
            </div>
           </Form>
                )
                :
                (
                    <div></div>
                )
            }
            
        </div>
    )
}
