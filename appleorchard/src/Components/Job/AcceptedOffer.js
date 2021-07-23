import React, { useState, useEffect } from 'react';
import firebase from '../../Firebase/firebase';
import { useAuth } from '../../Firebase/context/AuthContext';
import { Card, Button, Modal } from 'react-bootstrap';


export default function AcceptedOffer() {
    const { currentUser } = useAuth();
    const [acceptedOffer, setAcceptedOffer] = useState([]);
    const [profile, setProfile] = useState([]);
    const [loading1, setLoading1] = useState(true);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const refAcceptedOffer = firebase.firestore().collection("users").doc(currentUser.uid).collection("onHold").where('status', '==', 'accepted offer');
    function getAcceptedOffer() {
        refAcceptedOffer.onSnapshot(querySnapshot => {
            const items = [];
            querySnapshot.forEach(doc => {
                items.push({id: doc.id, ...doc.data()});
            })
            console.log("sunt: ", items);
            setAcceptedOffer(items);
            setTimeout(function() {
                setLoading(false);
            }, 1000);
        })
    }


    function getProfile(e, employeeId) {
        const refProfile = firebase.firestore().collection("users").doc(employeeId);
        refProfile.onSnapshot(doc => {
            const profileItem = [];
                profileItem.push(doc.data());
            setProfile(profileItem);
            handleShow();
            setTimeout(function() {
                setLoading1(false);
            })
        })
    }
    useEffect(() => {
        getAcceptedOffer();
    }, [])
    return (
        <div>
            {
                loading == false ? 
                (
                    acceptedOffer.map(p => (
                        <Card key={p.id}>
                            <Card.Header>{p.firstName} {p.lastName}</Card.Header>
                            <Card.Body>
                                <p><strong>Post: </strong>{p.postName}</p>
                                <p><strong>Descriere post: </strong>{p.postDescription}</p>
                                <p><strong>Salariu: </strong>{p.salary}</p>
                            </Card.Body>
                            <Card.Footer>
                                <Button onClick={e => getProfile(e, p.employeeId)}>Vezi profil</Button>
                                <Modal show={show} onHide={handleClose} animation={false}>
                                    {
                                        profile.map(i => (
                                            <p>{i.firstName}</p>
                                        ))
                                    }
                                </Modal>
                            </Card.Footer>
                        </Card>
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
