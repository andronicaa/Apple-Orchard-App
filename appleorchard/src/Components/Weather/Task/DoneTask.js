import React, { useState, useEffect } from 'react'
import firebase from '../../../Firebase/firebase';
import { useAuth } from '../../../Firebase/context/AuthContext';
import { Table, Button, Card } from 'react-bootstrap';
import styles from '../Style/AllTasks.module.css';

export default function ToDoTask() {
    const { currentUser } = useAuth();
    const [doneTask, setDoneTask] = useState([]);
    const [loadingDoneTask, setLoadingDoneTask] = useState(true);
    const refDoneTask = firebase.firestore().collection("users").doc(currentUser.uid).collection("tasks").where('status', '==', 'Done');

    

    function getDoneTask() {
        refDoneTask.onSnapshot(querySnapshot => {
            const taskItem = [];
            querySnapshot.forEach(doc => {
                taskItem.push({id: doc.id,...doc.data()});
            })
            setDoneTask(taskItem);
            setTimeout(function() {
                setLoadingDoneTask(false);
            }, 1000);
        })
    }

    function deleteTask(taskId) {
        const refTask = firebase.firestore().collection("users").doc(currentUser.uid).collection("tasks").doc(taskId);
        refTask.delete()
        .then(() => {
            console.log("deleted task")
        })
        .catch(err => {
            console.log(err);
        })
    }
    useEffect(() => {
        getDoneTask();
    }, []);
    return (
        <div className={styles.tableContainer}>
            {
                loadingDoneTask == false ?
                (<>
                    <Table className={styles.table}>
                        <thead className={styles.tableHead}>
                            <tr>
                                <th>Operatiune</th>
                                <th>Data</th>
                                <th>Ora</th>
                                <th>Angajat</th>
                                <th>Elimina</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                doneTask.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.taskName}</td>
                                        <td>{p.date}</td>
                                        <td>{p.startHour}</td>
                                        <td>{p.employeeFirstName} {p.employeeLastName}</td>
                                        <td><Button  variant="danger" onClick={e => deleteTask(p.id)}><i className="fa fa-trash" aria-hidden="true"></i></Button></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                    <div className={styles.smallScreen}>
                        {
                            doneTask.map(p => (
                                <Card>
                                    <p><strong>Operatiune: </strong>{p.taskName}</p>
                                    <p><strong>Data: </strong>{p.date}</p>
                                    <p><strong>Ora: </strong>{p.startHour}</p>
                                    <p><strong>Angajat: </strong>{p.employeeFirstName} {p.employeeLastName}</p>
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
