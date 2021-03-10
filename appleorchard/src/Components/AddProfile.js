import React, { useState } from 'react'
import styles from "./AddProfile.module.css";
import firebase from "../firebase";
import { useAuth } from '../context/AuthContext';
import {v4 as uuidv4} from "uuid";

export default function AddProfile() {
    const { currentUser } = useAuth();
    const [profiles, setProfiles] = useState([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState(0);
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setNumberPhone] = useState('');
    // momentan il hardcodez
    const refProfile = firebase.firestore().collection("users").doc("TshiGlPk1zfnxEDUMv0k9va5aqI2").collection("profiles");


    // functia care adauga in baza de date datele despre noul utilizator
    // primeste ca parametru un obiect cu datele necesare
    function addProfile(newProfile) {
        console.log("DA");
        refProfile
            .doc(newProfile.id)
            .set(newProfile)
            .then(() => {
                setProfiles((prev) => [newProfile, ...prev]);
                console.log(profiles);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    return (
        
        <div className={styles.formContainer}>
            <form className={styles.input}>
                <div className="form-group">
                    <label for="lastname"><strong>Nume</strong></label>
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <i className={`fa fa-user ${styles.icons}`}></i>
                        </span>
                        <input  value={lastName} 
                        onChange={(e) => setLastName(e.target.value)}
                        type="text" className="form-control" id="first-name-input" placeholder="Nume..."/>
                    </div>
                </div>
                <div className="form-group">
                    <label for="firstname"><strong>Prenume</strong></label>
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <i className={`fa fa-user ${styles.icons}`}></i>
                        </span>
                        <input value={firstName}  onChange={(e) => setFirstName(e.target.value)} type="text" className="form-control" id="first-name-input" placeholder="Prenume..."/>
                    </div>
                    
                </div>
                <div className="form-group">
                    <label for="age"><strong>Varsta</strong></label>
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <i className={`fa fa-child ${styles.icons}`}></i>
                        </span>
                        <input  value={age}   onChange={(e) => setAge(e.target.age)} type="number" className="form-control" id="first-name-input" placeholder="Varsta..."/>
                    </div>
                </div>
                <div className="form-group">
                    <label for="address"><strong>Adresa</strong></label>
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <i class={`fa fa-address-card ${styles.icons}`} aria-hidden="true"></i>
                        </span>
                        <input value={address} onChange={(e) => setAddress(e.target
                            .value)} type="text" className="form-control" id="first-name-input" placeholder="Adresa..."/>
                    </div>
                </div>
                <div className="form-group">
                    <label for="email"><strong>Email</strong></label>
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <i class={`fa fa-envelope ${styles.icons}`} aria-hidden="true"></i>
                        </span>
                        <input value={email}  onChange={(e) => setEmail(e.target.value)} type="text" className="form-control" id="first-name-input" placeholder="Email..."/>
                    </div>
                </div>
                <div className="form-group">
                    <label for="phone-number"><strong>Nr. Telefon</strong></label>
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <i className={`fa fa-phone ${styles.icons}`} aria-hidden="true"></i>
                        </span>
                        <input  value={phoneNumber}  onChange={(e) => setNumberPhone(e.target.value)} type="text" className="form-control" id="first-name-input" placeholder="Nr. Telefon..."/>
                    </div>
                </div>
                <div className="text-center">
                    <button className={`btn btn-success ${styles.saveDataButton}`}
                        onClick={() => addProfile({firstName, lastName, age, address, email, phoneNumber, id: uuidv4()})}
                    >
                        Salveaza date
                    </button>
                </div>
                
            </form>
        </div>
        
    )
}
