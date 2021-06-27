import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import styles from './Style/Weather.module.css';


export default function Weather() {
    const [lat, setLat] = useState([]);
    const [long, setLong] = useState([]);
    const [data, setData] = useState([]);
    const [icons1, setIcons1] = useState([]);
    const [icons2, setIcons2] = useState([]);
    const index1 = [0, 1, 2, 3];
    const index2 = [4, 5, 6, 7];
    var date = new Date().getDay();
    useEffect(() => {
        const fetchWeatherData = async () => {
            navigator.geolocation.getCurrentPosition(function(position) {
            setLat(position.coords.latitude);
            setLong(position.coords.longitude);
        });
            await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly&units=metric&lang=ro&appid=${process.env.REACT_APP_API_KEY}`)
        .then(res => res.json())
        .then(result => {
            setData(result);
            var resIcons1 = [];
            var resIcons2 = [];
            
            index1.map(i => {
                var iconUrl = "http://openweathermap.org/img/wn/" + result.daily[i].weather[0].icon + ".png";
                resIcons1.push(iconUrl);
            })
            // console.log("Proprietatea 4: ",  result.daily[3]);
            setIcons1(resIcons1);
            
            index2.map(i => {
                var iconUrl = "http://openweathermap.org/img/wn/" + result.daily[i].weather[0].icon + ".png";
                resIcons2.push(iconUrl);
            })
            
            setIcons2(resIcons2);
            
            console.log(resIcons1);
            console.log(resIcons2);
            console.log(result);
        })
        .catch((err) => {
            console.log(err);
        });
        }
        fetchWeatherData();
    }, [date]);

    
    function afiseazaDate() {

        console.log(data.current.weather.description);
    }
    const days = ['Duminică','Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă']
    return (
        <div>
            {
                (typeof data.current != 'undefined') ? (
                    <>
                    <Row className={styles.rowContainer}>
                        <div className={styles.flexContainer1}>
                            
                                {/* <button onClick={afiseazaDate}>apasa</button> */}
                                {
                                    index1.map((i) => (
                                        <Card className={styles.cardContainer}>
                                            <Card.Header>
                                                <p><strong>{days[new Date(data.daily[i].dt * 1000).getDay()]} {new Date(data.daily[i].dt * 1000).getDate()}-{new Date(data.daily[i].dt * 1000).getMonth() + 1}-{new Date(data.daily[i].dt * 1000).getFullYear()}</strong></p>
                                                <img src={icons1[i]} />
                                            </Card.Header>
                                            <Card.Body>
                                                <p>Temp. medie: {data.daily[i].temp.day} &deg;C</p>
                                                <p>Temp. min: {data.daily[i].temp.min} &deg;C</p>
                                                <p>Temp. max: {data.daily[i].temp.max} &deg;C</p>
                                            </Card.Body>
                                        </Card>
                                    ))
                                }
                            
                        </div>
                        <div className={styles.flexContainer2}>
                            {/* <button onClick={afiseazaDate}>apasa</button> */}
                            {
                                    index2.map((i) => (
                                        <Card className={styles.cardContainer}>
                                            <Card.Header>
                                                <p><strong>{days[new Date(data.daily[i].dt * 1000).getDay()]} {new Date(data.daily[i].dt * 1000).getDate()}-{new Date(data.daily[i].dt * 1000).getMonth() + 1}-{new Date(data.daily[i].dt * 1000).getFullYear()}</strong></p>
                                                <img src={icons2[i]} />
                                            </Card.Header>
                                            <Card.Body>
                                                <p>Temp. medie: {data.daily[i].temp.day} &deg;C</p>
                                                <p>Temp. min: {data.daily[i].temp.min} &deg;C</p>
                                                <p>Temp. max: {data.daily[i].temp.max} &deg;C</p>
                                            </Card.Body>
                                        </Card>
                                    ))
                                }
                        </div>
                    </Row>
                    </>
                ) : (
                    <div></div>
                )
            }
        </div>
    )
}
