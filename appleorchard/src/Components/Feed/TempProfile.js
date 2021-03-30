import React, { useState, useEffect } from 'react'
import firebase from "../../Firebase/firebase";
import { useAuth } from '../../Firebase/context/AuthContext';
import styles from "./Styles/TempProfile.module.css";
import { Row, Col } from 'reactstrap';
import avatar from "../../Imgs/farmer-avatar.jpg";


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
                    <div className={`card ${styles.cardProfile}`}>
                        <div className={`card-header ${styles.cardHeader}`}>
                            <h4>Profil {user.function}</h4>
                        </div>
                        <div className="card-body">
                            <div className={`text-center ${styles.profileImg}`}>
                                <img src={avatar} alt="Imagine profil utilizator" className={`img-responsive ${styles.fitImage}`} />
                            </div>
                        </div>
                        <div className="card-header">
                            <p>Informatii de contact</p>
                        </div>
                        <ul key={user} className="list-group list-group-flush">
                            <li className="list-group-item"><strong>Nume: </strong>{user.firstName}</li>
                            <li className="list-group-item"><strong>Prenume: </strong>{user.lastName}</li>
                            <li className="list-group-item"><strong>Email: </strong>{user.email}</li>
                            <li className="list-group-item"><strong>Adresa: </strong>{user.address}</li>
                            {/* ar trebui sa fie la profil unele informatii vizibile doar pentru utilizator si nu pentru ceilalti care ii viziteaza profilul */}
                        </ul>
                    </div>
                    
        ))
        )
            
        
        
    )
}
