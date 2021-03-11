import React, { useState, useEffect, useRef } from 'react'
import firebase from "../firebase";
import { useAuth } from '../context/AuthContext';
import styles from "./TempProfile.module.css";


export default function TempProfile() {
    const [profiles, setProfiles] = useState([]);
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const refProfile = firebase.firestore().collection("users").doc(currentUser.uid);
    function getHardcodedEx() {
        setLoading(true);
        const usersProfile = [];
        refProfile.onSnapshot((doc) => {
            usersProfile.push(doc.data());
            setProfiles(usersProfile);
            console.log("Lungimea vectorului este ", usersProfile.length);
            setLoading(false);
        });
    }
    useEffect(() => {
        console.log("Am intrat");
        getHardcodedEx();
    }, []);
    return (
        (
                profiles.map((user) => (
                    <div key={user} className={styles.profileCard}>
                        <p><strong>Nume: </strong>{user.firstName}</p>
                        <p><strong>Prenume: </strong>{user.lastName}</p>
                        <p><strong>Varsta: </strong>{user.age}</p>
                        <p><strong>Adresa: </strong>{user.address}</p>
                    </div>
        ))
        )
            
        
        
    )
}
