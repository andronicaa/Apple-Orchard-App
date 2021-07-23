import React, { useState, useEffect } from 'react';
import firebase from '../../../Firebase/firebase';
import { useAuth } from '../../../Firebase/context/AuthContext';



export default function Employer() {
    const { currentUser } = useAuth();
    const [employer, setEmployer] = useState([]);
    const [loading, setLoading] = useState(true);
    const refUsers = firebase.firestore().collection("users");
    const refEmployer = firebase.firestore().collection("users").doc(currentUser.uid).collection("onHold");
    function getEmployer() {
        refUsers.onSnapshot(querySnapshot => {
            const users = [];
            const employer = [];
            querySnapshot.forEach(doc => {
                if(doc.data().job === 'Cultivator')
                    users.push({id: doc.id, ...doc.data()});
            })
            users.map(i => {
                var refEmployer = firebase.firestore().collection("users").doc(i.id).collection("onHold").where('employeeId', '==', currentUser.uid).where('status', '==', 'accepted offer');
                refEmployer.onSnapshot(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        employer.push({employerFirstName: i.firstName, employerLastName: i.lastName, ...doc.data()})
                    })
                })
            
            })
            console.log(employer);
            setEmployer(employer);
            setTimeout(function() {
                setLoading(false);
            }, 1000)
        })
       
    }
  
    useEffect(() => {
        getEmployer();
    }, []);
    return (
        <div>
            {
                loading == false ? 
                (
                    employer.map(p => (
                        <p key={p.postId}>DA</p>
                    ))
                )
                :
                (
                    <div>...loading</div>
                )
            }
        </div>
    )
}
