import React, { useState, useEffect } from 'react';
import firebase from '../../../Firebase/firebase';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../Firebase/context/AuthContext';
import { useLocation } from 'react-router';
import { Modal, Button, Form, Alert, InputGroup, Card } from 'react-bootstrap';
import TimeKeeper from 'react-timekeeper';
import { phases, disease, jobTypes } from '../Utility';
import Spinner from 'react-bootstrap/Spinner';
import styles from '../Style/Task.module.css';
import OrchardMenu from '../../Orchard/OrchardMenu';
import TaskTabs from './TaskTabs';


export default function Task() {
    const { currentUser } = useAuth();
    /* datele despre vreme primite ca parametru*/
    const location = useLocation();
    const weatherData  = location.state.weatherData;
    // console.log("Datele primite despre vreme in tasks sunt: ", weatherData);
    /* vector care retine toate codurile pentru vremea rea */
    const weatherId = '2xx3xx5xx6xx';
    const currentMonth = new Date().getMonth() < 10 ? '0' +  (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
    const currentDay = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
    const currentDate = new Date().getFullYear() + "-" + currentMonth + "-" +  currentDay;
    /* citiri din baza de date */
    const productsCharac = firebase.firestore().collection("productsCondition");
    const refArea = firebase.firestore().collection("users").doc(currentUser.uid);
    const refMachinery = firebase.firestore().collection("users").doc(currentUser.uid).collection("receiptEquipment");
    const refUsers = firebase.firestore().collection("users");
    /* date care se completeaza in formular */
    const [taskName, setTaskName] = useState('');
    const [date, setDate] = useState('');
    const [startHour, setStartHour] = useState('00:00');
    const [duration, setDuration] = useState(0);
    const [phase, setPhase] = useState('Alege faza');
    const [problem, setProblem] = useState('Alege problema');
    const [operationType, setOperationType] = useState('');
    const [jobType, setJobType] = useState('');
    
    /* datele din bd*/ 
    const [products, setProducts] = useState([]);
    const [task, setTask] = useState([]);
    const [employee, setEmployee] = useState([]);

    

    /*loading pentru datele din bd */
    const [loading, setLoading] = useState(true);
    const [loadingData, setLoadingData] = useState(true);
    const [loadingTime, setLoadingTime] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingTask, setLoadingTask] = useState(true);
    const [loadingCalcDose, setLoadingCalcDose] = useState(true);
    const [loadingArea, setLoadingArea] = useState(true);
    const [loadingAvailableEmployee, setLoadingAvailableEmployee] = useState(true);
    const [loadingAvailableMachinery, setLoadingAvailableMachinery] = useState(true);
    const [loadingEmployee, setLoadingEmployee] = useState(true);
    const [loadingMachinery, setLoadingMachinery] = useState(true);
    
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
    
    
    
    /* modal */
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    
    /* date care se calculeaza automat in functie de valorile completate in formular */
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [calculatedDose, setCalculatedDose] = useState(0);
    const [chosenProduct, setChosenProduct] = useState('');
    const [orchardArea, setOrchardArea] = useState(0); 
    const [availableEmployee, setAvailableEmployee] = useState([]);
    const [machinery, setMachinery] = useState([]);
    const [searchMachinery, setSearchMachinery] = useState(false);
    const [availableMachinery, setAvailableMachinery] = useState([]);
    const [assignedMachinery, setAssignedMachinery] = useState('');
    const [assignedEmployee, setAssignedEmployee] = useState('');
    
    
    
    const handleClose = () => 
    {   
        setShow(false);
        setTaskName('');
        setDate('');
        setStartHour('00:00');
        setDuration(0);
        setPhase('Alege faza');
        setProblem('Alege problema');
        setOperationType('');
        setProducts([]);
        setLoadingData(true);
        setLoadingTime(true);
        setLoadingProducts(true);
        setLoadingTask(true);
        setLoadingCalcDose(true);
        // setLoadingArea(true);
        setLoadingAvailableEmployee(true);
        setLoadingAvailableMachinery(true);
        setAlert(<div></div>);
        setAlertDate(false);
        setDontExistData(<div></div>);
        setCheckExit(false);
        setBadWeatherAlert(<div></div>);
        setCheckBadWeather(false);
        setExtremeWeather([]);
        setWeatherType('');
        setPastTense(<div></div>);
        setCheckPastTense(false);
        setHourAlert(<div></div>);
        setCheckHour(false);
        setFilteredProducts([]);
        setChosenProduct('');
        setOrchardArea(0);
        setAvailableEmployee([]);
        setMachinery([]);
        setSearchMachinery(false);
        setAvailableMachinery('');
        setAssignedEmployee('');
        setAssignedMachinery('');
        // setLoadingMachinery(true);
        // setLoadingEmployee(true);
    }
    

    function getTask() {
        refUsers.onSnapshot(querySnapshot => {
            const userUids = [];
            querySnapshot.forEach(doc => {
                userUids.push(doc.id);
            })
            const taskItems = [];
            userUids.map(uid => {
                var refTask = firebase.firestore().collection("users").doc(uid).collection("tasks").where('status','in', ['To do']);
                refTask.onSnapshot(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        taskItems.push(doc.data());
                    })
                })
            })
            setTask(taskItems);
            setTimeout(function() {
                setLoadingTask(false);
            }, 1000);
        })
        
    }
    function getProfile() {
        refArea.onSnapshot(doc => {
            console.log("SUPRAFATA LIVEZII ESTE: ", doc.data().suprf);
            setOrchardArea(doc.data().suprf);
            setTimeout(function() {
                setLoadingArea(false);
            }, 1000);
        })
    }

    function getEmployee() {
        refUsers.onSnapshot(querySnapshot => {
            const usersUid = [];
            querySnapshot.forEach(doc => {
                if(doc.data().job == 'Cultivator')
                    usersUid.push(doc.id);
            })
            const emplItems = [];
            // acum pentru fiecare user trebuie sa iau colectia de onHold ca sa vad toate locurile in care poate lucra un angajat
            usersUid.map(usr => {
                var refEmployee = firebase.firestore().collection("users").doc(usr).collection("onHold").where("status", "==", "accepted offer");
                refEmployee.onSnapshot(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        emplItems.push({id: doc.id, ...doc.data()});
                    })
                })
            })
            setEmployee(emplItems);
            setTimeout(function() {
                setLoadingEmployee(false);
            }, 1000);
        })
    }

    function getMachinery() {
        refMachinery.onSnapshot(querySnapshot => {
            const items = [];
            querySnapshot.forEach(doc => {
                items.push({id: doc.id,...doc.data()});
            })  
            setMachinery(items);
            console.log("Utilajele sunt: ", items);
            setTimeout(function() {
                setLoadingMachinery(false);
            }, 1000);
        })
    }
    function setTreatmentDate(param_date) {
        // console.log("Am intrat aici", param_date);
        setDate(param_date);
        setLoadingData(false);
        var ok = false;
        console.log()
        if(param_date < currentDate)
        {
            setAlert(<Alert variant="warning">Nu poate fi programata o operatiune cu data anterioara datei curente</Alert>);
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
            {console.log(weatherData);
                // console.log("am intrat aici", weatherId.includes(p.weather[0].id[0]));
                var stringId = p.weather[0].id.toString();
                // console.log(weatherId.includes(stringId[0]));
                // tot aici trebuie sa fac verificare sa vad daca ziua care este aleasa este buna (nu trebuie sa ploua)
                // pentru nicio operatiune nu trebuie sa ploua
                console.log("ESTEEEE:", stringId, p.dt, p);
                if(weatherId.includes(stringId[0]))
                {
                    console.log("Am intrat in acest warning");
                    setBadWeatherAlert(<Alert variant="warning">Vremea nu este prielnică pentru aplicarea de tratamente: {p.weather[0].description}</Alert>);
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
            if(p.temp.day > 25)
            {
                // daca temperatura este mai mare de 25 de grade => este indicat sa nu se administreze tratamente in acele zile
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

    // functiile pentru validarile orelor de inceput 
    function setStartHourTreatment(hour) {
        setStartHour(hour);    
        setLoadingTime(false);
        var ok = false; 
        // verificarea pentru ora se face doar daca se programeaza o operatiune in ziua curenta
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
            // daca s-a ales o ora anterioara, nu mai conteaza minutul
            if(param_hour < currentHour)
            {
                setPastTense(<Alert variant="warning">Nu se poate programa o operatiune la o ora anterioara celei curente.</Alert>);
                setCheckPastTense(true);
                ok = true;
            }
            if(param_hour == currentHour)
            {
                // daca orele sunt la fel => trebuie sa compar minutele
                if(param_minutes < currentMinutes)
                {
                    setPastTense(<Alert variant="warning">Nu se poate programa o operatiune la o ora anterioara celei curente.</Alert>);
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
            if(parseInt(hh) > 8 && parseInt(hh) < 19)
            {
                setHourAlert(<Alert variant="info">Nu este recomandata efectuarea de tratamente dupa ora 8 in conditiile meteorologice actuale</Alert>);
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

    function handleCalculateDose(product) {
       
            console.log("ALEG SUBSTANTA");
            console.log(product);
            setChosenProduct(product);
            var calcDose = 0;
            var dose = 0;
            filteredProducts.map(p => {
                if(p.name == product)
                {
                    dose = p.dose;
                }
            })
            console.log("aria este: ", orchardArea);
            console.log(dose);
            // acum trebuie sa calculez doza in functie de aria livezii
            calcDose = (dose * orchardArea).toFixed(2);
            console.log("DOZA PE CARE TREBUIE SA O DEA ESTE: ", calcDose);
            setCalculatedDose(calcDose);
            setTimeout(function() {
                setLoadingCalcDose(false);
            }, 1000);
        
        
    }
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
        console.log("Produsele care se potrivesc sunt: ", matchingProducts);
        setFilteredProducts(matchingProducts);
        setTimeout(function() {
            setLoadingProducts(false);
        }, 1000);

    }

    function getProducts() {
        productsCharac.onSnapshot(querySnapshot => {
            const items = [];
            querySnapshot.forEach(doc => {
                console.log(doc.data());
                items.push({id: doc.id, ...doc.data()});
            })
            console.log("produsele sunt: ", items);
            setProducts(items);
        })
    }

    

   
    function getAvailableMachinery() {
        const items = [];
        console.log("AM INTRAT IN FUNCTIA CARE ALEG UTILAJELE", machinery);
        machinery.map(mch => {
            //console.log("utilajul este: ", mch);
            var ok = false;
            task.map(tsk => {
                // trebuie sa iau un utilaj care nu este folosit la ora 
                // daca utilajul este deja asignat pt un task

                if(mch.id == tsk.machineryId)
                {//console.log("Un alt task este: ", tsk);
                    //console.log("Aici: ", date, tsk.date)
                    // daca sunt in aceeasi data
                    if(date == tsk.date) {
                        console.log("AM INTRAT IN ACEST IF PENTRU ", tsk);
                        //console.log("doua task-uri cu aceeasi data")
                        // acum trebuie sa verific si ora
                        if(startHour == tsk.startHour)
                        {
                            //console.log("Doua task-uri cu aceeasi ora");
                            console.log("s-a facut ok true");
                            ok = true;
                        }
                        else
                        {
                            //console.log("Am intrat pe else:");
                            // daca sunt la ora diferite 
                            // trebuie sa verific durata
                            if(tsk.startHour[1] == ':')
                            {
                                var ex_hh = parseInt(tsk.startHour[0]);
                                var ex_mm = parseInt(tsk.startHour.substring(2, 4));
                            }
                            else
                            {
                                var ex_hh = parseInt(tsk.startHour.substring(0, 2));
                                var ex_mm = parseInt(tsk.startHour.substring(3, 5));
                            }
                            
                            if(startHour[1] == ':')
                            {
                                var new_hh = parseInt(startHour[0]);
                                var new_mm = parseInt(startHour.substring(2, 4));
                            }
                            else
                            {
                                var new_hh = parseInt(startHour.substring(0, 2));
                                var new_mm = parseInt(startHour.substring(3, 5));
                            }

                            // trebuie ca ora existenta deja + durata sa fie mai mici decat ora care e acum
                            var ex_h_dur = ex_hh + parseInt(tsk.duration);
                            var curr_h_dur = new_hh + parseInt(duration);
                            /*
                            if(curr_h_dur > ex_hh)
                            {
                                console.log("Am intrat in acest IIIFFFF1");
                                ok = true;
                            }*/
                            // trebuie sa compar
                            /*if(ex_h_dur > new_hh)
                            {console.log("Am intrat in acest IIIIFFFF1");
                                //inseamna ca nu pot programa
                                console.log(ex_h_dur, new_hh);
                                ok = true;
                            }*/
                            if(ex_h_dur == new_hh)
                            {
                                // daca orele sunt egale => trebuie sa verific minutele
                                if(ex_mm > new_mm)
                                {//onsole.log("Am intrat in acest IIIIFFFF");
                                    // inseamna ca nu pot programa
                                    ok = true;
                                    console.log("s-a facut ok true");
                                }
                            }
                            
                        }
                    }
                    else
                    {
                        console.log("NU AU ACEEASI DATA", ok);
                    }
                }

            })
            if(!ok)
            {   console.log("AM INTRAT AICI");
                items.push(mch);
            }
        })
        console.log("items utilaje: ", items);
        setAvailableMachinery(items);
        setSearchMachinery(!searchMachinery);
        setTimeout(function() {
            setLoadingAvailableMachinery(false);
        }, 1000);
    }
    
    function chosenMachinery(e, mach) {
        console.log()
        console.log("Angajatii sunt: ", employee);
        console.log("Am intrat in functia unde se alege angajatul", mach);
        setAssignedMachinery(mach);
        // trebuie sa caut angajatii care au categoriile specificate si care sunt liberi si care au acele categorii de permis
        // setAssignedMachinery(mach)
        // trebuie sa setez utilajul ales
        const items = [];
        employee.map(emp => {
            // console.log("Categoria angajatului este: ", emp.categories);
            var ok = false;
            
            // console.log("Taskurile sunt: ", task);
            task.map(tsk => {
                console.log(emp.employeeId, tsk.employeeId, emp.postName,  jobType, emp.growerId, currentUser.uid)
                if(emp.employeeId == tsk.employeeId && emp.postName == jobType)
                {
                    console.log("Angajatul care se potriveste este: ", emp);
                    // daca sunt in aceeasi data
                    if(date == tsk.date) {
                        // acum trebuie sa verific si ora
                        if(startHour == tsk.startHour)
                        {
                            ok = true;
                        }
                        else
                        {
                            // daca sunt la ora diferite 
                            // trebuie sa verific durata
                            if(tsk.startHour[1] == ':')
                            {
                                var ex_hh = parseInt(tsk.startHour[0]);
                                var ex_mm = parseInt(tsk.startHour.substring(2, 4));
                            }
                            else
                            {
                                var ex_hh = parseInt(tsk.startHour.substring(0, 2));
                                var ex_mm = parseInt(tsk.startHour.substring(3, 5));
                            }
                            
                            if(startHour[1] == ':')
                            {
                                var new_hh = parseInt(startHour[0]);
                                var new_mm = parseInt(startHour.substring(2, 4));
                            }
                            else
                            {
                                var new_hh = parseInt(startHour.substring(0, 2));
                                var new_mm = parseInt(startHour.substring(3, 5));
                            }

                            // trebuie ca ora existenta deja + durata sa fie mai mici decat ora care e acum
                            var ex_h_dur = ex_hh + parseInt(tsk.duration);
                            var curr_h_dur = new_hh + parseInt(duration);
                            /*if(curr_h_dur > ex_hh)
                            {
                                ok = true;
                            }*/
                            // trebuie sa compar
                            /*if(ex_h_dur > new_hh)
                            {
                                //inseamna ca nu pot programa
                                ok = true;
                            }*/
                            if(ex_h_dur == new_hh)
                            {
                                console.log("ore egale");
                                // daca orele sunt egale => trebuie sa verific minutele
                                if(ex_mm > new_mm)
                                {
                                    // inseamna ca nu pot programa
                                    ok = true;
                                }
                            }
                            
                        }
                    }
                }
            })
            console.log("pentru emp = ", emp, " ok = ", ok, " si ");
            if(!ok && jobType == emp.postName && emp.growerId == currentUser.uid)
            {
                // daca este liber un angajat
                // acum trebuie sa verificam daca are acele categorii de permis
                console.log("SUNT: ", mach.driverCateg, emp.categories, jobType, emp.postName);
                if(mach.driverCateg.length > emp.categories.length )
                {
                    if(mach.driverCateg.includes(emp.categories))
                    {
                        // inseamna ca angajatul are acele categorii de permis
                        items.push(emp);
                    }
                   
                }
                else
                {
                    if(emp.categories.includes(mach.driverCateg))
                    {
                        items.push(emp);
                    }
                }
            }
            

        })
        console.log("items: ", items);
        setAvailableEmployee(items);
        setTimeout(function() {
        setLoadingAvailableEmployee(false);
        }, 1000);


    }

    function chosenEmployee(e, emp) {
        setAssignedEmployee(emp);
    }

    function giveUpEmployee(e) {
        setAssignedEmployee('');
    }

    function giveUpMachinery(e) {
        setAssignedMachinery('');
    }
    function handleSubmit(e, operationType, taskName, startHour, duration, date, phase, problem, chosenProduct, calculatedDose, assignedMachinery, assignedEmployee) {
        e.preventDefault();
        console.log("Parametrii sunt: ", operationType, startHour, duration, date, phase, problem, chosenProduct, calculatedDose, assignedMachinery, assignedEmployee)
        const refTask = firebase.firestore().collection("users").doc(currentUser.uid).collection("tasks");
        if(operationType == 'Tratament')
        {
            console.log("aici aici")
            refTask.add({
                taskName: taskName,
                startHour: startHour,
                duration: duration, 
                date: date,
                phase: phase,
                problem: problem, 
                chosenProduct: chosenProduct,
                calculatedDose: calculatedDose,
                machineryId: assignedMachinery.id,
                machineryName: assignedMachinery.nameEq,
                employeeId: assignedEmployee.employeeId,
                employeeFirstName: assignedEmployee.firstName,
                employeeLastName: assignedEmployee.lastName,
                status: 'To do',
                timestamp: new Date(),
                growerId: currentUser.uid
            }).catch(err => {
                console.log(err);
            });
        }
        else
        {
            console.log("aici");
            refTask.add({
                taskName: taskName,
                startHour: startHour,
                duration: duration, 
                date: date,
                machineryId: assignedMachinery.id,
                machineryName: assignedMachinery.nameEq,
                employeeId: assignedEmployee.employeeId,
                employeeFirstName: assignedEmployee.firstName,
                employeeLastName: assignedEmployee.lastName,
                status: 'To do', 
                timestamp: new Date(),
                growerId: currentUser.uid
            }).catch(err => {
                console.log(err);
            });
        }
            
        handleClose();
    }

    useEffect(() => {
        getMachinery();
        getProducts();
        getWeatherAlerts();
        getProfile();
        getTask();
        getEmployee();
    }, []);
    return (
        <div className={styles.mainPage}>
        <OrchardMenu />
        <div>
            
            <Button onClick={handleShow} className={styles.programButton}>Programează operațiune</Button>
            <Link to={{
                pathname: '/treatment-schedule'
                }}><Button className={styles.programButton}>Program tehnologic &nbsp; <i className="fa fa-arrow-right" aria-hidden="true"></i></Button></Link>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Card>
                <Card.Header className="text-center" style={{backgroundColor: "rgba(135, 31, 8, .8)", color: "orange"}}><h4><strong>Adăugare nou task</strong></h4></Card.Header>
                <Form className={styles.formContainer}>
                    <Form.Group>
                        <Form.Label htmlFor="date" className={styles.formLabel}><strong>Dată operațiune</strong></Form.Label>
                        <InputGroup>
                            <InputGroup.Prepend id="inputGroupPrependDate">
                                <InputGroup.Text>
                                    <i className={`fa fa-clock-o ${styles.icon}`} aria-hidden="true"></i>
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
                                                <Form.Label htmlFor="taskName" className={styles.formLabel}><strong>Nume operațiune</strong></Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Prepend id="inputGroupPrependTaskName">
                                                        <InputGroup.Text>
                                                            <i className={`fa fa-tasks ${styles.formLabel}`} aria-hidden="true"></i>
                                                        </InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                    <Form.Control onChange={e => setTaskName(e.target.value)} type="text" placeholder="Nume..." aria-describedby="inputGroupPrependTaskName"
                                                    required/>
                                                </InputGroup>
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label htmlFor="jobType" className={styles.formLabel}><strong>Tip job angajat</strong></Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Prepend id="inputGroupPrependJobType">
                                                        <InputGroup.Text>
                                                            <i className={`fa fa-industry ${styles.icon}`} aria-hidden="true"></i>
                                                        </InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                    <Form.Control as="select" aria-describedby="inputGroupPrependJobType"
                                        required value={jobType} onChange={(e) => setJobType(e.target.value)}>
                                                        {
                                                            jobTypes.map((j) => (
                                                                <option key={j}>
                                                                    {j}
                                                                </option>
                                                            ))
                                                        }
                                                    </Form.Control>
                                                </InputGroup>
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label htmlFor="startHour" className={styles.formLabel}><strong>Oră inceput</strong></Form.Label>
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
                                                        <Form.Label htmlFor="operationType" className={styles.formLabel}><strong>Tip operațiune</strong></Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Prepend id="inputGroupPrependOperationType">
                                                                <InputGroup.Text>
                                                                    <i className={`fa fa-tasks ${styles.icon}`} aria-hidden="true"></i>
                                                                </InputGroup.Text>
                                                            </InputGroup.Prepend>
                                                            <Form.Control as="select" aria-describedby="inputGroupPrependOperationType"
                                                required  onChange={(e) => setOperationType(e.target.value)}>
                                                                {
                                                                    ['Alege tip operatiune', 'Tratament', 'Operatiuni sol', 'Alt tip operatiune'].map((j) => (
                                                                        <option key={j}>
                                                                            {j}
                                                                        </option>
                                                                    ))
                                                                }
                                                            </Form.Control>
                                                        </InputGroup>
                                                    </Form.Group>
                                                    <Form.Group>
                                                        <Form.Label htmlFor="duration" className={styles.formLabel}><strong>Durată operațiune (h)</strong></Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Prepend id="inputGroupPrependDuration">
                                                                <InputGroup.Text>
                                                                    <i className={`fa fa-clock-o ${styles.icon}`} aria-hidden="true"></i>
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
                                                                    <Form.Label htmlFor="phase" className={styles.formLabel}><strong>Stadiul de dezvoltare</strong></Form.Label>
                                                                    <InputGroup>
                                                                        <InputGroup.Prepend id="inputGroupPrependPhase">
                                                                            <InputGroup.Text>
                                                                                <i className={`fa fa-step-forward ${styles.icon}`} aria-hidden="true"></i>
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
                                                                            <Form.Label htmlFor="problem" className={styles.formLabel}><strong>Problemă</strong></Form.Label>
                                                                            <InputGroup>
                                                                                <InputGroup.Prepend id="inputGroupPrependDisease">
                                                                                    <InputGroup.Text>
                                                                                        <i className={`fa fa-bug ${styles.icon}`} aria-hidden="true"></i>
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
                                                                               <>
                                                                                    <Form.Group>
                                                                                        <Form.Label htmlFor="chosenProduct" className={styles.formLabel}><strong>Substanțe recomandate pentru tratament</strong></Form.Label>                                                                                
                                                                                        <InputGroup>
                                                                                        <InputGroup.Prepend id="inputGroupPrependChosenProduct">
                                                                                            <InputGroup.Text>
                                                                                                <i className={`fa fa-bug ${styles.icon}`} aria-hidden="true"></i>
                                                                                            </InputGroup.Text>
                                                                                        </InputGroup.Prepend>
                                                                                        <Form.Control as="select" aria-describedby="inputGroupPrependChosenProduct"
                                                                                        required value={chosenProduct} onChange={(e) => handleCalculateDose(e.target.value)}>
                                                                                            {<>
                                                                                                <option>Alege produsul</option>
                                                                                                {filteredProducts.map((j) => (
                                                                                                    <option key={j.id}>
                                                                                                        {j.name}
                                                                                                    </option>
                                                                                                ))}
                                                                                            </>
                                                                                            }
                                                                                        </Form.Control>
                                                                                        </InputGroup>
                                                                                    </Form.Group>
                                                                                    {
                                                                                                loadingCalcDose == false ?
                                                                                                (
                                                                                                    <p>Doza calculată este: {calculatedDose} kg</p>
                                                                                                )
                                                                                                :
                                                                                                (
                                                                                                    <div>
                                                                                                        <Spinner animation="border" variant="success"/>
                                                                                                    </div>
                                                                                                )
                                                                                            }
                                                                                </>
                                                                           )
                                                                           :
                                                                           (
                                                                                <div>...</div>
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
                                                    <Button onClick={getAvailableMachinery}>Caută utilaj</Button>
                                                                        {
                                                                            searchMachinery == false ?
                                                                            (
                                                                                loadingAvailableMachinery == false ?
                                                                                (   <>
                                                                                    
                                                                                    {
                                                                                        availableMachinery.length ?
                                                                                        (
                                                                                            <>
                                                                                                <p style={{color: "#871f08"}}><strong>Utilaje disponibile</strong></p>
                                                                                                {availableMachinery.map(p => (
                                                                                                    
                                                                                                        
                                                                                                    <div key={p.id}>
                                                                                                    {
                                                                                                        typeof assignedMachinery.nameEq != 'undefined'  && p.id == assignedMachinery.id? 
                                                                                                            <Button style={{backgroundColor: "#871f08"}} onClick={e => giveUpMachinery(e)}><i className="fa fa-trash" aria-hidden="true"></i> &nbsp;{p.nameEq}</Button>

                                                                                                        :
                                                                                                            <div></div>
                                                                                                    }
                                                                                                    
                                                                                                    {
                                                                                                        typeof assignedMachinery.nameEq == 'undefined' ?
                                                                                                            <Button style={{backgroundColor: "orange"}} onClick={e => chosenMachinery(e, p)}><i className="fa fa-plus" aria-hidden="true"></i> &nbsp;{p.nameEq}</Button>
                                                                                                        :
                                                                                                            <div></div>
                                                                                                    }
                                                                                                    </div>
                                                                                                    
                                                                                                    
                                                                                                ))}
                                                                                            </>
                                                                                        )
                                                                                        :
                                                                                        (
                                                                                            <div>Nu există utilaje disponibile</div>
                                                                                        )
                                                                                    }
                                                                                    

                                                                                    {loadingAvailableEmployee == false ?
                                                                                    (   <>
                                                                                        
                                                                                        {
                                                                                            availableEmployee.length ?
                                                                                            (
                                                                                                <>
                                                                                                    <p style={{color: "#871f08"}}><strong>Angajați disponibili</strong></p>
                                                                                                    {availableEmployee.map(p => (
                                                                                                    
                                                                                                    
                                                                                                    <div key={p.id}>
                                                                                                    {
                                                                                                        typeof assignedEmployee.firstName != 'undefined' && assignedEmployee.id == p.id? 
                                                                                                            <Button variant="danger" onClick={e => giveUpEmployee(e)}><i className="fa fa-trash" aria-hidden="true"></i>&nbsp; {p.firstName} {p.lastName}</Button>

                                                                                                        :
                                                                                                            <div></div>
                                                                                                    }

                                                                                                    {
                                                                                                        typeof assignedEmployee.firstName == 'undefined' ?
                                                                                                            <Button variant="success" onClick={e => chosenEmployee(e, p)}><i className="fa fa-plus" aria-hidden="true"></i>&nbsp; {p.firstName} {p.lastName}</Button>
                                                                                                        :
                                                                                                            <div></div>
                                                                                                    }
                                                                                                    </div>
                                                                                                ))}
                                                                                                {
                                                                                                    typeof assignedEmployee.firstName != 'undefined' ?
                                                                                                        <div className={styles.saveButtonContainer}>
                                                                                                            <Button className={styles.saveButton} onClick={e => handleSubmit(e, operationType, taskName, startHour, duration, date, phase, problem, chosenProduct, calculatedDose, assignedMachinery, assignedEmployee)}>Salvează &nbsp; <i className="fa fa-check" aria-hidden="true"></i></Button>
                                                                                                        </div>
                                                                                                    :
                                                                                                        <div></div>
                                                                                                }
                                                                                                
                                                                                                </>
                                                                                            )
                                                                                            :
                                                                                            (
                                                                                                    <div>Nu există angajati disponibili</div>
                                                                                            )
                                                                                        }

                                                                                        </>
                                                                                    )
                                                                                    :
                                                                                    (
                                                                                        <div></div>
                                                                                    )}
                                                                                    </>
                                                                                )
                                                                                :
                                                                                (
                                                                                    <div>...</div>
                                                                                )

                                                                                
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
                                
                            </>
                        )
                    }
                    <div className={styles.quitButton}>
                        <Button onClick={handleClose}>Renunță</Button>
                    </div>
                </Form>
                </Card>
            </Modal>
            
            {/* <h4>Atentionari</h4>
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
            } */}

        <div className={styles.tabs}>
            <TaskTabs />
        </div>  

        </div>
        </div>
        
    )
}