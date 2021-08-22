import React, { useState, useEffect } from 'react';
import firebase from '../../Firebase/firebase';
import { useAuth } from '../../Firebase/context/AuthContext';
import { Button, Card } from 'react-bootstrap';
import styles from './Styles/EmployeeCurrentTask.module.css';

export default function EmployeeTask(type) {
    const { currentUser } = useAuth();
    const [task, setTask] = useState([]);
    const [loading, setLoading] = useState(true);
    /*data curenta*/
    const currentMonth = new Date().getMonth() < 10 ? '0' +  (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
    const currentDay = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
    const currentDate = new Date().getFullYear() + "-" + currentMonth + "-" +  currentDay;
    const refUsersTask = firebase.firestore().collection("users");

    function getTask() {
        
        console.log("Id-ul user-ului curent: ", currentUser.uid);
        refUsersTask.onSnapshot(querySnapshot => {
            var task = [];
            const userIds = [];
            querySnapshot.forEach(doc => {
                if(doc.data().job == 'Cultivator')
                    userIds.push(doc.id);
            })
            userIds.map(p => {
                // console.log("id-ul este: ", p);
                var userTask = firebase.firestore().collection("users").doc(p).collection("tasks").where("employeeId", "==", currentUser.uid).where('status', '==', 'To do');
                userTask.onSnapshot(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        // console.log(doc.data());
                        if(doc.data().date == currentDate)
                            task.push({id: doc.id, ...doc.data()});  
                    })
                })

            })
            console.log("task-urile atribuite user-ului curent: ", task);
            setTask(task);
            setTimeout(function(){
                setLoading(false);
            }, 1000);
        })
    }

    function moveToPending(taskId, growerId)
    {
        console.log(growerId);
        const refTask = firebase.firestore().collection("users").doc(growerId).collection("tasks").doc(taskId);
        refTask.update({status: "Pending"});
        getTask();
    }
    useEffect(() => {
        getTask();
    }, []);
    return (
        
            
        <>
        <div className={styles.cardsContainer}>
            {
            loading == false ?
            (<>
                
                {
                    task.map(p => (
                        <Card key={p.id} className={styles.card}>
                            <Card.Header>
                                <p><strong>Operațiune: </strong>{p.taskName}</p>
                            </Card.Header>
                            <Card.Body>
                                <p><strong>Data: </strong>{p.date}</p>
                                <p><strong>Ora: </strong>{p.startHour}</p>
                                <p><strong>Angajat: </strong>{p.employeeFirstName} {p.employeeLastName}</p>
                                <p><strong>Utilaj: </strong>{p.machineryName}</p>
                            </Card.Body>
                            <Card.Footer>
                                <Button variant="success" onClick={e => moveToPending(p.id, p.growerId)}>Finalizat &nbsp;<i className="fa fa-check" aria-hidden="true"></i></Button>
                            </Card.Footer>

                        </Card>
                    ))
                }
               
            </>
            )
            :
            (
                <div></div>
            )
        }
       
        </div>
        {
            task.length == 0 ?
            <p style={{color: "#871f08", fontSize: "1.2em"}}><strong>Nu există task-uri de realizat pentru ziua curentă</strong></p>
            :
            <div></div>
        }
        </>
        
       
    )
}
