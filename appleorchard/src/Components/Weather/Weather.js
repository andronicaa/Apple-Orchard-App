import React, { useEffect, useState } from 'react'
import { Card, Row, Button } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import OrchardMenu from '../Orchard/OrchardMenu';
import Loader from "react-loader-spinner";
import styles from './Style/Weather.module.css';


export default function Weather() {
    const [lat, setLat] = useState([]);
    const [long, setLong] = useState([]);
    const [data, setData] = useState([]);
    const index1 = [0, 1, 2, 3];
    const index2 = [4, 5, 6, 7];
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
            
            console.log(result);
        })
        .catch((err) => {
            console.log(err);
        });
        }
        fetchWeatherData();
    }, [lat, long]);

    console.log(lat, long);
    
    function redirectToTreatment(e) {
        e.preventDefault();
        
            <Redirect 
               to={{
                   pathname: "/program-treatment", 
                   state: {weather: data}
               }}
            />
        
    }
    const days = ['Duminică','Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă']
    return (
        <div>
            <OrchardMenu />
            {
                (typeof data.current != 'undefined') ? (
                    <div className={styles.mainContainer}>
                    <Row className={styles.rowContainer}>
                        <Link to={{
                            pathname: '/task',
                            state: {data}
                        }}><Button variant="success">Programeaza tratament</Button></Link>
                        <div className={styles.flexContainer1}>
                            
                                
                                {
                                    index1.map((i) => (
                                        <Card className={styles.cardContainer}>
                                            <Card.Header className="d-flex flex-column">
                                                <div className="d-flex flex-row justify-content-around">
                                                    <p><strong>{days[new Date(data.daily[i].dt * 1000).getDay()]} {new Date(data.daily[i].dt * 1000).getDate()}-{new Date(data.daily[i].dt * 1000).getMonth() + 1}-{new Date(data.daily[i].dt * 1000).getFullYear()}</strong></p>
                                                    <img src={"http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png"} />
                                                </div>
                                            </Card.Header>
                                            <Card.Body>
                                                <p>Temp. medie: {data.daily[i].temp.day} &deg;C</p>
                                                <p>Temp. min: {data.daily[i].temp.min} &deg;C</p>
                                                <p>Temp. max: {data.daily[i].temp.max} &deg;C</p>
                                                <p>Nori: {data.daily[i].clouds} %</p>
                                                <p>Precipitatii: {data.daily[i].weather[0].description}</p>
                                            </Card.Body>
                                        </Card>
                                    ))
                                }
                            
                        </div>
                        <div className={styles.flexContainer2}>
                            {
                                    index2.map((i) => (
                                        <Card className={styles.cardContainer}>
                                            <Card.Header className="d-flex flex-row justify-content-around">
                                                <p><strong>{days[new Date(data.daily[i].dt * 1000).getDay()]} {new Date(data.daily[i].dt * 1000).getDate()}-{new Date(data.daily[i].dt * 1000).getMonth() + 1}-{new Date(data.daily[i].dt * 1000).getFullYear()}</strong></p>
                                                <img src={"http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png"} />
                                            </Card.Header>
                                            <Card.Body>
                                                <p>Temp. medie: {data.daily[i].temp.day} &deg;C</p>
                                                <p>Temp. min: {data.daily[i].temp.min} &deg;C</p>
                                                <p>Temp. max: {data.daily[i].temp.max} &deg;C</p>
                                                <p>Nori: {data.daily[i].clouds} %</p>
                                                <p>Precipitatii: {data.daily[i].weather[0].description}</p>
                                            </Card.Body>
                                        </Card>
                                    ))
                                }
                        </div>
                    </Row>
                    </div>
                ) : (
                    <div className={styles.loaderContainer}>

                        <Loader 
                            type="Puff"
                            color="#00bfff"
                            height={100}
                            width={100}
                            timeout={3000}
                        />
                    </div>
                )
            }
        </div>
    )
}
