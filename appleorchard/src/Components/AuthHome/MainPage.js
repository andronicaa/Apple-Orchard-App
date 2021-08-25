import React, { useState, useRef, useEffect } from 'react';
import {Doughnut} from 'react-chartjs-2';
import styles from "./Styles/MainPage.module.css";
import firebase from '../../Firebase/firebase';
import { useAuth } from '../../Firebase/context/AuthContext';
import EmployeeHeader from '../Header/EmployeeHeader';
import GrowerHeader from '../Header/GrowerHeader';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import { receiptTotal } from '../Statistics/UtilityFunctions';
import EmployeeCurrentTasks from './EmployeeCurrentTask';


export default function MainPage() {
    const{ currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [lat, setLat] = useState([]);
    const [long, setLong] = useState([]);
    const [data, setData] = useState([]);
    const role = useRef("");
    const [substances, setSubstances] = useState();
    const [machinery, setMachinery] = useState();
    const [trees, setTrees] = useState();
    const [tasks, setTask] = useState([]);
    const refRole = firebase.firestore().collection("userRole").doc(currentUser.uid); 
    const refUserSubst = firebase.firestore().collection("users").doc(currentUser.uid).collection("receipt");
    const refUserMach = firebase.firestore().collection("users").doc(currentUser.uid).collection("receiptEquipment");
    const refUserTrees = firebase.firestore().collection("users").doc(currentUser.uid).collection("receiptTrees");
    const refUserTask = firebase.firestore().collection("users").doc(currentUser.uid).collection("tasks");

    // data curenta
    const currentMonth = new Date().getMonth() < 10 ? '0' +  (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
    const currentDay = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();

    const currentDate = new Date().getFullYear() + "-" + currentMonth + "-" +  currentDay;
    const currentHour = new Date().getHours();
    const currentMinutes = new Date().getMinutes();

    
    
   

    const year = new Date().getFullYear();
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

    function getSubsts() {
        refUserSubst.onSnapshot(querySnapshot => {
            const items = [];
            const currentItems = [];
            querySnapshot.forEach(doc => {
                items.push(doc.data());
                if(doc.data().year == year)
                    currentItems.push(doc.data());
            })
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
            const total = receiptTotal(currentItems);
            setTrees(total);
        })
    }

    function getUserRole() {
        refRole.get()
            .then(doc => {
                if(doc.exists)
                {
                    console.log(doc.data().job);
                    role.current = doc.data().job;
                    setTimeout(function() {
                        setLoading(false);
                    }, 10) 
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }




    useEffect(() => {
        const fetchWeatherData = async () => {
            navigator.geolocation.getCurrentPosition(function(position) {
            setLat(position.coords.latitude);
            setLong(position.coords.longitude);
        });
            await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly&units=metric&lang=ro&appid=6d80997350a195597dacefc23437862d`)
        .then(res => res.json())
        .then(result => {
            setData(result);
            console.log("Datele despre vreme sunt: ", result);
        })
        .catch((err) => {
            console.log(err);
        });
        }
        fetchWeatherData();
        getUserRole();
        getSubsts();
        getEquip();
        getTrees();
        // getTask();
    }, [lat, long]);
    

    return (
    <div className={styles.mainPage}>
        {
           
            role.current === 'Angajat' ? 
                (
                    <EmployeeHeader />
                ) :
                (
                    <GrowerHeader />
                )  
        }
        <div>

        
        {
            (typeof data.current != 'undefined') ?
            (
                role.current === 'Cultivator' ?
                (<div className={styles.flexContainer}>
                    <Card className={styles.weatherCard}>
                        <Card.Header className={styles.cardHeader}><strong>Vremea la {new Date(data.current.dt * 1000).getDate()}-{new Date(data.current.dt * 1000).getMonth() + 1}-{new Date(data.current.dt * 1000).getFullYear()} {new Date(data.current.dt * 1000).getHours()}:{new Date(data.current.dt * 1000).getMinutes()}</strong>
                            <img src={"http://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png"} />
                        </Card.Header>
                        <Card.Body>
                            <p><strong>Temperatura: </strong>{data.current.temp} &deg;C</p>
                            <p><strong>Temp. resimtita: </strong>{data.current.feels_like} &deg;C</p>
                            <p><strong>Nori: </strong>{data.current.clouds} %</p>
                            <p><strong>Umiditate: </strong>{data.current.humidity} %</p>
                            <p><strong>Precipitatii: </strong>{data.current.weather[0].description}</p>
                        </Card.Body>
                        <Card.Footer>
                            <Link to={{
                                pathname: '/weather',
                                state: {data}
                                }}><Button className={styles.progTreat}>Vremea &nbsp; <i className="fa fa-arrow-right" aria-hidden="true"></i></Button></Link>
                        </Card.Footer>
                    </Card>
                    <Card className={styles.taskCard}>
                        <Card.Header>
                            <strong>Stropit acarieni</strong>
                        </Card.Header>
                        <Card.Body>
                            <p><strong>Data: </strong>25-08-2021</p>
                            <p><strong>Angajat: </strong> Andronic Alexandru</p>
                            <p><strong>Utilaj: </strong> Tractor v4</p>
                            <p><strong>Substante utilizate: </strong> Chorus50</p>
                            <p><strong>Doza: </strong> 1.49kg</p>
                        </Card.Body>
                        <Card.Footer>
                            <Button className={styles.taskButton}>
                                Vezi operațiuni &nbsp; <i className="fa fa-tasks" aria-hidden="true"></i>
                            </Button>
                        </Card.Footer>
                    </Card>
                </div>

                )
                :
                (<div className={styles.employeeContainer}>
                    <EmployeeCurrentTasks/>
                </div>
                )
                
            )
            :
            (
                <div>
                    <Spinner animation="border" variant="danger"/>
                </div>
            )
        }

        
        {/* <Card className={styles.pieContainer}>
            <h5 className="text-center">Cheltuieli anul curent</h5>
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
        </Card> */}
        </div>
    </div>
    )
}
