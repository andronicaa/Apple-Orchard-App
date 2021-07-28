import React, { useState, useEffect } from 'react';
import firebase from '../../../Firebase/firebase';
import { useLocation } from 'react-router';
import { Modal, Button, Form, Alert, InputGroup, Tooltip } from 'react-bootstrap';
import TimeKeeper from 'react-timekeeper';
import { phases, disease } from '../Utility';
import { Input } from 'antd';

export default function Task() {
    const currentMonth = new Date().getMonth() < 10 ? '0' +  (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
    const currentDay = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
    const currentDate = new Date().getFullYear() + "-" + currentMonth + "-" +  currentDay;
    const productsCharac = firebase.firestore().collection("productsCondition");
    const [date, setDate] = useState('');
    const [products, setProducts] = useState([]);
    // ---- ALERTE -----
    // ALERTE PENTRU DATA ANTERIOARA CELEI CURENTE
    const [alert, setAlert] = useState(<div></div>);
    const [checkAlertDate, setAlertDate] = useState(false);
    // ALERTA PENTRU DATA DESPRE CARE NU EXISTA DATE DESPRE VREME
    const [dontExistData, setDontExistData] = useState(<div></div>);
    const [checkExist, setCheckExit] = useState(false);
    // ALERTA PENTRU VREME REA
    const [badWeatherAlert, setBadWeatherAlert] = useState(<div></div>);
    const [checkBadWeather, setCheckBadWeather] = useState(false);
    // ALERTA PENTRU VREME FOARTE CALDUROASA/RECE
    const [extremeWeather, setExtremeWeather] = useState([]);
    const [weatherType, setWeatherType] = useState('');
    // ALERTA PENTRU ORA NECORESPUNZATOARE
    const [pastTense, setPastTense] = useState(<div></div>);
    const [checkPastTense, setCheckPastTense] = useState(false)
    const [hourAlert, setHourAlert] = useState(<div></div>);
    const [checkHour, setCheckHour] = useState(false);
    // ---- END ALERTE
    // vector care retine toate codurile pentru vremea rea
    const weatherId = '2xx3xx5xx6xx';
    const [startHour, setStartHour] = useState('00:00');
    const [duration, setDuration] = useState(0);
    const [phase, setPhase] = useState('Alege faza');
    const [problem, setProblem] = useState('Alege problema');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingData, setLoadingData] = useState(true);
    const [loadingTime, setLoadingTime] = useState(true);
    const [operationType, setOperationType] = useState('');
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const handleShow = () => setShow(true);
    const handleClose = () => 
    {   setShow(false);
        setAlert(<div></div>)
        setAlertDate(false);
        setDontExistData(<div></div>);
        setCheckExit(false);
        setBadWeatherAlert(<div></div>);
        setCheckBadWeather(false);
        setHourAlert(<div></div>);
        setCheckHour(false);
        setPastTense(<div></div>);
        setCheckPastTense(false);
        setLoadingData(true);
        setLoadingTime(true);
    }
    const location = useLocation();
    const weatherData  = location.state.data;
    console.log("location", location.state.data);

    function setTreatmentDate(param_date) {
        // console.log("Am intrat aici", param_date);
        setDate(param_date);
        setLoadingData(false);
        var ok = false;
        console.log()
        if(param_date < currentDate)
        {
            setAlert(<Alert variant="danger">Nu poate fi programata o operatiune cu data anterioara datei curente</Alert>);
            setAlertDate(true);
        }
        else
        {   
            setAlert(<div></div>);
            setAlertDate(false);
        }
            
        // trebuie sa caut data corespunzatoare cele pe care a ales-o utilizatorul
        weatherData.daily.map(p => {
            var month = new Date(p.dt * 1000).getMonth() + 1;
            if(month < 10) 
                month = '0' + month;
            var day = new Date(p.dt * 1000).getDate();
            if(day < 10)
                day = '0' + day;
            var data = new Date(p.dt * 1000).getFullYear() + "-" + month + "-" + day;
            // console.log("Aici: ", data, date, data == date);
            if(data == param_date)
            {
                // console.log("am intrat aici", weatherId.includes(p.weather[0].id[0]));
                var stringId = p.weather[0].id.toString();
                // console.log(weatherId.includes(stringId[0]));
                // tot aici trebuie sa fac verificare sa vad daca ziua care este aleasa este buna (nu trebuie sa ploua)
                // pentru nicio operatiune nu trebuie sa ploua

                if(weatherId.includes(stringId[0]))
                {
                    setBadWeatherAlert(<Alert variant="danger">Vremea nu este prielnica pentru aplicarea de tratamente</Alert>);
                    setCheckBadWeather(true);
                }
                else
                {
                    setBadWeatherAlert(<div></div>);
                    setCheckBadWeather(true);
                }
                ok = true;
            }

        })
        if(ok == false)
        {
            // inseamna ca nu exista date despre ziua in care se doreste a se executa tratamentul
            setDontExistData(<Alert variant="warning">Nu exista date despre vreme pentru {param_date}</Alert>);
            setCheckExit(true);
        }
        else
        {
            setDontExistData(<div></div>);
            setCheckExit(false);
        }
    }

    function getWeatherAlerts() {
        // console.log("m-am apelat");
        const items = [];
        var hot = false;
        var cold = false;
        var id = 0;
        weatherData.daily.map(p => {
            // verific cum sunt temperaturile in urmatoarele 7 zile
            // console.log(p.temp.day, typeof p.temp.day);
            const year = new Date(p.dt * 1000).getFullYear()
            const month = new Date(p.dt * 1000).getMonth() < 10 ? '0' +  (new Date(p.dt * 1000).getMonth() + 1) : (new Date(p.dt * 1000).getMonth() + 1);
            const day = new Date(p.dt * 1000).getDate() < 10 ? '0' + new Date(p.dt * 1000).getDate() : new Date(p.dt * 1000).getDate();
            const dt = year + "-" + month + "-" + day;
            if(p.temp.day > 30)
            {
                // daca temperatura este mai mare de 28 de grade => este indicat sa nu se administreze tratamente in acele zile
                items.push({id: id, data: dt, temperature: p.temp.max});
                hot = true;
                id += 1;
            }
            if(p.temp.day < 0)
            {
                // temperaturi scazute
                items.push({data: dt, temperature: p.temp.max});
                cold = true;
            }
        })

        if(items.length)
        {
            setExtremeWeather(items);
            setTimeout(function() {
                setLoading(false);
            }, 1000);
        }
        if(hot)
            setWeatherType('canicula');
        if(cold)
            setWeatherType('ger');
    }

    // functiile pentru validarile orelor de inceput si final
    function setStartHourTreatment(hour) {
        setStartHour(hour);    
        setLoadingTime(false);
        var ok = false; 
        if(date == currentDate)
        {
            // daca data tratamentului este data curenta => ora trebuie sa fie dupa ora curenta
            const currentHour = new Date().getHours();
            const currentMinutes = new Date().getMinutes();
            var param_hour = '';
            var param_minutes = '';
            
            if(hour[1] == ':')
            {
                param_hour = parseInt(hour[0]);
                param_minutes = parseInt(hour.substring(2, 4));
            }
            else
            {
                param_hour = parseInt(hour.substring(0, 2));
                param_minutes = parseInt(hour.substring(3, 5));
            }
            if(param_hour < currentHour)
            {
                if(param_minutes < currentMinutes && param_hour < currentHour)
                {
                    setPastTense(<Alert variant="danger">Nu se poate programa o operatiune la o ora anterioara celei curente.</Alert>);
                    setCheckPastTense(true);
                    ok = true;
                }
               
            }
        }
      
        if(ok == false && checkPastTense)
        {
            setPastTense(<div></div>);
            setCheckPastTense(false);
        }

        // verific daca in urmatoarele zile se anunta o temperatura extrema
        if(extremeWeather.length)
        {
            // pot programa tratamente doar pana in ora 8
            // console.log(hour, typeof hour);
            // trebuie sa parsez stringul 
            console.log("am intrat in verificarea asta");
            if(hour[1] == ':')
                var hh = hour.substring(0, 1);
            else
                var hh = hour.substring(0, 2);
            if(parseInt(hh) > 8 || parseInt(hh) < 20)
            {
                setHourAlert(<Alert variant="danger">Nu pot fi facute tratamente dupa ora 8 in conditiile meteorologice actuale</Alert>);
                setCheckHour(true);
            }
            else
            {
                setHourAlert(<div></div>);
                setCheckHour(false);
            }
        }
    }

   
    // ---- end validari ore de start-stop

    function handleSetProblem(problem, phase) {
        setProblem(problem);
        // in functie de faza si problema pe care o are trebuie sa aleg produsul
        //trebuie sa parcurg colectia care retine datele despre produse
        const matchingProducts = [];
        // console.log("Am intrat in functia asta", products);
        products.map(p => {
            // console.log(p.phase.includes(phase));
            if(p.phase.includes(phase) && p.action.includes(problem))
            {
                matchingProducts.push({id: p.id, name: p.completeName, dose: p.dose, water: p.water});
            }
        })
        setFilteredProducts(matchingProducts);
        setTimeout(function() {
            setLoadingProducts(false);
        }, 1000);

    }

    function getProducts() {
        productsCharac.onSnapshot(querySnapshot => {
            const items = [];
            querySnapshot.forEach(doc => {
                items.push({id: doc.id, ...doc.data()});
            })
            setProducts(items);
        })
    }
    function handleSubmit(e, startHour, endHour, date) {
        // console.log(startHour, endHour);
    }
    useEffect(() => {
        getProducts();
        getWeatherAlerts();
    }, []);
    return (
        
        <div>
            <Button onClick={handleShow}>Programeaza operatiune</Button>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Form>
                    <Form.Group>
                        <Form.Label htmlFor="date"><strong>Data operatiune</strong></Form.Label>
                        <InputGroup>
                            <InputGroup.Prepend id="inputGroupPrependDate">
                                <InputGroup.Text>
                                    <i className="fa fa-clock-o" aria-hidden="true"></i>
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control onChange={e => setTreatmentDate(e.target.value)} type="date" placeholder="Data..." aria-describedby="inputGroupPrependDate"
                            required/>
                        </InputGroup>
                    </Form.Group>
                    {
                        checkAlertDate ? 
                        (
                            alert
                        )
                        :
                        (
                            <>
                            {checkExist ?
                                (
                                    dontExistData
                                )
                                :
                                (
                                    
                                        checkBadWeather ?
                                        (
                                            badWeatherAlert
                                        )
                                        :
                                        (
                                            <div></div>
                                        )
                                    
                                    
                                )
                            }
                            
                            {
                                checkPastTense ?
                                (
                                    pastTense
                                )
                                :
                                (
                                    <div></div>
                                )
                            }
                            {console.log("data inainte: ", date)}
                                {
                                    loadingData ?
                                    (
                                        <div></div>
                                    )
                                    :
                                    (
                                        <div>
                                            

                                            <Form.Group>
                                                <Form.Label htmlFor="startHour"><strong>Ora inceput</strong></Form.Label>
                                                <InputGroup>
                                                    <TimeKeeper 
                                                        time={startHour}
                                                        onChange={data => setStartHourTreatment(data.formatted24)}
                                                        hour24Mode
                                                    />
                                                </InputGroup>
                                        
                                            </Form.Group>
                                        {
                                        checkHour ?
                                        (
                                            hourAlert
                                        )
                                        :
                                        (
                                            <div></div>
                                        )
                                        }
                                        {
                                            loadingTime ?
                                            (   
                                                <div></div>
                                            )
                                            :
                                            (
                                                
                                                
                                                checkPastTense == false && loadingTime == false ?
                                                (
                                                    <>
                                                    <Form.Group>
                                                        <Form.Label htmlFor="operationType"><strong>Tip operatiune</strong></Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Prepend id="inputGroupPrependOperationType">
                                                                <InputGroup.Text>
                                                                    <i className="fa fa-tasks" aria-hidden="true"></i>
                                                                </InputGroup.Text>
                                                            </InputGroup.Prepend>
                                                            <Form.Control as="select" aria-describedby="inputGroupPrependOperationType"
                                                required  onChange={(e) => setOperationType(e.target.value)}>
                                                                {
                                                                    ['Alege tip operatiune', 'Tratament', 'Operatiuni sol'].map((j) => (
                                                                        <option key={j}>
                                                                            {j}
                                                                        </option>
                                                                    ))
                                                                }
                                                            </Form.Control>
                                                        </InputGroup>
                                                    </Form.Group>
                                                    <Form.Group>
                                                        <Form.Label htmlFor="duration"><strong>Durata operatiune (h)</strong></Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Prepend id="inputGroupPrependDuration">
                                                                <InputGroup.Text>
                                                                    <i className="fa fa-clock-o" aria-hidden="true"></i>
                                                                </InputGroup.Text>
                                                            </InputGroup.Prepend>
                                                            <Form.Control onChange={e => setDuration(e.target.value)} type="number" min="1" placeholder="Durata..." aria-describedby="inputGroupPrependDuration"
                                                            required/>
                                                        </InputGroup>
                                                    </Form.Group>
                                                    {
                                                        operationType == 'Tratament' ?
                                                        (
                                                            <>
                                                                <Form.Group>
                                                                    <Form.Label htmlFor="phase"><strong>Stadiul de dezvoltare</strong></Form.Label>
                                                                    <InputGroup>
                                                                        <InputGroup.Prepend id="inputGroupPrependPhase">
                                                                            <InputGroup.Text>
                                                                                <i className="fa fa-briefcase" aria-hidden="true"></i>
                                                                            </InputGroup.Text>
                                                                        </InputGroup.Prepend>
                                                                        <Form.Control as="select" aria-describedby="inputGroupPrependPhase"
                                                            required value={phase} onChange={(e) => setPhase(e.target.value)}>
                                                                            {
                                                                                phases.map((j) => (
                                                                                    <option key={j}>
                                                                                        {j}
                                                                                    </option>
                                                                                ))
                                                                            }
                                                                        </Form.Control>
                                                                    </InputGroup>
                                                                </Form.Group>
                                                                {
                                                                    phase != 'Alege faza' ?
                                                                    (<>
                                                                        <Form.Group>
                                                                            <Form.Label htmlFor="problem"><strong>Problema</strong></Form.Label>
                                                                            <Button variant="success"><i className="fa fa-plus" aria-hidden="true"></i></Button>
                                                                        
                                                                            <InputGroup>
                                                                                <InputGroup.Prepend id="inputGroupPrependDisease">
                                                                                    <InputGroup.Text>
                                                                                        <i className="fa fa-briefcase" aria-hidden="true"></i>
                                                                                    </InputGroup.Text>
                                                                                </InputGroup.Prepend>
                                                                                <Form.Control as="select" aria-describedby="inputGroupPrependDisease"
                                                                    required value={problem} onChange={(e) => handleSetProblem(e.target.value, phase)}>
                                                                                    {
                                                                                        disease.map((j) => (
                                                                                            <option key={j}>
                                                                                                {j}
                                                                                            </option>
                                                                                        ))
                                                                                    }
                                                                                </Form.Control>
                                                                            </InputGroup>
                                                                        </Form.Group>
                                                                       {/* {console.log("Produsele filtrate sunt: ", filteredProducts)} */}
                                                                       {
                                                                           loadingProducts == false ?
                                                                           (
                                                                                filteredProducts.map(p => (
                                                                                    <p key={p.id}>{p.name}</p>
                                                                                ))
                                                                           )
                                                                           :
                                                                           (
                                                                                <div></div>
                                                                           )
                                                                       }
                                                                       </>
                                                                    )
                                                                    :
                                                                    (
                                                                        <div></div>
                                                                    )
                                                                }
                                                                
                                                            </>
                                                        )
                                                        :
                                                        (
                                                            <div></div>
                                                        )
                                                    }
                                                    
                                                   
                                                </>
                                                )
                                                :
                                                (
                                                    <div></div>
                                                )
                                             
                                            )
                                                    
                                                
                                            
                                        }
                                
                                 </div>
                                    )
                                }
                                
                            <Button onClick={e => handleSubmit(e, startHour, duration, date)}>Salveaza</Button>
                            </>
                        )
                    }
                    <Button variant="warning" onClick={handleClose}>Renunta</Button>
                </Form>
            </Modal>
            <h4>Atentionari</h4>
            <Alert variant="warning">Este indicat ca tratamentele sa se faca la temperaturi mai mici de 25 &deg;C</Alert>
            <Alert variant="danger">Nicio operatiune nu trebuie facuta intr-o zi cu precipitatii</Alert>
            
            {
                extremeWeather.length ? 
                (
                    <>
                    {
                        weatherType === "canicula"? 
                        (
                            <Alert variant="warning">In zilele caniculare este de preferat ca tratamentele sa fie aplicate dimineata.</Alert>
                        )
                        :
                        (
                            <div></div>
                        )
                    }
                    <Alert variant="danger">Temperaturi extreme pentru urmatoarele zile: </Alert>
                    {
                        extremeWeather.map(p => (
                            <p key={p.id}>{p.data}: {p.temperature}</p>
                        ))
                    }
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
