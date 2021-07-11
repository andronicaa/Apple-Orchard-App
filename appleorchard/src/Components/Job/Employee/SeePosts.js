import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Card, Alert, Modal } from 'react-bootstrap';
import styles from '../Style/SeePosts.module.css';
import firebase from '../../../Firebase/firebase';
import { useAuth } from '../../../Firebase/context/AuthContext';
import PostsPage from './PostsPage';
export default function SeePosts() {
    // o sa listez job-urile doar de la agricultorii dintr-o zona selectata
    const location = useRef('');
    const profile = useRef();
    const userDriverCateg = useRef('');
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [searchedLocation, setLocation] = useState('');
    const [postPerUser, setPostPerUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();
    const refUsers = firebase.firestore().collection("users");
    const refProfile = firebase.firestore().collection("users").doc(currentUser.uid);
    function getProfile() {
        refProfile.onSnapshot((doc) => {
            profile.current = doc.data();
            userDriverCateg.current = getDriverCateg(doc.data().catState);
            /*
            console.log("Categoriile userului sunt: ", userDriverCateg.current);
            console.log("Categoriile sunt: ", profile.current);
            // setProfile(localProfile);
            */
        })
    }

    function getDriverCateg(driverArray) {
        // console.log("S-a apelat");
        let driverCateg = "";
        if(driverArray[0] == true)
            driverCateg += "B";
        if(driverArray[1] == true)
            driverCateg += "B1";
        if(driverArray[2] == true)
            driverCateg += "C";
        if(driverArray[3] == true)
            driverCateg += "C1";
        if(driverArray[4] == true)
            driverCateg += "D";
        if(driverArray[5] == true)
            driverCateg += "D1";

        return driverCateg;

    }
    function getAllPosts() {
        refUsers.onSnapshot((querySnapshot) => {
            const growerUser = [];
            querySnapshot.forEach((doc) => {
                // doar cultivatorii pot posta anunturi
                if(doc.data().job === 'Cultivator')
                {
                    growerUser.push(doc.id);
                }

            });
          
        growerUser.map(i => {
            var refPost = firebase.firestore().collection("users").doc(i).collection("jobPosts");
            if(searchedLocation != '')
            {
                var refPostByLoc = refPost.where('location', '==', searchedLocation);
                var refPost = refPostByLoc;
            }
            refPost.onSnapshot((querySnapshot) => {
                const post = [];
                querySnapshot.forEach((doc) => {
                    var driverCateg = getDriverCateg(doc.data().checkedState);
                    console.log("Este: ", driverCateg);
                    post.push({id: i, jobId: doc.id, categories: driverCateg, ...doc.data()});
                })
                setPostPerUser(post);
                setTimeout(function() {
                    setLoading(false);
                }, 1000) 
                console.log(post);

            })

        }
        )
        });
    }
    function applyToJob(e, emplId, growerId, postId, postName, postDescription, categories) {
        e.preventDefault();
        // currentUser.uid, i.id, i.jobId, i.postName, i.description
        console.log(postId, postName);
        // trebuie sa adaug la vectorul de onHold pentru un cultivator
        const refOnHoldPosts = firebase.firestore().collection("users").doc(growerId).collection("onHold");
        // initial toate anunturi sunt adaugate in baza de date cu status in asteptare
        refOnHoldPosts
        .add({
            employeeId: emplId,
            growerId: growerId,
            postId: postId,
            status: 'In asteptare',
            lastName: profile.current.lastName,
            firstName: profile.current.firstName,
            driverLicense: profile.current.hasDriverLicense,
            postName: postName,
            postDescription: postDescription,
            categories: categories
        })
        .catch(err => {
            console.log(err);
        });
    }
    function setCurrentLocation(e, location) {
        e.preventDefault();
        console.log(location);
        setLocation(location);
    }

    useEffect(() => {
        getAllPosts();
        getProfile();
    }, [searchedLocation]);
    return (
        <div>
            <Form>
            <Form.Group>
                <Form.Label>Localitate</Form.Label>
                <Form.Control type="text" placeholder="Locatie..." className={styles.label} ref={location}/>
                <Form.Text className="text-muted">
                    Localitatea in care doresti sa lucrezi 
                </Form.Text>
                <Button variant="success" onClick={e => setCurrentLocation(e, location.current.value)}>Cauta</Button>
            </Form.Group>
            </Form>
            <div className={styles.postContainer}>
                {
                    loading == false ? (
                        postPerUser.map(i => (
                            <Card className={styles.postCard}>
                                <Card.Header>{i.postName}</Card.Header>
                                <Card.Body>
                                    <p><strong>Descriere post: </strong>{i.description}</p>
                                    <p><strong>Necesitate permis conducere: </strong>{i.driverLicense}</p>
                                    <p><strong>Locatie: </strong>{i.location}</p>
                                    {
                                        i.categories.length <  userDriverCateg.current.length ? 
                                        (
                                            userDriverCateg.current.includes(i.categories) ? 
                                            (
                                                <p><strong>Categorii permis conducere: </strong>{i.categories.split(' ')}</p>
                                            )
                                            :
                                            (
                                                <Alert>Nu aveti categoriile necesare pentru permisul de conducere</Alert>
                                            )
                                        )
                                        :
                                        (
                                            i.categories.includes(userDriverCateg.current) ? 
                                            (
                                                <p><strong>Categorii permis conducere: </strong>{i.categories.split(' ')}</p>
                                            )
                                            :
                                            (
                                                <Alert variant="warning">Nu aveti categoriile necesare pentru permisul de conducere</Alert>
                                            )
                                        )

                                    }
                                        
                                </Card.Body> 
                                <Card.Footer className={styles.cardFooter}>
                                    {
                                        i.categories.length <  userDriverCateg.current.length ? 
                                        (
                                            userDriverCateg.current.includes(i.categories) ? 
                                            (
                                                <>
                                                <Button variant="success" onClick={e => {handleShow(); applyToJob(e, currentUser.uid, i.id, i.jobId, i.postName, i.description, i.categories)}}><i className="fa fa-plus" aria-hidden="true"></i> &nbsp; Aplica</Button>
                                                
                                                </>
                                            )
                                            :
                                            (
                                                <div></div>
                                            )
                                        )
                                        :
                                        (
                                            i.categories.includes(userDriverCateg.current) ? 
                                            (
                                                
                                                <Button variant="success" onClick={e => {handleShow(); applyToJob(e, currentUser.uid, i.id, i.jobId, i.postName, i.description, i.categories)}}><i className="fa fa-plus" aria-hidden="true"></i> &nbsp; Aplica</Button>
                                            
                                            )
                                            :
                                            (
                                                <div></div>
                                            )
                                        )

                                    }
                                    <Button variant="danger"><i className="fa fa-star" aria-hidden="true"></i> &nbsp; Salveaza job</Button>
                                    <Modal show={show} onHide={handleClose} animation={false}>
                                        <Alert variant="success">Cererea dumneavoastra a fost inregistrata.
                                            <br/>
                                            Veti primi raspuns intr-un timp cat mai scurt
                                        </Alert>
                                    </Modal>
                                </Card.Footer>
                            </Card>
                            
                        ))
                    ) : 
                    (
                        <div></div>
                    )
                    
                }
            </div>
           
        </div>
    )
}
