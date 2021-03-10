import React, { useState, useEffect } from 'react'
import firebase from "../firebase";
import {v4 as uuidv4} from "uuid";
import { useAuth } from '../context/AuthContext';
import styles from "./AddProfile.module.css";
import Modal from 'react-bootstrap/Modal'


export default function TempProfile() {
    const[username, setUsername] = useState([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [age, setAge] = useState(0);
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setNumberPhone] = useState("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();

    const refUser = firebase.firestore().collection("users").doc(currentUser.uid).collection("profiles");
    const refUsername = firebase.firestore().collection("users");
    function addProfile(e, newProfile) {
        e.preventDefault();
        console.log("DA");
        console.log(age);
        console.log(newProfile);
        refUser
            .add(newProfile)
            .catch((err) => {
                console.log(err);
            });
    }


    // ---------------------- EXEMPLU HARDCODAT ---------------------
    function getHardcodedEx() {
        
        setLoading(true);
        const usersProfile = [];
        refUser.onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                usersProfile.push(doc.data());
            });
            setUsers(usersProfile);
            console.log("Lungimea vectorului este ", usersProfile.length);
            setLoading(false);
        });
        
        
    }


    // ------------------------- END EXEMPLU HARDCODAT ------------------------


   
    
    
    useEffect(() => {
        console.log("Am intrat");
        getHardcodedEx();
    }, []);
    return (
        (
            users.length == 1 ?
                <div>
                    <div className="text-center">
                        <button  className="btn btn-info" onClick={handleShow}>Adauga profil</button>
                    </div>
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
                                        <input  value={age}  onChange={(e) => setAge(e.target.value)} type="number" className="form-control" id="first-name-input" placeholder="Varsta..."/>
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
                                        onClick={(e) => addProfile(e, {firstName, lastName, age, address, email, phoneNumber})}
                                    >
                                        Salveaza date
                                    </button>
                                </div>
                                
                            </form>
                        </div>
                </div>
            :
                users.map((user) => (
                    <div key={user}>
                        <p>{user.firstName}</p>
                        <p>{user.age}</p>
                    </div>
        ))
        )
            
        
        
    )
}
