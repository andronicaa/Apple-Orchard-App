import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Firebase/context/AuthContext';
import firebase from '../../Firebase/firebase';

export default function RejectedOffer() {
    const { currentUser } = useAuth();
    const [rejectedOffer, setRejectedOffer] = useState([]);
    const refRejectedOffer = firebase.firestore().collection("users").doc(currentUser.uid).collection("onHold").where("status", '==', 'rejected offer');
    function getRejectedOffer() {
        refRejectedOffer.onSnapshot(querySnapshot => {
            const items = [];
            querySnapshot.forEach(doc => {
                items.push({docId: doc.id,...doc.data()});
            })
            setRejectedOffer(items);
        })
    }


    useEffect(() => {
        getRejectedOffer();
    }, []);
    return (
        <div>
            {
                rejectedOffer.map(p => (
                    <p key={p.docId}>{p.firstName} : {p.lastName}</p>
                ))
            }
        </div>
    )
}
