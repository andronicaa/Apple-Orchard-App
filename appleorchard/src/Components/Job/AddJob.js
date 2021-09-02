import React,{ useState, useRef, useEffect } from 'react';
import { Modal, InputGroup, Form, Button, Card, Alert } from 'react-bootstrap';
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
    const [error, setError] = useState([]);
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

    function getDriverCateg(driverArray) {
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


    function addJob(e, postName, description, driverLicense, checkedState, location) {
        e.preventDefault();
        var err = [];
        if(postName == '' || description == '' || driverLicense == '' || location == '')
        {
            err.push('Trebuie să completați toate câmpurile.');
        }
        else
        {
            const categ = getDriverCateg(checkedState);
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
                year: year,
                categ: categ
            })
            .catch((err) => {
                console.log(err);
            });
            handleClose();
        }
        setError(err);

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
            }, 1000);
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
        <>
        <Card className={princStyle.mainCardContainer}>
            <Card.Body>
            <div className={princStyle.buttonContainer}>
                <Button onClick={handleShow} className={princStyle.addButton}>Adaugă anunț</Button>
            </div>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header className="text-center">
                    <h4 style={{color: "#871f08", textAlign: "center"}}>Anunț nou</h4>
                </Modal.Header>
                <Modal.Body>
                    {
                        error.length ?
                            error.map(p => (
                                <Alert variant="danger">{p}</Alert>
                            ))
                        :
                            <div></div>
                    }
                    <Form>
                    <Form.Group className={styles.inputItem}>
                        <Form.Label className={styles.tags}><strong>Nume post</strong></Form.Label>
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
                        <Form.Label htmlFor="description"><strong className={styles.tags}>Scurtă descriere</strong></Form.Label>
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
                            driverLicense == 'DA' ?
                                <Form.Label htmlFor="location"><strong className={styles.tags}>Categorii permis</strong></Form.Label>
                            :
                                <div></div>
                        }
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
                <div className="text-center">
                    <Button className={princStyle.saveDataButton} onClick={(e) => addJob(e, postName.current.value, description.current.value, driverLicense, checkedState, location.current.value)}>Salvează</Button>
                </div>
            </Modal>   
            <div className={princStyle.flexContainer}>
                {
                    loading == false ? 
                    (
                        posts.map(post => (
                            <Card key={post.id} className={princStyle.postCard}>
                                <Card.Header><strong>{post.postName}</strong></Card.Header>
                                <Card.Body>
                                    <p><strong>Locație: </strong>{post.location}</p>
                                    <p><strong>Categorii permis auto: </strong>{post.driverLicense}</p>
                                </Card.Body>
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
        
            
            </>
                  
    )
}
