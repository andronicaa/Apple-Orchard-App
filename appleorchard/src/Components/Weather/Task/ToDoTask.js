import React, { useState, useEffect } from 'react'
import firebase from '../../../Firebase/firebase';
import { useAuth } from '../../../Firebase/context/AuthContext';
import { Table, Button, Card } from 'react-bootstrap';
import styles from '../Style/AllTasks.module.css';
import Tooltip from "@material-ui/core/Tooltip";


export default function ToDoTask() {
    const { currentUser } = useAuth();
    const [toDotask, setToDoTask] = useState([]);
    const [loadingToDoTask, setLoadingToDoTask] = useState(true);
    const refToDoTask = firebase.firestore().collection("users").doc(currentUser.uid).collection("tasks").where('status', 'in', ['To do', 'Pending']);
    
    /* data curenta */
    const currentMonth = new Date().getMonth() < 10 ? '0' +  (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
    const currentDay = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
    const currentDate = new Date().getFullYear() + "-" + currentMonth + "-" +  currentDay;

    function getToDoTask() {
        refToDoTask.onSnapshot(querySnapshot => {
            const taskItem = [];
            querySnapshot.forEach(doc => {
                if(doc.data().date == currentDate)
                    taskItem.push({id: doc.id,...doc.data()});
            })
            setToDoTask(taskItem);
            setTimeout(function() {
                setLoadingToDoTask(false);
            }, 1000);
        })
    }

    function moveToDone(taskId)
    {
        const refTask = firebase.firestore().collection("users").doc(currentUser.uid).collection("tasks").doc(taskId);
        refTask.update({status: "Done"});
    }
    useEffect(() => {
        getToDoTask();
    }, []);
    return (
        <div className={styles.tableContainer}>
             {
                loadingToDoTask == false ?
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
                                toDotask.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.taskName}</td>
                                        <td>{p.date}</td>
                                        <td>{p.startHour}</td>
                                        <td>{p.employeeFirstName} {p.employeeLastName}</td>
                                        {
                                            p.status == 'To do' ?
                                            <>
                                                <Tooltip title="Acest task nu a fost efectuat.">
                                                <td><Button variant="success" onClick={e => moveToDone(p.id)}><i className="fa fa-check" aria-hidden="true"></i></Button></td>
                                                </Tooltip>
                                            </>
                                            :
                                            <>
                                            <Tooltip title="Angajatul a realizat acest task. Apasati pentru a confirma.">
                                                <td><Button variant="warning" onClick={e => moveToDone(p.id)}><i className="fa fa-clock-o" aria-hidden="true"></i></Button></td>
                                            </Tooltip>
                                            </>
                                        }
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                    <div className={styles.smallScreen}>
                    {
                        toDotask.map(p => (
                            <Card key={p.id}>
                                <p><strong>Operațiune: </strong>{p.taskName}</p>
                                <p><strong>Data: </strong>{p.date}</p>
                                <p><strong>Ora: </strong>{p.startHour}</p>
                                <p><strong>Angajat: </strong>{p.employeeFirstName} {p.employeeLastName}</p>
                                <td><Button variant="success" onClick={e => moveToDone(p.id)}><i className="fa fa-check" aria-hidden="true"></i></Button></td>
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
