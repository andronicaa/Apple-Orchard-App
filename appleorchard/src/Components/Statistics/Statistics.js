import React, { useState, useEffect, useRef } from 'react';
import {Doughnut, Line, Bar} from 'react-chartjs-2';
import styles from './Style/Statistics.module.css';
import { useAuth } from '../../Firebase/context/AuthContext';
import firebase from '../../Firebase/firebase';
import Spinner from 'react-bootstrap/Spinner';
import { receiptTotal, noEmployee, annualSalary } from './UtilityFunctions';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';
import OrchardMenu from '../Orchard/OrchardMenu';
import Annual from './Annual';


export default function Statistics() {
    const { currentUser } = useAuth();
    const [substances, setSubstances] = useState();
    const [subst, setSubst] = useState([]);
    const [machinery, setMachinery] = useState();
    const [mach, setMach] = useState([]);
    const [trees, setTrees] = useState();
    const [tr, setTr] = useState([]);
    const [employee, setEmployee] = useState([]);
    const [profit, setProfit] = useState([]);
    const profit1 = useRef();
    const profit2 = useRef();
    const profit3 = useRef();
    const profit4 = useRef();
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const year = new Date().getFullYear();
    const formYear = useRef(year);
    const [formYearParam, setFormYearParam] = useState(year);
    const refUserSubst = firebase.firestore().collection("users").doc(currentUser.uid).collection("receipt");
    const refUserMach = firebase.firestore().collection("users").doc(currentUser.uid).collection("receiptEquipment");
    const refUserTrees = firebase.firestore().collection("users").doc(currentUser.uid).collection("receiptTrees");
    const refUserProfit = firebase.firestore().collection("users").doc(currentUser.uid).collection("userProfit");
    const refUserEmployee = firebase.firestore().collection("users").doc(currentUser.uid).collection("onHold").where("status", '==', 'accepted offer');
    function getEmployee() {
        refUserEmployee.onSnapshot(querySnapshot => {
            const items = [];
            querySnapshot.forEach(doc => {
                items.push(doc.data());
            })
            setEmployee(items);
        })
    }
    function getUserProfit() {
        refUserProfit.onSnapshot(querySnapshot => {
            const items = [];
            querySnapshot.forEach(doc => {
                items.push(doc.data());
            })
            setProfit(items);
            setTimeout(function() {
                setLoading(false);
            }, 1000);
        })
    }
    function getSubsts() {
        refUserSubst.onSnapshot(querySnapshot => {
            const items = [];
            const currentItems = [];
            querySnapshot.forEach(doc => {
                items.push(doc.data());
                if(doc.data().year == year)
                    currentItems.push(doc.data());
            })
            setSubst(items);
            const total = receiptTotal(currentItems);
            setSubstances(total);
        })
    }

    function getEquip() {
        refUserMach.onSnapshot(querySnapshot => {
            const items = [];
            const currentItems = [];
            querySnapshot.forEach(doc => {
                items.push(doc.data());
                if(doc.data().year == year)
                    currentItems.push(doc.data());
            })
            setMach(items);
            const total = receiptTotal(currentItems);
            setMachinery(total);
        })
    }

    function getTrees() {
        refUserTrees.onSnapshot(querySnapshot => {
            const items = [];
            const currentItems = [];
            querySnapshot.forEach(doc => {
                items.push(doc.data());
                if(doc.data().year == year)
                    currentItems.push(doc.data());
            })
            setTr(items);
            const total = receiptTotal(currentItems);
            setTrees(total);
        })
    }

    function addProfit(e, profit1, profit2, profit3, profit4) {
        e.preventDefault();
        refUserProfit.add(
            {
                profit1: profit1,
                profit2: profit2,
                profit3: profit3,
                profit4: profit4
            }
        ).catch(err => {
            console.log(err);
        })
    }
    const pieData = {
        labels: ['Substante', 'Pomi', 'Utilaje'],
        datasets: [
            {
                label: 'Rainfall',
                backgroundColor: [
                  '#e68639',
                  '#c65547',
                  '#fed17f'
                ],

                hoverBackgroundColor: [
                '#dbeaff',
                '#314e8d',
                '#adc8ff'
                ],
                data: [substances, trees, machinery]
              }
        ]
    }

    function getLineData() {
        return {
        labels: [year - 4, year - 3, year - 2, year - 1],
        datasets: [
          {
            label: 'Profit (lei)',
            backgroundColor: 'rgba(239,161,89, .9)',
            borderColor: 'rgba(194,82,68, 1)',
            borderWidth: 2,
            data: [profit[0].profit4, profit[0].profit3, profit[0].profit2, profit[0].profit1]
          }
        ]
    }
    }
    
    
  
    function getLineDataEmployee(data) {
        return {
            labels: [year - 3, year - 2, year - 1, year],
            datasets: [
              {
                label: 'Angajati',
                backgroundColor: 'rgba(239,161,89, .9)',
                borderColor: 'rgba(194,82,68, 1)',
                borderWidth: 2,
                data: [noEmployee(employee, year - 3), noEmployee(employee, year - 2), noEmployee(employee, year - 1), noEmployee(employee, year)]
              }
            ]
        }
    }

    function getBarSalaryEmployee(data) {
        return {
            labels: [year - 3, year - 2, year - 1, year],
            datasets: [
              {
                label: 'Angajati',
                backgroundColor: 'rgba(239,161,89, .9)',
                borderColor: 'rgba(194,82,68, 1)',
                borderWidth: 2,
                data: [annualSalary(employee, year - 3), annualSalary(employee, year - 2), annualSalary(employee, year - 1), annualSalary(employee, year)]
              }
            ]
        }
    }

    function handleSubmit(e, formYear) {
        e.preventDefault();
        setFormYearParam(formYear);
    }
    useEffect(() => {
        getSubsts();
        getEquip();
        getTrees();
        getUserProfit();
        getEmployee();
    }, [formYearParam]);
    return (
        <div className={styles.page}>
        <OrchardMenu />
        <div className={styles.formContainer}>
            <Form>
            <Form.Group>
                <Form.Label htmlFor="description"><strong className={styles.tags}>An</strong></Form.Label>
                    <InputGroup>
                        <InputGroup.Prepend id="inputGroupPrependYear">
                            <InputGroup.Text>
                                <i className={`fa fa-calendar ${styles.icons}`} aria-hidden="true" />
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control 
                            ref={formYear}
                            type="number"
                            placeholder="An..."
                            aria-describedby="inputGroupPrependYear"
                            required
                        />
                    <Form.Text>
                        Alege anul pentru care doresti sa afli statisticile despre cheltuielile pentru pomi, utilaje, substante
                    </Form.Text>
                    </InputGroup>
                    <Button onClick={e => handleSubmit(e, formYear.current.value)} className={styles.handleSubmitButton}>Cauta</Button>
                </Form.Group>
            </Form>
        </div>
        <div className={styles.mainContainer}>
            
            
            <div className={styles.colContainer}>
                    {
                        profit.length == 0 ? 
                        (   <div>
                                <h5>Adauga profitul din ultimii ani</h5>
                                <Button variant="success" onClick={handleShow}>Adauga</Button>
                                <Modal show={show} onHide={handleClose} animation={false}>
                                    <Form className={styles.formProfit}>
                                        <div className={styles.formTitle}>
                                            <h4>Profitul din ultimii 4 ani</h4>
                                        </div>
                                        <Form.Group>
                                        <Form.Label className={styles.formText}><strong>Profit anul {year - 1}</strong></Form.Label>
                                        <InputGroup>
                                            <InputGroup.Prepend id="inputGroupPrependProfit1">
                                                <InputGroup.Text>
                                                    <i className={`fa fa-money ${styles.formText}`} aria-hidden="true"></i>
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <Form.Control type="text" ref={profit1} aria-describedby="inputGroupPrependProfit1" />
                                        </InputGroup>
                                        </Form.Group>

                                        <Form.Group>
                                        <Form.Label className={styles.formText}><strong>Profit anul {year - 2}</strong></Form.Label>
                                        <InputGroup>
                                            <InputGroup.Prepend id="inputGroupPrependProfit2">
                                                <InputGroup.Text>
                                                    <i className={`fa fa-money ${styles.formText}`} aria-hidden="true"></i>
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <Form.Control  type="text" ref={profit2} aria-describedby="inputGroupPrependProfit2"/>
                                          
                                        </InputGroup>
                                        </Form.Group>

                                        <Form.Group>
                                        <Form.Label className={styles.formText}><strong>Profit anul {year - 3}</strong></Form.Label>
                                        <InputGroup>
                                            <InputGroup.Prepend id="inputGroupPrependProfit3">
                                                <InputGroup.Text>
                                                    <i className={`fa fa-money ${styles.formText}`} aria-hidden="true"></i>
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <Form.Control  type="text" ref={profit3} aria-describedby="inputGroupPrependProfit3"/>
                                           
                                        </InputGroup>
                                        </Form.Group>

                                        <Form.Group>
                                        <Form.Label className={styles.formText}><strong>Profit anul {year - 4}</strong></Form.Label>
                                        <InputGroup>
                                            <InputGroup.Prepend id="inputGroupPrependProfit4">
                                                <InputGroup.Text>
                                                    <i className={`fa fa-money ${styles.formText}`} aria-hidden="true"></i>
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <Form.Control type="text" ref={profit4} aria-describedby="inputGroupPrependProfit4" />
                                            
                                        </InputGroup>
                                        </Form.Group>
                                        <div className="text-center">
                                            <Button className={styles.formButton} onClick={e => addProfit(e, profit1.current.value, profit2.current.value, profit3.current.value, profit4.current.value)}>Adauga profit</Button>
                                        </div>
                                    </Form>
                                </Modal>
                            </div>
                        )
                        :
                        (
                    
                           
                            loading == false ?
                            (   <div className={styles.profitContainer}>
                                    <h5 className={styles.title}>Profitul din ultimii 4 ani</h5>
                                    <Line
                                    className={styles.lineContainer}
                                    data={getLineData}
                                    options={{
                                        title:{
                                        display:true,
                                        text:'Profitul din ultimii 4 ani',
                                        fontSize:30
                                        },
                                        legend:{
                                        display:true,
                                        position:'right'
                                        }
                                    }}
                                    />
                                </div>
                            )
                            :
                            (
                                <div className={styles.spinnerContainer}>
                                    <Spinner animation="border" variant="danger"/>
                                </div>
                            )
                        )
                    }
                </div>
                <div lg={4} xs={12} className={styles.colContainer}>
                    <h5 className={styles.title}>Cheltuieli anul curent</h5>
                    <Doughnut
                    data={pieData}
                    options={{
                        title:{
                        display:true,
                        text:'Cheltuieli anuale',
                        fontSize:20
                        },
                        legend:{
                        display:true,
                        position:'right'
                        }
                    }}
                    />
                </div>
           
                
                <div className={styles.colContainer}>
                    <h5 className={styles.title}>Cheltuieli lunare substante</h5>
                    <Annual type="substante" year={formYearParam} />
                </div>
                <div className={styles.colContainer}>
                    <h5 className={styles.title}>Cheltuieli lunare utilaje</h5>
                    <Annual type="utilaje" year={formYearParam} />
                </div>

           
            
                
                <div  className={styles.colContainer}>
                    <h5 className={styles.title}>Cheltuieli lunare pomi</h5>
                    <Annual type="pomi" year={formYearParam} />
                </div>
                <div  className={styles.colContainer}>
                    <h5 className={styles.title}>Numarul salariatilor</h5>
                    <Line
                        className={styles.lineContainer}
                        data={getLineDataEmployee(employee)}
                        options={{
                            title:{
                            display:true,
                            fontSize:30
                            },
                            legend:{
                            display:true,
                            position:'right'
                            }
                        }}
                        />
                </div>
                <div className={styles.colContainer}>
                    <h5 className={styles.title}>Totalul salariilor anuale</h5>
                    <Bar
                    data={getBarSalaryEmployee(employee)}
                    options={{
                        title:{
                        display:true,
                        fontSize:20
                        },
                        legend:{
                        display:true,
                        position:'right'
                        }
                    }}
                    />
                </div>
           
        <div>
            
        </div>
        </div>
        </div>
    )
}
