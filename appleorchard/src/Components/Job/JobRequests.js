// GROWER   
import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../../Firebase/context/AuthContext';
import firebase from '../../Firebase/firebase';
import styles from './Style/JobRequests.module.css';

export default function JobRequests() {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const rejectMotivation = useRef();
    const [reqPosts, setReqPosts] = useState([]);
    const salary = useRef(0);
    const [show1, setShow1] = useState(false);
    const handleShow1 = () => setShow1(true);
    const handleClose1 = () => setShow1(false);
    const [show2, setShow2] = useState(false);
    const handleShow2 = () => setShow2(true);
    const handleClose2 = () => setShow2(false);
    const refOnHoldPosts = firebase.firestore().collection("users").doc(currentUser.uid).collection("onHold").where('status', '==', 'In asteptare');

    function getAllRequests() {
        refOnHoldPosts.onSnapshot((querySnapshot) => {
            const reqPost = [];
            querySnapshot.forEach(doc => {
                reqPost.push({reqId: doc.id, ...doc.data()});
            })
            console.log(reqPost);
            setReqPosts(reqPost);
        })
    }


    function handleAccept(e, status, reqId, salary, employeeId) {
        e.preventDefault();
        const refPost = firebase.firestore().collection("users").doc(currentUser.uid).collection("onHold").doc(reqId);
        refPost.update({status: status, salary: salary});
    }

    function handleReject(e, status, reqId, rejectMotivation) {
        e.preventDefault();
        // e, "rejected", p.reqId, rejectMotivation.current.value
        const refPost = firebase.firestore().collection("users").doc(currentUser.uid).collection("onHold").doc(reqId);
        refPost.update({status: status, feedback: rejectMotivation});
    }

    useEffect(() => {
        getAllRequests();
    }, []);
    return (
        <div className={styles.cardContainer}>
            {
                reqPosts.map(p => (
                    <Card key={p.reqId} className={styles.reqCard}>
                        <Card.Header style={{color: "#871f08"}}><strong>{p.postName}</strong></Card.Header>
                        <Card.Body>
                            <p><strong>Nume aplicant: </strong>{p.lastName} {p.firstName}</p>
                            <p><strong>Permis de conducere: </strong>{p.driverLicense}</p>
                            <p><strong>Categorii: </strong>{p.categories}</p>
                        </Card.Body>
                        <Card.Footer>
                            <Button className={styles.acceptButton} onClick={handleShow1}><i className="fa fa-check" aria-hidden="true"></i> &nbsp; Accepta</Button>
                            <Modal show={show1} onHide={handleClose1} animation={false}>
                            <Form className={styles.acceptForm}>
                                <Form.Group>
                                    <Form.Label style={{color: "#871f08"}}><strong>Oferta salariala (lei)</strong></Form.Label>
                                    <Form.Control type="text" placeholder="Salariu propus..." ref={salary} required/>
                                    <div className={styles.acceptButtonContainer}>
                                        <Button className={styles.acceptFormButton} onClick={e => {handleAccept(e, "accepted", p.reqId, salary.current.value, p.employeeId); handleClose1();}}>Trimite oferta</Button>
                                    </div>
                                </Form.Group>
                                </Form>
                            </Modal>
                            <Button className={styles.rejectButton} onClick={handleShow2} ><i className="fa fa-window-close" aria-hidden="true"></i> &nbsp; Respinge cerere</Button>
                            <Modal show={show2} onHide={handleClose2} animation={false}>
                                <Form.Group>
                                    <Form.Label>Motivatie respingere</Form.Label>
                                    <Form.Control type="text" placeholder="Feedback..." ref={rejectMotivation} required/>
                                    <Button onClick={e => {handleReject(e, "rejected", p.reqId, rejectMotivation.current.value); handleClose2();}}>Trimite feedback</Button>
                                </Form.Group>
                            </Modal>
                        </Card.Footer>
                    </Card>

                ))
            }
        </div>
    )
}
