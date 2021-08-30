import React, { useState, useEffect } from 'react';
import firebase from '../../../Firebase/firebase';
import { useAuth } from '../../../Firebase/context/AuthContext';
import styles from '../Style/AllTasks.module.css';
import { Button, Card, Table } from 'react-bootstrap';
import Tooltip from "@material-ui/core/Tooltip";


export default function AllTasks() {
    const { currentUser } = useAuth();
    const [task, setTask] = useState([]);
    const [loading, setLoading] = useState(true);
    const refTask = firebase.firestore().collection("users").doc(currentUser.uid).collection("tasks");
    /* data curenta */
    const currentMonth = new Date().getMonth() < 10 ? '0' +  (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
    const currentDay = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
    const currentDate = new Date().getFullYear() + "-" + currentMonth + "-" +  currentDay;


    function gellAllTasks() {
        refTask.onSnapshot(querySnapshot => {
            const taskItems = [];
            querySnapshot.forEach(doc => {
                if(doc.data().date >= currentDate) {
                    taskItems.push({id: doc.id, ...doc.data()})
                }
            })
            setTask(taskItems);
            setTimeout(function() {
                setLoading(false);
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
        gellAllTasks();
    }, []);
    return (
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
                                <th>Elimină</th>
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
                                        <Tooltip title="Eliminare definitivă a acestei operațiuni.">
                                            <td><Button variant="danger" onClick={() => deleteTask(p.id)}><i className="fa fa-trash" aria-hidden="true"></i></Button></td>
                                        </Tooltip>
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
                                <td><Button variant="danger"><i className="fa fa-trash" aria-hidden="true"></i></Button></td>
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