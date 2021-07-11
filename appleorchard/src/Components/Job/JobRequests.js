// GROWER   
import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../../Firebase/context/AuthContext';
import firebase from '../../Firebase/firebase';

export default function JobRequests() {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
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

    function handleRequest(e, reqStatus, reqId, salary, employeeId) {
        e.preventDefault();
       
        // trebuie luata din aplicatii in asteptare -> stearsa de aici si dusa in acceptate sau respinse
        const refPost = firebase.firestore().collection("users").doc(currentUser.uid).collection("onHold").doc(reqId);
        const response = firebase.firestore().collection("users").doc(employeeId).collection("responses");

        if(reqStatus == 'accepted')
        
            refPost.update({status: reqStatus, salary: salary});
        else
            refPost.update({status: reqStatus})

    }

    useEffect(() => {
        getAllRequests();
    }, []);
    return (
        <div>
            {
                reqPosts.map(p => (
                    <Card key={p.reqId}>
                        <Card.Header>{p.postName}</Card.Header>
                        <Card.Body>
                            <p><strong>Nume aplicant: </strong>{p.lastName} {p.firstName}</p>
                            <p><strong>Permis de conducere: </strong>{p.driverLicense}</p>
                        </Card.Body>
                        <Card.Footer>
                            <Button variant="success" onClick={handleShow1}><i className="fa fa-check" aria-hidden="true"></i> &nbsp; Accepta</Button>
                            <Modal show={show1} onHide={handleClose1} animation={false}>
                            <Form>
                                <Form.Group>
                                    <Form.Label>Oferta salariala</Form.Label>
                                    <Form.Control type="text" placeholder="Salariu propus..." ref={salary} required/>
                                    <Button onClick={e => {handleRequest(e, "accepted", p.reqId, salary.current.value, p.employeeId); handleClose1();}}>Trimite oferta</Button>
                                </Form.Group>
                                </Form>
                            </Modal>
                            <Button variant="danger" onClick={handleShow2}><i className="fa fa-window-close" aria-hidden="true"></i> &nbsp; Respinge cerere</Button>
                            <Modal show={show2} onHide={handleClose2} animation={false}>
                                <Button variant="info" onClick={e => {handleRequest(e, "rejected", p.reqId); handleClose2();}}>Trimite feedback</Button>
                            </Modal>
                        </Card.Footer>
                    </Card>

                ))
            }
        </div>
    )
}
