import React, { useState, useEffect } from 'react';
import firebase from '../../../Firebase/firebase';
import { useAuth } from '../../../Firebase/context/AuthContext';
import styles from '../Style/AcceptedRejected.module.css';
import empStyles from '../Style/Employer.module.css';
import { Table, Card } from 'react-bootstrap';
import EmployeeHeader from '../../Header/EmployeeHeader';


export default function Employer() {
    const { currentUser } = useAuth();
    const [employer, setEmployer] = useState([]);
    const [loading, setLoading] = useState(true);
    const refUsers = firebase.firestore().collection("users");
    const refEmployer = firebase.firestore().collection("users").doc(currentUser.uid).collection("onHold");
    function getEmployer() {
        refUsers.onSnapshot(querySnapshot => {
            const users = [];
            const employer = [];
            querySnapshot.forEach(doc => {
                if(doc.data().job === 'Cultivator')
                    users.push({id: doc.id, ...doc.data()});
            })
            users.map(i => {
                var refEmployer = firebase.firestore().collection("users").doc(i.id).collection("onHold").where('employeeId', '==', currentUser.uid).where('status', '==', 'accepted offer');
                refEmployer.onSnapshot(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        employer.push({id: doc.id, employerFirstName: i.firstName, employerLastName: i.lastName, suprf: i.suprf, phoneNumber: i.phoneNumber, companyName: i.companyName, address: i.address, ...doc.data()})
                    })
                })
            
            })
            console.log(employer);
            setEmployer(employer);
            setTimeout(function() {
                setLoading(false);
            }, 1000);
        })
       
    }
  
    useEffect(() => {
        getEmployer();
    }, []);
    return (
        <div className={empStyles.mainPage}>
            <EmployeeHeader />
            <div className={empStyles.tableContainer}>
            <Table className={empStyles.table}>
                <thead>
                    <tr className={styles.tableHead}>
                        <th>Nume</th>
                        <th>Localitate</th>
                        <th>Denumire companie</th>
                        <th>Suprafata livada</th>
                        <th>Nr. Telefon</th>
                        <th>Post</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        loading == false ?
                            employer.map(p => (
                           
                            <tr key={p.id}>
                                <td>{p.employerFirstName} {p.employerLastName}</td>
                                <td>{p.address}</td>
                                <td>{p.companyName}</td>
                                <td>{p.suprf}</td>
                                <td>{p.phoneNumber}</td>
                                <td>{p.postName}</td>
                            </tr>
                            ))
                        :
                            <div></div>
                    
                        
                    }
                </tbody>
            </Table>
            </div>
            <div className={empStyles.smallScreen}>
            {
                loading == false ? 
                (
                    employer.map(p => (
                        <Card key={p.id} className={empStyles.postCard}>
                            <Card.Header style={{color: "#871f08"}}><strong>{p.employerFirstName} {p.employerLastName}</strong></Card.Header>
                            <Card.Body>
                                <p><strong>Adresa: </strong>{p.address}</p>
                                <p><strong>Denumire companie: </strong>{p.companyName}</p>
                                <p><strong>Suprafata livada: </strong>{p.suprf}</p>
                                <p><strong>Post: </strong>{p.postName}</p>
                            </Card.Body>
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
    )
}
