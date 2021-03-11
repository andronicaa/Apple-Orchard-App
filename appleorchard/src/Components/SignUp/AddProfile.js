import React, { useRef } from 'react'
import styles from "./Styles/AddProfile.module.css";
import firebase from "../../Firebase/firebase";
import { useAuth } from '../../Firebase/context/AuthContext';
import { useHistory } from 'react-router-dom';

export default function AddProfile() {
    const { currentUser } = useAuth();
    const firstName = useRef();
    const lastName = useRef();
    const age = useRef();
    const address = useRef();
    const email = useRef();
    const phoneNumber = useRef();
    const history = useHistory();
    const refUser = firebase.firestore().collection("users");
    const refProfile = firebase.firestore().collection("users").doc(currentUser.uid)

    function addUser() {
        console.log("Aici");
        setTimeout(()=> {
            refUser
        
            .add({
                id: currentUser.uid
            })
            .catch((err) => {
                console.log(err);
            });
        }, 3000);
        
    }
    // functie care adauga un nou profil de utilizator
    function addProfile(e, firstName, lastName, age, address, email, phoneNumber) {
        e.preventDefault();
        addUser();
        refProfile
            .set({firstName, lastName, age, email, address, email, phoneNumber})
            .catch((err) => {
                console.log(err);
            });
        history.push("/");
    }
    return (
        <div className={`${styles.mainContainer}`}>
                <div className={styles.formContainer}>
                    <h3 className={`text-center ${styles.formTitle}`}>Adauga profil</h3>
                    <form className={styles.input}>
                        <div className="form-group">
                            <label for="lastname"><strong>Nume</strong></label>
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <i className={`fa fa-user ${styles.icons}`}></i>
                                </span>
                                <input  ref={lastName}
                                type="text" className="form-control" id="first-name-input" placeholder="Nume..."/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label for="firstname"><strong>Prenume</strong></label>
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <i className={`fa fa-user ${styles.icons}`}></i>
                                </span>
                                <input ref={firstName} type="text" className="form-control" id="first-name-input" placeholder="Prenume..."/>
                            </div>
                            
                        </div>
                        <div className="form-group">
                            <label for="age"><strong>Varsta</strong></label>
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <i className={`fa fa-child ${styles.icons}`}></i>
                                </span>
                                <input  ref={age} type="number" className="form-control" id="first-name-input" placeholder="Varsta..."/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label for="address"><strong>Adresa</strong></label>
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <i class={`fa fa-address-card ${styles.icons}`} aria-hidden="true"></i>
                                </span>
                                <input ref={address} type="text" className="form-control" id="first-name-input" placeholder="Adresa..."/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label for="email"><strong>Email</strong></label>
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <i class={`fa fa-envelope ${styles.icons}`} aria-hidden="true"></i>
                                </span>
                                <input ref={email} type="text" className="form-control" id="first-name-input" placeholder="Email..."/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label for="phone-number"><strong>Nr. Telefon</strong></label>
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <i className={`fa fa-phone ${styles.icons}`} aria-hidden="true"></i>
                                </span>
                                <input  ref={phoneNumber} type="text" className="form-control" id="first-name-input" placeholder="Nr. Telefon..."/>
                            </div>
                        </div>
                        <div className="text-center">
                            <button className={`btn btn-success ${styles.saveDataButton}`}
                                onClick={(e) => addProfile(e, firstName.current.value, lastName.current.value, age.current.value, address.current.value, email.current.value, phoneNumber.current.value)}
                            >
                                Salveaza date
                            </button>
                        </div>
                        
                    </form>
                </div>
        </div>         
    )
}
