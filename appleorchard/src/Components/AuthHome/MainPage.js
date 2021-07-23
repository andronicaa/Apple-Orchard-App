import React, { useState, useRef, useEffect } from 'react';
import styles from "./Styles/MainPage.module.css";
import firebase from '../../Firebase/firebase';
import { useAuth } from '../../Firebase/context/AuthContext';
import EmployeeHeader from '../Header/EmployeeHeader';
import GrowerHeader from '../Header/GrowerHeader';

export default function MainPage() {
    const{ currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const role = useRef("");
    const refRole = firebase.firestore().collection("userRole").doc(currentUser.uid); 
    function getUserRole() {
        refRole.get()
            .then(doc => {
                if(doc.exists)
                {
                    console.log(doc.data().job);
                    role.current = doc.data().job;
                    setTimeout(function() {
                        setLoading(false);
                    }, 10) 
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
    useEffect(() => {
        getUserRole();
    }, []);

    return (
    <div>
        {
           
            role.current === 'Angajat' ? 
                (
                    <EmployeeHeader />
                ) :
                (
                    <GrowerHeader />
                )  
        }
    </div>
    )
}
