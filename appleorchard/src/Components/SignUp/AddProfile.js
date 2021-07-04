import React, { useRef } from 'react'
import styles from "./Styles/AddProfile.module.css";
import firebase from "../../Firebase/firebase";
import { useAuth } from '../../Firebase/context/AuthContext';
import { useHistory } from 'react-router-dom';
import { InputGroup, Form } from 'react-bootstrap';
import { jobs } from './UtilityStuff';
import picture from '../../Imgs/profile.png';

export default function AddProfile() {
    const { currentUser } = useAuth();
    const firstName = useRef();
    const lastName = useRef();
    const age = useRef();
    const address = useRef();
    const email = useRef();
    const phoneNumber = useRef();
    const companyName = useRef();
    const job = useRef();
    const history = useHistory();
    var ok = false;
    var refProfile = "";
    while(ok == false)
    {
        while (typeof currentUser == 'undefined')
        {
            ok = false;
        }
        if(typeof currentUser != 'undefined')
        {
            while (typeof currentUser.uid == 'undefined')
            {
                ok = false;
            }
            refProfile = firebase.firestore().collection("users").doc(currentUser.uid);
            ok = true;
        }
        
    }
    
    // functie care adauga un nou profil de utilizator
    function addProfile(e, firstName, lastName, age, address, email, phoneNumber, job) {
        e.preventDefault();
        refProfile
            .set({firstName, lastName, age, email, address, email, phoneNumber, job})
            .catch((err) => {
                console.log(err);
            });
            console.log("S-a facut adaugarea de profil cu succes");
        history.push("/");
    }
    return (
        <>
        {
            (typeof currentUser.uid != 'undefined') ?
            <>
            <h3 className={`text-center ${styles.formTitle}`}>Adauga profil</h3>
            <div className={styles.mainContainer}>
            
            <form className={styles.input}>
            <div className={styles.rowContainer}>
            <div className={styles.flexItem}>
                        
                            <Form.Group className={styles.inputItem}>
                                <Form.Label for="lastname"><strong className={styles.tags}>Name</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependLastName">
                                            <InputGroup.Text>
                                                <i className={`fa fa-user ${styles.icons}`} aria-hidden="true" />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control 
                                            ref={lastName}
                                            type="text"
                                            placeholder="Nume"
                                            aria-describedby="inputGroupPrependLastName"
                                            required
                                        />
                                    </InputGroup>
                            </Form.Group>
                            <Form.Group className={styles.inputItem}>
                                <Form.Label for="firstname"><strong className={styles.tags}>Prenume</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependFirstName">
                                            <InputGroup.Text>
                                                <i className={`fa fa-user ${styles.icons}`} aria-hidden="true" />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control 
                                            ref={firstName}
                                            type="text"
                                            placeholder="Prenume"
                                            aria-describedby="inputGroupPrependFirstName"
                                            required
                                        />
                                    </InputGroup>
                            </Form.Group>
                            <Form.Group className={styles.inputItem}>
                                <Form.Label for="age"><strong className={styles.tags}>Varsta</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependAge">
                                            <InputGroup.Text>
                                                <i className={`fa fa-child ${styles.icons}`} aria-hidden="true" />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control 
                                            ref={age}
                                            type="text"
                                            placeholder="Varsta"
                                            aria-describedby="inputGroupPrependAge"
                                            required
                                        />
                                    </InputGroup>
                            </Form.Group>
                            <Form.Group className={styles.inputItem}>
                                <Form.Label for="address"><strong className={styles.tags}>Adresa</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependAddress">
                                            <InputGroup.Text>
                                                <i class={`fa fa-address-card ${styles.icons}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control 
                                            ref={address}
                                            type="text"
                                            placeholder="Adresa"
                                            aria-describedby="inputGroupPrependAddress"
                                            required
                                        />
                                    </InputGroup>
                            </Form.Group>
                        </div>
                            <div  className={styles.flexItem}>
                            <Form.Group className={styles.inputItem}>
                                <Form.Label for="address"><strong className={styles.tags}>Email</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependEmail">
                                            <InputGroup.Text>
                                                <i class={`fa fa-envelope ${styles.icons}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control 
                                            ref={email}
                                            type="text"
                                            placeholder="Email"
                                            aria-describedby="inputGroupPrependEmail"
                                            required
                                        />
                                    </InputGroup>
                            </Form.Group>
                            <Form.Group className={styles.inputItem}>
                                <Form.Label for="phone-number"><strong className={styles.tags}>Nr. Telefon</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependPhoneNumber">
                                            <InputGroup.Text>
                                                <i className={`fa fa-phone ${styles.icons}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control 
                                            ref={phoneNumber}
                                            type="text"
                                            placeholder="Nr. Telefon"
                                            aria-describedby="inputGroupPrependPhoneNumber"
                                            required
                                        />
                                    </InputGroup>
                            </Form.Group>
                            <Form.Group className={styles.inputItem}>
                                <Form.Label for="company-name"><strong className={styles.tags}>Nume companie</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependCompanyName">
                                            <InputGroup.Text>
                                                <i className={`fa fa-building-o ${styles.icons}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control 
                                            ref={companyName}
                                            type="text"
                                            placeholder="Nume companie"
                                            aria-describedby="inputGroupPrependCompanyName"
                                            required
                                        />
                                    </InputGroup>
                            </Form.Group>
                            <Form.Group className={styles.inputItem}>
                                    <Form.Label for="function"><strong className={styles.tags}>Functie</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependFunction">
                                            <InputGroup.Text>
                                                <i class="fa fa-briefcase" aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control as="select" ref={job} aria-describedby="inputGroupPrependProduct"
                            required>
                                            {
                                                jobs.map((j) => (
                                                    <option key={j}>
                                                        {j}
                                                    </option>
                                                ))
                                            }
                                        </Form.Control>
                                    </InputGroup>
                                </Form.Group>
                                </div>
                                </div>
                            <div className="text-center">
                                <button className={`btn btn-success ${styles.saveDataButton}`}
                                    onClick={(e) => addProfile(e, firstName.current.value, lastName.current.value, age.current.value, address.current.value, email.current.value, phoneNumber.current.value, job.current.value)}
                                >
                                    Salveaza date
                                </button>
                            </div>
                            
                        </form>
        </div>
        </>
        :
            <div></div>
        }
        
        </>
    )
}
