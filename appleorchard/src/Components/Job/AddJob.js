import React,{ useState, useRef, useEffect } from 'react';
import { Modal, InputGroup, Form, Button, Card } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { useAuth } from '../../Firebase/context/AuthContext';
import firebase from '../../Firebase/firebase';
import styles from '../SignUp/Styles/AddProfile.module.css';
import princStyle from './Style/AddJob.module.css';
import { driverCategories } from '../SignUp/UtilityStuff';

export default function AddJob() {
    const { currentUser } = useAuth();
    const year = new Date().getFullYear();
    const postName = useRef('');
    const description = useRef('');
    const location = useRef('');
    const [driverLicense, setDriverLicense] = useState('NU');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    // numarul de locuri pentru job-ul postat - cand un candidat este acceptat -> o sa scada cu 1 acest numar
    const nrJob = useRef(0);
    const [checkedState, setCheckedState] = useState(new Array(driverCategories.length).fill(false));
    const handleOnChangeCateg = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item)
        setCheckedState(updatedCheckedState)
    };
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // colectia in care o sa salvam toate anunturile postate pentru un cultivator
    const refPosts = firebase.firestore().collection("users").doc(currentUser.uid).collection("jobPosts");
    function addJob(e, postName, description, driverLicense, checkedState, location) {

        e.preventDefault();

        console.log("s-a apelat");
        refPosts
        .add({
            postName: postName,
            description: description,
            driverLicense: driverLicense,
            checkedState: checkedState,
            location: location, 
            salary: "",
            feedback: "",
            year: year
        })
        .catch((err) => {
            console.log(err);
        });
        handleClose();

    }

    function getAllPosts() {
        refPosts.onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push({id: doc.id,...doc.data()});
            });
            setPosts(items);
            setTimeout(function() {
                setLoading(false);
            }, 100);
            /*
            console.log(items);
            console.log(items.length);
            */
        });
    }
    function deletePost(e, postId) {
        e.preventDefault();
        const deletePost = firebase.firestore().collection("users").doc(currentUser.uid).collection("jobPosts").doc(postId);
        deletePost
        .delete()
        .then(() => {
            console.log("Documentul s-a sters");
        })
        .catch(err => {
            console.log(err);
        })
    }
    useEffect(() => {
        getAllPosts();
    }, []);
    return (
        <div>
        <div>
            <Button onClick={handleShow} className={princStyle.addButton}>Adauga anunt</Button>
        </div>
        <div>
        <Card className={princStyle.mainCardContainer}>
            <Card.Header>Anunturi postate</Card.Header>
            <Card.Body>
            
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header>Anunt angajare</Modal.Header>
                <Modal.Body>
                    <Form>
                    <Form.Group className={styles.inputItem}>
                        <Form.Label>Nume post</Form.Label>
                        <InputGroup>
                            <InputGroup.Prepend id="inputGroupPrependPostName">
                                <InputGroup.Text>
                                    <i className="fa fa-briefcase" aria-hidden="true"></i>
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control as="select" ref={postName} placeholder="Nume post..." aria-describedby="inputGroupPrependPostName"
                required>
                                <option>Sofer tractor</option>
                                <option>Sofer tir</option>
                                <option>Sofer masina mica</option>
                                <option>Culegator mere</option>
                                <option>Muncitor</option>
                            </Form.Control>
                        </InputGroup>
                        
                    </Form.Group>
                    <Form.Group className={styles.inputItem}>
                        <Form.Label htmlFor="description"><strong className={styles.tags}>Scurta descriere</strong></Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend id="inputGroupPrependDescription">
                                    <InputGroup.Text>
                                        <i className={`fa fa-user ${styles.icons}`} aria-hidden="true" />
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control 
                                    ref={description}
                                    type="text"
                                    placeholder="Descriere"
                                    aria-describedby="inputGroupPrependDescription"
                                    required
                                />
                            </InputGroup>
                    </Form.Group>

                    <Form.Group className={styles.inputItem}>
                        <Form.Label htmlFor="needDriverLicense"><strong className={styles.tags}>Permis de conducere</strong></Form.Label>
                        <InputGroup>
                        <InputGroup.Prepend id="inputGroupPrependDriverLicense">
                            <InputGroup.Text>
                                <i className="fa fa-briefcase" aria-hidden="true"></i>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control as="select" aria-describedby="inputGroupPrependDriverLicense"
                            value={driverLicense} onChange={(e) => setDriverLicense(e.target.value)}>
                            {
                                ['DA', 'NU'].map((j) => (
                                    <option key={j}>
                                        {j}
                                    </option>
                                ))
                            }
                        </Form.Control>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group>
                    {
                        driverLicense === 'DA' ? (
                            driverCategories.map(({name}, index) => (
                                
                                    <Form.Check
                                        key={index}
                                        custom
                                        inline
                                        label={name}
                                        type="checkbox"
                                        id={`custom-checkbox-${index}`}
                                        checked={checkedState[index]}
                                        onChange={() => handleOnChangeCateg(index)}
                                    />
                                
                            )
                            )
                        ) : 
                        
                            null
                        
                    }
                    </Form.Group>
                    <Form.Group className={styles.inputItem}>
                        <Form.Label htmlFor="location"><strong className={styles.tags}>Localitate</strong></Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend id="inputGroupPrependLocation">
                                    <InputGroup.Text>
                                        <i className={`fa fa-map-marker ${styles.icons}`} aria-hidden="true" />
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control 
                                    ref={location}
                                    type="text"
                                    placeholder="Localitate"
                                    aria-describedby="inputGroupPrependLocation"
                                    required
                                />
                            </InputGroup>
                    </Form.Group>
                    </Form>
                </Modal.Body>
                <Button className={`btn btn-success ${styles.saveDataButton}`} onClick={(e) => addJob(e, postName.current.value, description.current.value, driverLicense, checkedState, location.current.value)}>Salveaza</Button>
            
            </Modal>   
            <div>
                {
                    loading == false ? 
                    (
                        posts.map(post => (
                            <Card key={post.id}>
                                <Card.Header>{post.postName}</Card.Header>
                                <Card.Footer>
                                    <Button variant="danger" onClick={e => deletePost(e, post.id)}><i className="fa fa-trash" aria-hidden="true"></i></Button>
                                </Card.Footer>
                            </Card>
                        ))
                    )
                    :
                    (
                        <Spinner animation="border" variant="danger"/>
                    )
                    
                }
            </div> 
            </Card.Body>
            </Card>
            </div>
            </div>
                  
    )
}
