import React, { useRef, useState, useEffect } from 'react';
import firebase from '../../../Firebase/firebase';
import { useAuth } from '../../../Firebase/context/AuthContext';
import { Card, Button } from 'react-bootstrap';
import princStyle from '../Style/PrincStyle.module.css';
import EmployeeHeader from '../../Header/EmployeeHeader';
import styles from '../Style/SeePosts.module.css';

export default function Responses() {
    const { currentUser } = useAuth();
    const refUsers = firebase.firestore().collection("users");
    // const [reqResp, setReqResp] = useState([]);
    const reqResp = useRef([]);
    const [loading, setLoading] = useState(true);
    function getUsersId() {
        const items = [];
        refUsers.onSnapshot(querySnapshot => {
            querySnapshot.forEach((doc) => {
                items.push(doc.id);
            })
            console.log("userii sunt: ", items);
        
        const posts = [];
        items.map(p => {
            
            console.log("AICIIII");
            var refPosts = firebase.firestore().collection("users").doc(p).collection("onHold").where('status', 'not-in', ['In asteptare', 'rejected offer', 'accepted offer']);
            refPosts.onSnapshot(querySnapshot => {
                
                querySnapshot.forEach(doc => {
                    if(doc.data().employeeId == currentUser.uid)
                        posts.push({docId: doc.id,...doc.data()});
                })
            })
        })
                console.log("sunt: ", posts);
                reqResp.current = posts;
                setTimeout(function() {
                    setLoading(false);
                }, 1000);
    })
    }

    function handleAcceptOffer(e, p) {
        e.preventDefault();
        console.log(p);
        console.log(p.docId);
       

      
        const refGrower = firebase.firestore().collection("users").doc(p.growerId).collection("onHold").doc(p.docId);
        refGrower.update({status: "accepted offer"})
        /*
        const refEmployee = firebase.firestore().collection("users").doc(p.employeeId).collection("employer");
        refGrower
        .add(
            {
                growerId: p.growerId,
                employeeId: p.employeeId,
                postId: p.postId,
                salary: p.salary
            }
        )
        .catch(err => {
            console.log(err)
        });

        refEmployee
        .add(
            {
                growerId: p.growerId,
                employeeId: p.employeeId,
                postId: p.postId
            }
        )
        .catch(err => {
            console.log(err)
        });
        
        // 2. Trebuie sa sterg aceasta inregistrare din onHold
        const refReq = firebase.firestore().collection("users").doc(p.growerId).collection("onHold").doc(p.docId);
        refReq
        .delete()
        .then(() => {
            console.log("Documentul s-a sters");
        })
        .catch(err => {
            console.log(err);
        })
        */



    }

    function handleRejectedOffer(e, p) {
        // trebuie sa-l trec din nou in onHold => dar cu status schimbat
        const refPost = firebase.firestore().collection("users").doc(p.growerId).collection("onHold").doc(p.docId);
        refPost.update({status: "rejected offer"});
    }
    useEffect(() => {
        getUsersId();
    }, [])
    return (
        <div className={princStyle.mainPage}>
        <EmployeeHeader />
        <div className={styles.title}>
            <p>Răspunsuri angajatori</p>
        </div>
        <div className={styles.mainContainer}>
        {
            loading == false ? 
            (
                
               
                reqResp.current.map(p => (
                    <Card key={p.docId} className={styles.postCard}>
                        <Card.Header><strong>Raspuns angajator</strong>
                            {
                                p.status === 'accepted' ? 
                                    <>
                                        <p>Acceptat</p>
                                        <p><strong>Oferta salariala:</strong> {p.salary}</p>
                                    </>
                                :
                                (   <>
                                        <p>Respins</p>
                                        <p>{p.feedback}</p>
                                    </>
                                )
                            }   
                        </Card.Header>
                        <Card.Body>
                            <p><strong>Post: </strong>{p.postName}</p>
                        </Card.Body>
                        <Card.Footer>
                            {
                                p.status === 'accepted' ? 
                                (
                                    <>
                                    <Button className={styles.acceptOfferButton} onClick={e => handleAcceptOffer(e, p)}>Acceptă ofertă &nbsp; <i className="fa fa-check" aria-hidden="true"></i></Button>
                                    <Button className={styles.rejectOfferButton} onClick={e => handleRejectedOffer(e, p)}>Respinge ofertă &nbsp; <i className="fa fa-window-close" aria-hidden="true"></i></Button>
                                    </>
                                ) :
                                (
                                    <div></div>
                                )
                            }
                            
                        </Card.Footer>
                    </Card>
                ))
               
            
            ) 
            :
            (
                <div>loading...</div>
            )
        }
        
        </div>
   
    </div>
    )
}
