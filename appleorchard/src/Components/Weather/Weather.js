import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import OrchardMenu from '../Orchard/OrchardMenu';
import styles from './Style/Weather.module.css';
import Spinner from 'react-bootstrap/Spinner';

export default function Weather() {
    /* datele despre vreme primite prin param */
    const location = useLocation();
    const weatherData  = location.state.data;
    console.log("Datele primite in vreme sunt: ", weatherData);
    const [showIndex1, setShowIndex1] = useState(true);
    const [showIndex2, setShowIndex2] = useState(false);
    const index1 = [0, 1, 2, 3];
    const index2 = [4, 5, 6, 7];
    
    function handleRightArrow()
    {
        setShowIndex1(false);
        setShowIndex2(true);
    }

    function handleLeftArrow() {
        setShowIndex2(false);
        setShowIndex1(true);
    }

    const days = ['Duminică','Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă']
    return (
        <div className={styles.mainPage}>
            <OrchardMenu />
            {
                       
                        (typeof weatherData.current != 'undefined') ?
                        (<>
                            
                            
                            <Card className={styles.card}>
                                <Card.Header>
                                    <p style={{fontSize: "1.5em", color: "#871f08"}}><strong>Vremea pe 8 zile</strong></p>
                                </Card.Header>
                                <Card.Body className={styles.flexContainer}>
                            {
                                showIndex2 ?
                                (
                                    <Button className={styles.arrowButton} onClick={handleLeftArrow}><i className="fa fa-arrow-left" aria-hidden="true"></i></Button>
                                )
                                :
                                (
                                    <div></div>
                                )
                            }
                            {
                                showIndex1 ?
                                (
                                    index1.map((i) => (
                                        <Card className={styles.cardContainer}>
                                            <Card.Header className="d-flex flex-column">
                                                <div className="d-flex flex-row justify-content-around">
                                                    <p style={{color: "#871f08"}}><strong>{days[new Date(weatherData.daily[i].dt * 1000).getDay()]} {new Date(weatherData.daily[i].dt * 1000).getDate()}-{new Date(weatherData.daily[i].dt * 1000).getMonth() + 1}-{new Date(weatherData.daily[i].dt * 1000).getFullYear()}</strong></p>
                                                    <img src={"http://openweathermap.org/img/wn/" + weatherData.daily[i].weather[0].icon + ".png"} />
                                                </div>
                                            </Card.Header>
                                            <Card.Body>
                                                <p>Temp. medie: {weatherData.daily[i].temp.day} &deg;C</p>
                                                <p>Temp. min: {weatherData.daily[i].temp.min} &deg;C</p>
                                                <p>Temp. max: {weatherData.daily[i].temp.max} &deg;C</p>
                                                <p>Nori: {weatherData.daily[i].clouds} %</p>
                                                <p>Precipitatii: {weatherData.daily[i].weather[0].description}</p>
                                            </Card.Body>
                                        </Card>
                                    ))
                                )
                                :
                                (
                                    <div></div>
                                )
                            }


                            {
                                showIndex2 ?
                                (
                                    index2.map((i) => (
                                        <Card className={styles.cardContainer}>
                                            <Card.Header className="d-flex flex-row justify-content-around">
                                                <p style={{color: "#871f08"}}><strong>{days[new Date(weatherData.daily[i].dt * 1000).getDay()]} {new Date(weatherData.daily[i].dt * 1000).getDate()}-{new Date(weatherData.daily[i].dt * 1000).getMonth() + 1}-{new Date(weatherData.daily[i].dt * 1000).getFullYear()}</strong></p>
                                                <img src={"http://openweathermap.org/img/wn/" + weatherData.daily[i].weather[0].icon + ".png"} />
                                            </Card.Header>
                                            <Card.Body>
                                                <p>Temp. medie: {weatherData.daily[i].temp.day} &deg;C</p>
                                                <p>Temp. min: {weatherData.daily[i].temp.min} &deg;C</p>
                                                <p>Temp. max: {weatherData.daily[i].temp.max} &deg;C</p>
                                                <p>Nori: {weatherData.daily[i].clouds} %</p>
                                                <p>Precipitatii: {weatherData.daily[i].weather[0].description}</p>
                                            </Card.Body>
                                        </Card>
                                    ))
                                )
                                :
                                (
                                    <div></div>
                                )
                            }

                            {
                                showIndex1 ?
                                (
                                    <Button className={styles.arrowButton} onClick={handleRightArrow}><i className="fa fa-arrow-right" aria-hidden="true"></i></Button>
                                )
                                :
                                (
                                    <div></div>
                                )
                            }

                        
                        </Card.Body>
                        <Card.Footer>
                        <Link to={{
                            pathname: '/task',
                            state: {weatherData}
                            }}><Button className={styles.programButton}>Programeaza tratament &nbsp; <i className="fa fa-arrow-right" aria-hidden="true"></i></Button></Link>
                        
                        </Card.Footer>
                        </Card>
                        
                        
                        <div className={styles.smallScreen}>
                            {
                                weatherData.daily.map(p => (
                                    <Card className={styles.smallCardScreen}>
                                        <Card.Header className={`d-flex flex-row justify-content-around ${styles.headerSmallCard}`}>
                                            <p style={{color: "#871f08"}}><strong styles={{color: "white"}}>{days[new Date(p.dt * 1000).getDay()]} {new Date(p.dt * 1000).getDate()}-{new Date(p.dt * 1000).getMonth() + 1}-{new Date(p.dt * 1000).getFullYear()}</strong></p>
                                            <img src={"http://openweathermap.org/img/wn/" + p.weather[0].icon + ".png"} />
                                        </Card.Header>
                                        <Card.Body>
                                            <p>Temp. medie: {p.temp.day} &deg;C</p>
                                            <p>Temp. min: {p.temp.min} &deg;C</p>
                                            <p>Temp. max: {p.temp.max} &deg;C</p>
                                            <p>Nori: {p.clouds} %</p>
                                            <p>Precipitatii: {p.weather[0].description}</p>
                                        </Card.Body>
                                    </Card>
                                ))
                            }
                            <Link to={{
                                pathname: '/task',
                                state: {weatherData}
                                }}><Button className={styles.programButton}>Programeaza tratament &nbsp; <i className="fa fa-arrow-right" aria-hidden="true"></i></Button></Link>
                        
                        </div>
                        
                        </>

                        )
                        :
                        (
                            <Spinner animation="border" variant="danger"/>
                        )
                    }
        </div>
    )
}
