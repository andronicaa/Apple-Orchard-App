import React, { useState, useRef, useEffect } from 'react';
import styles from "./Styles/MainPage.module.css";
import firebase from '../../Firebase/firebase';
import { useAuth } from '../../Firebase/context/AuthContext';
import EmployeeHeader from '../Header/EmployeeHeader';
import GrowerHeader from '../Header/GrowerHeader';
import { Card, Button } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';

export default function MainPage() {
    const{ currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(true);
    const [lat, setLat] = useState([]);
    const [long, setLong] = useState([]);
    const [data, setData] = useState([]);
    const role = useRef("");
    const refRole = firebase.firestore().collection("userRole").doc(currentUser.uid); 
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
            // setTimeout(function(){
            //     setLoading1(false);
            // }, 1000);
            console.log("Datele despre vreme sunt: ", result);
        })
        .catch((err) => {
            console.log(err);
        });
        }
        fetchWeatherData();
        getUserRole();
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
        {
            (typeof data.current != 'undefined') ?
            (
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
                        <Button className={styles.progTreat}>Programeaza tratament</Button>
                    </Card.Footer>
                </Card>
            )
            :
            (
                <div>
                    <Spinner animation="border" variant="danger"/>
                </div>
            )
        }
        
    </div>
    )
}
