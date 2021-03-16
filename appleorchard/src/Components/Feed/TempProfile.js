import React, { useState, useEffect } from 'react'
import firebase from "../../Firebase/firebase";
import { useAuth } from '../../Firebase/context/AuthContext';
import styles from "./Styles/TempProfile.module.css";
import { Row, Col } from 'reactstrap';
import img from "../../Imgs/main-page-photo.jpg";


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
                    <Row className={styles.profileContainer}>
                        <Col xs={7} className={styles.colContainer}>
                            <div className="text-center">
                                <img src={img} alt="Imagine reprezentativa"/>
                            </div>
                        </Col>
                        <Col xs={4} className={styles.colContainer}>
                            <div key={user} className={styles.profileCard}>
                                <p><strong>Nume: </strong>{user.firstName}</p>
                                <p><strong>Prenume: </strong>{user.lastName}</p>
                                <p><strong>Varsta: </strong>{user.age}</p>
                                <p><strong>Adresa: </strong>{user.address}</p>
                            </div>
                        </Col>
                        
                    </Row>
                    
        ))
        )
            
        
        
    )
}
