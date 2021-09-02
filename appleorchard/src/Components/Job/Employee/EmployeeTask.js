import React, { useState, useEffect } from 'react';
import firebase from '../../../Firebase/firebase';
import { useAuth } from '../../../Firebase/context/AuthContext';
import styles from '../Style/EmployeeTask.module.css';
import { Button, Table, Card } from 'react-bootstrap';
import EmployeeHeader from '../../Header/EmployeeHeader';

export default function EmployeeTask(type) {
    const { currentUser } = useAuth();
    const [task, setTask] = useState([]);
    const [loading, setLoading] = useState(true);
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
    }
    useEffect(() => {
        getTask();
    }, []);
    return (
        
            
        <div className={styles.mainPage}>
        <EmployeeHeader />  
        
            {
            loading == false ?
            (<>
                <div className={styles.tableContainer}>
                <Table className={styles.table}>
                    <thead className={styles.tableHead}>
                        <tr>
                            <th>Operațiune</th>
                            <th>Data</th>
                            <th>Ora</th>
                            <th>Angajat</th>
                            <th>Finalizat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            task.map(p => (
                                <tr key={p.id}>
                                    <td>{p.taskName}</td>
                                    <td>{p.date}</td>
                                    <td>{p.startHour}</td>
                                    <td>{p.employeeFirstName} {p.employeeLastName}</td>
                                    <td><Button variant="success" onClick={e => moveToPending(p.id, p.growerId)}><i className="fa fa-check" aria-hidden="true"></i></Button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
                </div>
                <div className={styles.smallScreen}>
                {
                    task.map(p => (
                        <Card key={p.id} className={styles.card}>
                            <p><strong>Operațiune: </strong>{p.taskName}</p>
                            <p><strong>Data: </strong>{p.date}</p>
                            <p><strong>Ora: </strong>{p.startHour}</p>
                            <p><strong>Angajat: </strong>{p.employeeFirstName} {p.employeeLastName}</p>
                            {/* <td><Button variant="success" onClick={e => moveToDone(p.id)}><i className="fa fa-check" aria-hidden="true"></i></Button></td> */}
                        </Card>
                    ))
                }
                </div>
            </>
            )
            :
            (
                <div></div>
            )
        }
        
        </div>
          
        
       
    )
}
