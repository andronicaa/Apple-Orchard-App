import React, { useState, useEffect } from 'react';
import firebase from '../../../Firebase/firebase';
import { useAuth } from '../../../Firebase/context/AuthContext';
import styles from '../Style/EmployeeTask.module.css';
import { Button, Table, Card } from 'react-bootstrap';
import EmployeeHeader from '../../Header/EmployeeHeader';

export default function EmployeeTask() {
    const { currentUser } = useAuth();
    const [task, setTask] = useState([]);
    const [loading, setLoading] = useState(true);
    const refTask = firebase.firestore().collection("users").doc(currentUser.uid).collection("emplTask").where('status', '==', 'To do');

    function getTask() {
        refTask.onSnapshot(querySnapshot => {
            const taskItems = [];
            querySnapshot.forEach(doc => {
                taskItems.push({id: doc.id, ...doc.data()});
            })
            setTask(taskItems);
            setTimeout(function() {
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
        <div className={styles.tableContainer}>
            {
            loading == false ?
            (<>
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
                <div className={styles.smallScreen}>
                {
                    task.map(p => (
                        <Card key={p.id}>
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
    </div>
    )
}
