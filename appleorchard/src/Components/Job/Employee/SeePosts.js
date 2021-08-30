import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Card, Alert, Modal } from 'react-bootstrap';
import styles from '../Style/SeePosts.module.css';
import princStyle from '../Style/PrincStyle.module.css'
import firebase from '../../../Firebase/firebase';
import { useAuth } from '../../../Firebase/context/AuthContext';
import Spinner from 'react-bootstrap/Spinner';
import EmployeeHeader from '../../Header/EmployeeHeader';

export default function SeePosts() {
    // o sa listez job-urile doar de la agricultorii dintr-o zona selectata
    const profile = useRef();
    const userDriverCateg = useRef('');
    const [show, setShow] = useState(false);
    const [seenJobs, setSeenJobs] = useState([]);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show1, setShow1] = useState(false);
    const handleShow1 = () => setShow1(true);
    const handleClose1 = () => setShow1(false);
    const [searchedLocation, setLocation] = useState('');
    const [postPerUser, setPostPerUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [savedPosts, setSavedPosts] = useState([]);
    const { currentUser } = useAuth();
    const refUsers = firebase.firestore().collection("users");
    const refProfile = firebase.firestore().collection("users").doc(currentUser.uid);
    // aici se retin job-urile la care a aplicat
    const refSeenJobs = firebase.firestore().collection("users").doc(currentUser.uid).collection("seenJobs"); 
    
    const refSavedPosts = firebase.firestore().collection("users").doc(currentUser.uid).collection("savePost");

    function getIdSavedPosts() {
        refSavedPosts.onSnapshot(querySnapshot => {
            const savedItems = [];
            querySnapshot.forEach(doc => {
                savedItems.push(doc.data().i.jobId);
            })
            // console.log("Posturile salvate sunt: ", savedItems);
            setSavedPosts(savedItems);
        })
    }
    function getAllAppliedPosts() {
        const items = [];
        const itemsId = [];
        refSeenJobs.onSnapshot(querySnapshot => {
            querySnapshot.forEach(doc => {
                items.push(doc.data());
            })
            
            items.map(p => (itemsId.push(p.postId)));
            setSeenJobs(itemsId);
            setTimeout(function(){
                setLoading1(false);
            }, 1000);
            console.log(itemsId);
        })
        
    }
    
    function getProfile() {
        refProfile.onSnapshot((doc) => {
            profile.current = doc.data();
            userDriverCateg.current = doc.data().driverCateg;
        })
    }

 
    function getAllPosts() {
        refUsers.onSnapshot((querySnapshot) => {
            const growerUser = [];
            querySnapshot.forEach((doc) => {
                // doar cultivatorii pot posta anunturi
                if(doc.data().job === 'Cultivator')
                {
                    growerUser.push({id: doc.id,...doc.data()});
                }

            });
            const post = [];
        // console.log("Userii sunt: ", growerUser);
        growerUser.map(i => {
            // console.log("Uuserul este: !!!", i);
            var refPost = firebase.firestore().collection("users").doc(i.id).collection("jobPosts");
            
            if(searchedLocation != '')
            {
                // console.log("Fac verificarea asta: ");
                // var upperSearchedLocation = searchedLocation.toUpperCase();
                var refPostByLoc = refPost.where('location', '==', searchedLocation);
                var refPost = refPostByLoc;
            }

            refPost.onSnapshot((querySnapshot) => {
                
                querySnapshot.forEach((doc) => {
                    // console.log("Posturile sunt: ", doc.data(), i.id);
                    // var driverCateg = getDriverCateg(doc.data().checkedState);
                    // console.log("Este: ", driverCateg);
                    post.push({id: i.id, employeerName: i.lastName, employeerFirstName: i.firstName, jobId: doc.id, categories: doc.data().categ, ...doc.data()});
                })
               

            })

        }
            
        )
        console.log("Posturile sunt: ", post);
            setPostPerUser(post);
            setTimeout(function() {
                setLoading(false);
            }, 2000) 
            console.log(post);
        });
    }

    function savePost(e, i) {
        e.preventDefault();
        const refSavedPosts = firebase.firestore().collection("users").doc(currentUser.uid).collection("savePost");
        refSavedPosts.
        add({
            i
        })
        .catch(err => {
            console.log(err);
        })
    }
    function applyToJob(e, emplId, growerId, postId, postName, postDescription, categories, year) {
        e.preventDefault();
        // currentUser.uid, i.id, i.jobId, i.postName, i.description
        console.log(postId, postName);
        // trebuie sa adaug la vectorul de onHold pentru un cultivator
        const refOnHoldPosts = firebase.firestore().collection("users").doc(growerId).collection("onHold");
        const refSeenJobs = firebase.firestore().collection("users").doc(currentUser.uid).collection("seenJobs");
        // daca un utilizator a aplicat pentru un job => acesta nu trebuie sa mai poata aplica la el inca o data => va avea doar drept la vizualizare
        refSeenJobs
        .add(
            {
                postId: postId
            }
        )
        .catch(err => {
            console.log(err);
        })
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
            categories: categories,
            year: year

        })
        .catch(err => {
            console.log(err);
        });
    }
    /*
    function setCurrentLocation(e, location) {
        e.preventDefault();
        console.log(location);
        setLocation(location);
        setTimeout(function() {
            setLoading2(false);
        }, 1000);
    }*/

    useEffect(() => {
        getAllPosts();
        getProfile();
        getAllAppliedPosts();
        getIdSavedPosts();
    }, []);
    return (
        <div className={princStyle.mainPage}>
            <EmployeeHeader />
            <Form className={styles.form}>
            <Form.Group>
                <Form.Label style={{color: "#871f08"}}><strong>Localitate</strong></Form.Label>
                <Form.Control type="text" placeholder="Locatie..." className={styles.label} onChange={e => setLocation(e.target.value)}/>
                <Form.Text className="text-muted">
                    Localitatea în care dorești să lucrezi 
                </Form.Text>
                {/* <Button variant="success" onClick={e => setCurrentLocation(e, location.current.value)}>Cauta</Button> */}
            </Form.Group>
            </Form>
            <div className={styles.mainContainer}>
                {
                    loading == false ? (
                        postPerUser.map(i => (
                            i.location == searchedLocation || searchedLocation == '' ? 
                            (
                                <Card className={styles.postCard} key={i.jobId}>
                                <Card.Header><strong>{i.postName}</strong></Card.Header>
                                <Card.Body>
                                    <p><strong>Descriere post: </strong>{i.description}</p>
                                    <p><strong>Angajator: </strong>{i.employeerName} {i.employeerFirstName}</p>
                                    <p><strong>Necesitate permis conducere: </strong>{i.driverLicense}</p>
                                    <p><strong>Categorii: </strong> {i.categ}</p>
                                    <p><strong>An: </strong>{i.year}</p>
                                    <p><strong>Locație: </strong>{i.location}</p>
                                    {
                                        i.categories.length <  userDriverCateg.current.length ? 
                                        (
                                            userDriverCateg.current.includes(i.categories) ? 
                                            (
                                                <p><strong>Categorii permis conducere: </strong>{i.categories.split(' ')}</p>
                                            )
                                            :
                                            (
                                                <Alert variant="warning">Nu aveți categoriile necesare pentru permisul de conducere</Alert>
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
                                                <Alert variant="warning">Nu aveți categoriile necesare pentru permisul de conducere</Alert>
                                            )
                                        )

                                    }
                                    
                                    {
                                            seenJobs.includes(i.jobId) == true ? 
                                            (
                                                <Alert variant="success">Ați aplicat pentru acest job</Alert>
                                            )
                                            :
                                            (
                                                <div></div>
                                            )
                                    }
                                </Card.Body> 
                                <Card.Footer className={styles.cardFooter}>
                                    {
                                        i.categories.length <  userDriverCateg.current.length ? 
                                        (
                                            userDriverCateg.current.includes(i.categories) ? 
                                            (
                                                
                                                    loading1 == false ?
                                                    (
                                                        seenJobs.includes(i.jobId) == true ? 
                                                        (
                                                            console.log("AICI")
                                                        )
                                                        :
                                                        (
                                                            // console.log("VERIFICARE: ", seenJobs.includes(i.jobId), i.jobId, seenJobs)
                                                            <Button variant="success" onClick={e => {handleShow(); applyToJob(e, currentUser.uid, i.id, i.jobId, i.postName, i.description, i.categories, i.year)}}><i className="fa fa-plus" aria-hidden="true"></i> &nbsp; Aplică</Button>
        
                                                        )
                                                    )
                                                    :
                                                    (
                                                        <div></div>
                                                    )
                                                
                                               
                                                
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
                                                loading1 == false ? 
                                                (
                                                    seenJobs.includes(i.jobId) == true ? 
                                                (
                                                    console.log("AICI")
                                                )
                                                :
                                                
                                                (
                                                    // console.log("VERIFICARE: ", seenJobs.includes(i.postId))
                                                    <Button variant="success" onClick={e => {handleShow(); applyToJob(e, currentUser.uid, i.id, i.jobId, i.postName, i.description, i.categories, i.year)}}><i className="fa fa-plus" aria-hidden="true"></i> &nbsp; Aplică</Button>
                                                
                                                )
                                                )
                                                :
                                                (
                                                    <div></div>
                                                )
                                                
                                            
                                            )
                                            :
                                            (
                                                <div></div>
                                            )
                                        )

                                    }
                                    {
                                        savedPosts.includes(i.jobId) ?
                                            <div></div>
                                        :
                                            <Button variant="danger" onClick={e => {handleShow1(); savePost(e, i)}}><i className="fa fa-star" aria-hidden="true"></i> &nbsp; Salveaza job</Button>
                                    }
                                    <Modal show={show1} onHide={handleClose1} animation={false}>
                                        <Alert variant="warning">Acest job a fost salvat cu succces</Alert>
                                        <div className={styles.exitButtonContainer}>
                                            <Button onClick={handleClose1} className={styles.exitButton}><i className="fa fa-window-close" aria-hidden="true"></i></Button>
                                        </div>
                                    </Modal>
                                    <Modal show={show} onHide={handleClose} animation={false}>
                                        <Alert variant="success">Cererea dumneavoastră a fost inregistrată.
                                            <br/>
                                            Veți primi raspuns într-un timp cât mai scurt
                                        </Alert>
                                    </Modal>
                                </Card.Footer>
                            </Card>
                            )
                            :
                            (
                                <div></div>
                            )
                            
                        ))
                    ) : 
                    (
                        <div>
                            <Spinner animation="border" variant="danger"/>
                        </div>
                    )
                    
                }
            </div>
           
        </div>
    )
}
