import React, { useRef, useState, useEffect } from 'react';
import firebase from '../../Firebase/firebase';
import { useAuth } from '../../Firebase/context/AuthContext';
import styles from './Style/ForumMainPage.module.css';
import { Form, InputGroup, Button, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import GrowerHeader from '../Header/GrowerHeader';

export default function ForumMainPage() {
    const { currentUser } = useAuth();
    const topicName = useRef();
    const question = useRef();
    const topicCateg = useRef(); 
    const [showForm, setShowForm] = useState(false);
    const [topics, setTopics] = useState([]);
    const [loadingTopic, setLoadingTopic] = useState(true);
    const [userName, setUserName] = useState('');
    const [loadingUserName, setLoadingUserName] = useState(true);
    const [error, setErros] = useState([]);
    const [existsImage, setImage] = useState(false);
    
    const [sortType, setSortType] = useState('asc');
    const currentMonth = new Date().getMonth() < 10 ? '0' +  (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
    const currentDay = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
    const currentDate = new Date().getFullYear() + "-" + currentMonth + "-" +  currentDay;
    const currentHour = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours();
    const currentMinutes = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() < 10 : new Date().getMinutes();
    const currentTime = currentHour + ":" + currentMinutes; 
    
    // imagine
    const [file, setFile] = useState(null);
    const onFileChange = e => {
        setFile(e.target.files[0]);
        setImage(true);
    }

    const categ = ['Alege categorie', 'Tratamente', 'Utilaje', 'Dăunători', 'Operațiuni', 'Alte categorii'];
    const refTopic = firebase.firestore().collection("forumTopic");
    const refProfile = firebase.firestore().collection("users").doc(currentUser.uid);
    

    const addTopic = async (e, topicName, question, topicCateg) => {
        e.preventDefault();
        const err = [];
        var ok = true;
        if(topicName == '' || question == '' || topicCateg == '')
        {
            ok = false;
            err.push("Trebuie sa completati toate campurile!\n");
        }
        if(ok)
        {
            if(existsImage)
            {
                const storageRef = firebase.storage().ref();
                const fileRef = storageRef.child(file.name);
                await fileRef.put(file);
                refTopic.add({
                author: currentUser.uid, 
                topicName: topicName,
                question: question,
                topicCateg: topicCateg,
                timestamp: currentDate + " " + currentTime,
                likes: 0,
                userName: userName,
                timestampOrd: new Date(),
                imgName: file.name,
                imgUrl: await fileRef.getDownloadURL()
            });
            }
            else
            {
                refTopic.add({
                    author: currentUser.uid, 
                    topicName: topicName,
                    question: question,
                    topicCateg: topicCateg,
                    timestamp: currentDate + " " + currentTime,
                    likes: 0,
                    userName: userName,
                    timestampOrd: new Date()
                });
            }
            
            setShowForm(false);
            setImage(false);
            
        }
        else
        {
            setErros(err);
        }
        
        
    }

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

    function sortAllTopics(tpc) {
        var sortedTopics = [];
        if(sortType == 'desc')
            sortedTopics = tpc.sort((a, b) => b.timestampOrd - a.timestampOrd);
        if(sortType == 'asc')
            sortedTopics = tpc.sort((a, b) => a.timestampOrd - b.timestampOrd);

        return sortedTopics;
    }

    function getAllTopics() {
        refTopic.onSnapshot(querySnapshot => {
            var topicItems = [];
            querySnapshot.forEach(doc => {
                topicItems.push({id: doc.id,...doc.data()})
            })
            console.log("Postarile inainte de sortare: ", topicItems);
            topicItems = sortAllTopics(topicItems);
            console.log("Postarile dupa sortare: ", topicItems);
            setTopics(topicItems);
            setTimeout(function() {
                setLoadingTopic(false);
            }, 1000);
        })
    }
    useEffect(() => {
        getUserName();
        getAllTopics();
    }, [sortType]);

    return (
        <div className={styles.mainPage}>
            <GrowerHeader />
            <div className={styles.mainCard}>
                <div className={styles.top}>
                <div>
                    <Button className={styles.addTopicButton} onClick={e => setShowForm(!showForm)}>Topic nou &nbsp; <i className="fa fa-plus" aria-hidden="true"></i></Button>
                </div>
                <div className={styles.sortArrows}>
                    <Button onClick={e => setSortType('desc')} className={styles.descButton}><i className="fa fa-arrow-down" aria-hidden="true"></i></Button><Button disabled="true" className={styles.sortButton}>Sortează</Button><Button onClick={e => setSortType('asc')} className={styles.ascButton}><i className="fa fa-arrow-up" aria-hidden="true"></i></Button>
                </div>
                </div>
                {
                    showForm ?
                    (   <Card className={styles.formCardContainer}>
                        <Card.Header className={styles.title}>
                            <h4>Topic nou</h4>
                        </Card.Header>

                        <Form className={styles.formContainer}>
                            <Form.Group>
                                <Form.Label style={{color: "#871f08"}}><strong>Subiect</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependTopicName">
                                            <InputGroup.Text>
                                                <i className={`fa fa-book ${styles.icon}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control ref={topicName} type="text" placeholder="Subiect..." min="1" aria-describedby="inputGroupPrependTopicName"
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
                            </Form.Group>
                            <Form.Group >
                                    <Form.Label htmlFor="topicCateg" style={{color: "#871f08"}}><strong>Categorie topic</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependTopicCateg">
                                            <InputGroup.Text>
                                                <i className={`fa fa-briefcase ${styles.icon}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control as="select" ref={topicCateg} aria-describedby="inputGroupPrependTopicCateg"
                            required>
                                            {
                                                categ.map((j) => (
                                                    <option key={j}>
                                                        {j}
                                                    </option>
                                                ))
                                            }
                                        </Form.Control>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group>
                                <Form.Label style={{color: "#871f08"}}><strong>Întrebare</strong></Form.Label>
                                    <InputGroup>
                                        <Form.Control ref={question} as="textarea" placeholder="Intrebare..." row={3} aria-describedby="inputGroupPrependQuestion"
                            required/>
                                    </InputGroup>
                            </Form.Group>
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
                        </Form>
                        <Card.Footer className="text-center">
                            <Button className={styles.submitFormButton} onClick={e => addTopic(e, topicName.current.value, question.current.value, topicCateg.current.value)}>Adaugă</Button>
                        </Card.Footer>
                        </Card>
                    )   
                    :
                    (
                        <div></div>
                    )
                }
            <div className={styles.smallScreen}>
            {
                loadingTopic == false ?
                (
                    topics.map(p => (
                       
                        <Card className={styles.cardItem} key={p.id}>
                            <Card.Header className={styles.topicCard}>
                            <div className={styles.topicItems}>
                                <p>{p.topicName}</p>
                                <span>Categorie: <span className={`badge ${styles.badge}`}>{p.topicCateg}</span></span>
                            </div>
                            <div className={styles.topicItems}>
                                <Link
                                    to={{
                                        pathname: '/detailed-topic',
                                        state: p.id
                                    }}
                                >
                                    <Button className={styles.convButton}>Conversatie <i className="fa fa-comments-o" aria-hidden="true"></i></Button>
                                </Link>
                            </div>
                            </Card.Header>
                        </Card>
                        
                    ))
                )
                :
                (
                    <div></div>
                )
            }
            </div>
            </div>
        </div>
    )
}
