import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Firebase/context/AuthContext';
import firebase from '../../Firebase/firebase';
import { Card, Button } from 'react-bootstrap';
import styles from './Style/AcceptedRejected.module.css';
import Tooltip from "@material-ui/core/Tooltip";


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

    function deleteOff(id) {
        const refDelete = firebase.firestore().collection("users").doc(currentUser.uid).collection("onHold");
        refDelete.doc(id).delete().then(() => console.log("Stergerea s-a realizat cu succes")).catch(err => console.log(err));
    }

    useEffect(() => {
        getRejectedOffer();
    }, []);
    return (
        <div className={styles.rejectedCard}>
            {
                rejectedOffer.map(p => (
                    <Card key={p.docId} className={styles.card}>
                        <Card.Header>
                            {p.postName}
                        </Card.Header>
                        <Card.Body>
                            <p>{p.firstName}</p>
                            <p>{p.lastName}</p>
                            <p>{p.postDescription}</p>
                            <p><strong>Ofertă salarială: </strong>{p.salary}</p>
                        </Card.Body>
                        <Card.Footer>
                            <Tooltip
                                title="La apasarea acestui buton se vor sterge toate informatiile aferente acestei cereri"
                            >   
                                <div className={styles.deleteButtonCont}>
                                    <Button className={styles.deleteButton} onClick={() => deleteOff(p.docId)}>Șterge</Button>
                                </div>
                            </Tooltip>
                        </Card.Footer>
                    </Card>
                ))
            }
        </div>
    )
}
