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
    const [currentTask, setCurrentTask] = useState({});
    const [loadingTask, setLoadingTask] = useState(true);
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

    function checkHour(time1, time2) {
        if(time1[1] == ':')
        {
            var hh1 = parseInt(time1[0]);
            var mm1 = parseInt(time1.substring(2, 4));
        }
        else
        {
            var hh1 = parseInt(time1.substring(0, 2));
            var mm1 = parseInt(time1.substring(3, 5));
        }
        
        if(time2[1] == ':')
        {
            var hh2 = parseInt(time2[0]);
            var mm2 = parseInt(time2.substring(2, 4));
        }
        else
        {
            var hh2 = parseInt(time2.substring(0, 2));
            var mm2 = parseInt(time2.substring(3, 5));
        }
        if(hh1 > hh2) {
            return true;
        }
        if(hh1 < hh2) {
            return false;
        }
        if(hh1 == hh2) {
            if(mm1 > mm2)
                return true;
            else
                return false;
        }
    }
    function sortByHour(tsk) {
        var sortedTask = [];
        for(let i = 0; i < tsk.length - 1; i++)
            for (let j = i + 1; j < tsk.length; j++) {
                if(checkHour(tsk[i].startHour, tsk[j].startHour))
                {
                    let aux = tsk[i];
                    tsk[i] = tsk[j];
                    tsk[j] = aux;
                }
            }
        return tsk;
    }
    function afterCurrentHour(hour) {
        
        if(hour[1] == ':')
        {
            var hh1 = parseInt(hour[0]);
            var mm1 = parseInt(hour.substring(2, 4));
        }
        else
        {
            var hh1 = parseInt(hour.substring(0, 2));
            var mm1 = parseInt(hour.substring(3, 5));
        }
        
        if(hh1 > currentHour) {
            return true;
        }
        if(hh1 == currentHour)
        {
            if(mm1 >= currentMinutes)
                return true;
        }
        return false;
    }
    function getCurrentTask() {
        console.log("Data curenta este: ", currentDate);
        refUserTask.onSnapshot(querySnapshot => {
            var taskItems = [];
            querySnapshot.forEach(doc => {
                // console.log(doc.data().date == currentDate && afterCurrentHour(doc.data().startHour));
                if(doc.data().date == currentDate)
                    taskItems.push(doc.data());
            })
            // console.log("Task-urile inainte de sortare sunt: ", taskItems);
            taskItems = sortByHour(taskItems);
            // console.log("Task-urile sortate dupa ora sunt: ", taskItems);
            
            taskItems.map(t => {
                // console.log("Task-urile sortate sunt: ", t);
                if(afterCurrentHour(t.startHour))
                {   
                    console.log("Task-ul este: ", t);
                    setCurrentTask(t);
                    setTimeout(function() {
                        setLoadingTask(false);
                    }, 1000);
                    return;
                }
            })
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
        // getTask();
    }, [lat, long]);
    
    useEffect(() => {
        getUserRole();
        getSubsts();
        getEquip();
        getTrees();
        getCurrentTask();
    }, []);
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
                            <p><strong>Temp. resimtiță: </strong>{data.current.feels_like} &deg;C</p>
                            <p><strong>Nori: </strong>{data.current.clouds} %</p>
                            <p><strong>Umiditate: </strong>{data.current.humidity} %</p>
                            <p><strong>Precipitații: </strong>{data.current.weather[0].description}</p>
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
                            <p><strong>Data: </strong>{currentTask.date}</p>
                            <p><strong>Angajat: </strong>{currentTask.employeeLastName} {currentTask.employeeFirstName}</p>
                            <p><strong>Utilaj: </strong>{currentTask.machineryName}</p>
                            <p><strong>Ora: </strong>{currentTask.startHour}</p>
                            {
                                typeof currentUser.chosenProduct != 'undefined'?
                                <>
                                    <p><strong>Substanțe utilizate: </strong>{currentTask.chosenProduct}</p>
                                    <p><strong>Doza: </strong>{currentTask.calcultedDose}</p>
                                </>
                                :
                                    <div></div>
                            }
                            
                            
                        </Card.Body>
                        <Card.Footer>
                            <Link
                                to={{
                                    pathname:'/weather',
                                    state:{data}
                                }}
                            >
                                <Button className={styles.taskButton}>
                                    Vezi operațiuni &nbsp; <i className="fa fa-tasks" aria-hidden="true"></i>
                                </Button>
                            </Link>
                            
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
                <div> </div>
            )
        }
        </div>
    </div>
    )
}
