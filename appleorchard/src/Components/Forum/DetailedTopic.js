import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import firebase from '../../Firebase/firebase';
import { useAuth } from '../../Firebase/context/AuthContext';
import { Form, InputGroup, Button, Card, Modal, Alert } from 'react-bootstrap';
import styles from './Style/DetailedTopic.module.css';
import GrowerHeader from '../Header/GrowerHeader';


export default function DetailedTopic() {
    const { currentUser } = useAuth();
    const location = useLocation();
    const topicId  = location.state;
    const answer = useRef();
    const [topics, setTopics] = useState([]);
    const [loadingTopic, setLoadingTopic] = useState(true);
    const [answers, setAnswers] = useState([]);
    const [loadingAns, setLoadingAns] = useState(true);
    const [error, setErros] = useState([]);
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    // imagine
    const [file, setFile] = useState(null);
    const onFileChange = e => {
        setFile(e.target.files[0]);
        setImage(true);
    }
    const [existsImage, setImage] = useState(false);
    const [userName, setUserName] = useState('');
    const [loadingUserName, setLoadingUserName] = useState(true);



    const currentDate = new Date().getDate() + "-" + new Date().getMonth() + "-" + new Date().getFullYear();
    const currentTime = new Date().getHours() + ":" + new Date().getMinutes();
    const refTopic = firebase.firestore().collection("forumTopic").doc(topicId);
    const refTopicAns = firebase.firestore().collection("forumTopic").doc(topicId).collection("answers");
    const refProfile = firebase.firestore().collection("users").doc(currentUser.uid);



    function getUserName() {
        var userName = "";
        refProfile.onSnapshot(doc => {
            userName = doc.data().firstName + " " + doc.data().lastName;
            setUserName(userName);
            setTimeout(function() {
                setLoadingUserName(false);
            }, 1000);
        })
        
    }

    // functia care adauga raspunsul la o intrebare
    const addResponse = async (e, topicId, answer) => {
        e.preventDefault();
        console.log("Am intrat in functia de adauga raspuns");
        const refTopicAns = firebase.firestore().collection("forumTopic").doc(topicId).collection("answers");
      
        var ok = true;
        const err = [];
        if(answer == '')
        {
            err.push("Trebuie sa completati toate campurile. \n");
            ok = false;
        }
        if(ok)
        {
            if(existsImage)
        {
            const storageRef = firebase.storage().ref();
            const fileRef = storageRef.child(file.name);
            await fileRef.put(file);
            refTopicAns.add({
                respAuthour: currentUser.uid,
                userName: userName,
                answer: answer, 
                timestamp: currentDate + " " + currentTime,
                timestampOrd: new Date(),
                likes: 0,
                imgName: file.name,
                imgUrl: await fileRef.getDownloadURL()
            }).catch(err => {
                console.log(err);
            })
        }
            
        else
            refTopicAns.add({
                respAuthour: currentUser.uid,
                answer: answer, 
                timestamp: currentDate + " " + currentTime,
                timestampOrd: new Date(),
                likes: 0
            }).catch(err => {
                console.log(err);
            })
        handleClose();
        setImage(false);
        
        }
        else
        {
            setErros(err);
        }
        
        
    }

    function getTopic() {
        refTopic.onSnapshot(doc => {
            const topicItems = [];
            topicItems.push({id: doc.id, ...doc.data()});
            setTopics(topicItems);
            console.log(topicItems);
            setTimeout(function() {
                setLoadingTopic(false);
            }, 1000);
        })
    }

    
    function sortAllAnswers(tpc) {
        const sortedTopics = tpc.sort((a, b) => a.timestampOrd - b.timestampOrd);
        return sortedTopics;
    }

    function getAllTopics() {
        refTopicAns.onSnapshot(querySnapshot => {
            var ansItems = []
            querySnapshot.forEach(doc => {
                ansItems.push({ansId: doc.id, ...doc.data()});
            })
            ansItems = sortAllAnswers(ansItems);
            setAnswers(ansItems);
            setTimeout(function() {
                setLoadingAns(false);
            }, 1000);
        })
    }

    function addLike(id, likes)
    {
        console.log("Am intrat in functia asta");
        const refLike = firebase.firestore().collection("likes").where("topicId", "==", id).where("personWhoLikes", '==', currentUser.uid);
        refLike.get().then(querySnapshot => {
            const likeItems = [];
            console.log("am intrat in query");
            querySnapshot.forEach(doc => {
                likeItems.push(doc.id);
            })
            // daca nu exista inregistrare pentru topicul respectiv si pentru user-ul care da like (cel curent)
            console.log("Id-ul este: ", likeItems, likeItems.length);

            console.log("Lungimea este: ", likeItems.length);
            if(likeItems.length == 0)
            {

                console.log("Am intrat in if-ul asta pentru: ", likeItems.length);
                const refAddRecord = firebase.firestore().collection("likes");
                refAddRecord.add({
                    topicId: id,
                    personWhoLikes: currentUser.uid
                })
                
                const refTopicLike = firebase.firestore().collection("forumTopic").doc(id);
                refTopicLike.update({
                    likes: likes + 1
                }).catch(err => {
                    console.log(err);
                });

            }
        })  
       

        refLike.get().then(querySnapshot => {
            console.log("Am intrat la delete");
            const likeItems = [];
            querySnapshot.forEach(doc => {
                likeItems.push(doc.id);
            })
            if(likeItems.length == 1)
            {
                const refTopicLike = firebase.firestore().collection("forumTopic").doc(id);
                refTopicLike.update({
                    likes: likes - 1
                }).catch(err => {
                    console.log(err);
                });

                // si trebuie sa sterg inregistrarea din likes
                const refDeleteLike = firebase.firestore().collection("likes").doc(likeItems[0]);
                refDeleteLike.delete().then(() => {
                    console.log("Deleted document")
                }).catch(err => console.log(err));
            }
        })
            
}


        function addAnsLike(id, likes)
        {
            console.log("Am intrat in functia asta");
            const refLike = firebase.firestore().collection("likes").where("topicId", "==", id).where("personWhoLikes", '==', currentUser.uid);
            refLike.get().then(querySnapshot => {
                const likeItems = [];
                console.log("am intrat in query");
                querySnapshot.forEach(doc => {
                    likeItems.push(doc.id);
                })
                // daca nu exista inregistrare pentru topicul respectiv si pentru user-ul care da like (cel curent)
                console.log("Id-ul este: ", likeItems, likeItems.length);

                console.log("Lungimea este: ", likeItems.length);
                if(likeItems.length == 0)
                {

                    console.log("Am intrat in if-ul asta pentru: ", likeItems.length);
                    const refAddRecord = firebase.firestore().collection("likes");
                    refAddRecord.add({
                        topicId: id,
                        personWhoLikes: currentUser.uid
                    })
                    
                    const refTopicLike = firebase.firestore().collection("forumTopic").doc(topics[0].id).collection("answers").doc(id);
                    refTopicLike.update({
                        likes: likes + 1
                    }).catch(err => {
                        console.log(err);
                    });

                }
            })  
        

            refLike.get().then(querySnapshot => {
                console.log("Am intrat la delete");
                const likeItems = [];
                querySnapshot.forEach(doc => {
                    likeItems.push(doc.id);
                })
                if(likeItems.length == 1)
                {
                    const refTopicLike = firebase.firestore().collection("forumTopic").doc(topics[0].id).collection("answers").doc(id);
                    refTopicLike.update({
                        likes: likes - 1
                    }).catch(err => {
                        console.log(err);
                    });

                    // si trebuie sa sterg inregistrarea din likes
                    const refDeleteLike = firebase.firestore().collection("likes").doc(likeItems[0]);
                    refDeleteLike.delete().then(() => {
                        console.log("Deleted document")
                    }).catch(err => console.log(err));
                }
            })
                
        }


    useEffect(() => {
        getUserName();
        getTopic();
        getAllTopics();
    }, []);

    return (
        <div className={styles.mainPage}>
            <GrowerHeader />
            <div className={styles.topicCardContainer}>
                {
                    topics.map(p => (
                        <Card key={p.id} className={styles.littleTopicCard} key={p.id}>
                            <Card.Header className={styles.topicHeader}>
                                <div className={styles.flexItems}>
                                    <p>{p.userName}</p>
                                    <p>Postat la: {p.timestamp}</p>
                                </div>
                                <div className={styles.flexItems}>
                                    <span className={`badge ${styles.badge}`}>{p.topicCateg}</span>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <p>{p.question}</p>
                                <div className={styles.imgContainer}>
                                    {
                                        typeof p.imgUrl != 'undefined' ?
                                            <img src={p.imgUrl} alt="Imagine" className={styles.img}/>
                                        : 
                                            <div></div>
                                    }
                                </div>
                            </Card.Body>
                           <Card.Footer>
                               <Button onClick={e => addLike(p.id, p.likes)} className={styles.likeButton}><i className="fa fa-thumbs-up" aria-hidden="true"></i> &nbsp; <span className={`badge ${styles.badge}`}>{p.likes}</span></Button>
                           </Card.Footer>
                        </Card>
                    ))
                }
                {
                    answers.map(p => (
                        <Card key={p.id} className={styles.ansTopicCard} key={p.ansId}>
                            <Card.Header className={styles.topicHeader}>
                                <div className={styles.flexItems}>
                                    <p>{p.userName}</p>
                                    <p>Postat la: {p.timestamp}</p>
                                </div>
                                <div className={styles.flexItems}>
                                    <span className={`badge ${styles.badge}`}>{p.topicCateg}</span>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                {p.answer}
                                <div className={styles.imgContainer}>
                                    {
                                        typeof p.imgUrl == 'undefined' ?
                                            <div></div>
                                        :
                                            <img src={p.imgUrl} alt="Imagine" className={styles.img}/>
                                    }
                                    
                                </div>
                            </Card.Body>
                           <Card.Footer>
                               <Button onClick={e => addAnsLike(p.ansId, p.likes)} className={styles.ansLikeButton}><i className="fa fa-thumbs-up" aria-hidden="true"></i> &nbsp; <span className={`badge ${styles.badge}`}>{p.likes}</span></Button>
                           </Card.Footer>
                        </Card>
                    ))
                }
                <Button onClick={handleShow} className={styles.addAnsButton}><i className={`fa fa-reply`} aria-hidden="true"></i> &nbsp; Răspunde</Button>
            </div>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header>
                    <div className={styles.modalHeader}>
                        <h5 style={{color: "#871f08"}}><strong>Adaugă răspuns</strong></h5>
                    </div>
                </Modal.Header>
                    <Form className={styles.formContainer}>
                        <Form.Group>
                        <Form.Label style={{color: "#871f08"}}><strong>Răspuns</strong></Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend id="inputGroupPrependTopicName">
                                    <InputGroup.Text>
                                        <i className={`fa fa-book ${styles.icon}`} aria-hidden="true"></i>
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control ref={answer} as="textarea" row={3} placeholder="Raspuns..." min="1" aria-describedby="inputGroupPrependTopicName"
                    required/>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group>
                                <Form.Label style={{color: "#871f08"}}><strong>Imagine</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependTopicImage">
                                            <InputGroup.Text>
                                                <i className={`fa fa-picture-o ${styles.icon}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control type="file" onChange={onFileChange} aria-describedby="inputGroupPrependTopicImage"
                            required/>
                                    </InputGroup>
                                    {
                                        error.length ?
                                        (
                                            error.map(p => (
                                                <Alert variant="danger">
                                                    {p}
                                                </Alert>
                                            ))
                                        )
                                        :
                                        <div></div>
                                    }
                            </Form.Group>
                        <div className="text-center">
                            <Button onClick={e => addResponse(e, topics[0].id, answer.current.value)} className={styles.likeButton}>Adauga raspuns</Button>
                        </div>
                    </Form>
            </Modal>
        </div>
    )
}
