// Ruta pe care poate sa o acceseze doar un angajat
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../Firebase/context/AuthContext';
import firebase from '../../../Firebase/firebase';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import princStyle from '../Style/PrincStyle.module.css';
import styles from '../Style/SeePosts.module.css';
import EmployeeHeader from '../../Header/EmployeeHeader';


export default function SavedPosts() {
    const { currentUser } = useAuth();
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const refSavedPosts = firebase.firestore().collection("users").doc(currentUser.uid).collection("savePost");
    
    function getSavedPost() {
        refSavedPosts.onSnapshot(querySnapshot => {
            const items = [];
            querySnapshot.forEach(doc => {
                // aici iar doar id-urile pentru postari
                items.push({id: doc.id,...doc.data()});
            })
            console.log("Job-urile salvate sunt: ", items);
            setSavedPosts(items);
            setLoading(function() {
                setLoading(false);
            }, 1000);
        })
    }
    useEffect(() => {
        getSavedPost();
    }, []);
    return (
        <div className={princStyle.mainPage}>
            <EmployeeHeader />
            <div className={styles.title}>
                <p>Anunțuri salvate</p>
            </div>
            <div className={styles.mainContainer}>
                
                {loading == false ? (
                    savedPosts.map(p => (
                        <Card key={p.id} className={styles.postCard}>
                            <Card.Header>
                                <p><strong>{p.i.postName}</strong></p>
                            </Card.Header>
                            <Card.Body>
                                <p><strong>Locatie:</strong> {p.i.location}</p>
                                <p><strong>Angajator:</strong> {p.i.employeerFirstName} {p.i.employeerName}</p>
                            </Card.Body>
                            <Card.Footer>
                                <Link
                                    to={{
                                        pathname: '/see-posts'
                                    }}
                                >
                                    <Button className={styles.princPage}>Pagina principala &nbsp; <i className="fa fa-home" aria-hidden="true"></i></Button>
                                </Link>
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
        </div>
    )
}
