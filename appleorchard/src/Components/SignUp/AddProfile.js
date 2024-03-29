import React, { useRef, useState, useEffect } from 'react'
import styles from "./Styles/AddProfile.module.css";
import firebase from "../../Firebase/firebase";
import { useAuth } from '../../Firebase/context/AuthContext';
import { useHistory } from 'react-router-dom';
import { InputGroup, Form, Alert, Button } from 'react-bootstrap';
import { jobs, driverCategories } from './UtilityStuff';
import Tooltip from "@material-ui/core/Tooltip";


export default function AddProfile() {
    const { currentUser, emailVerification } = useAuth();
    const [loading, setLoading] = useState(true);
    const [errors, setErros] = useState([]);
    const [verifEmail, setVerifEmail] = useState(false);
    const firstName = useRef();
    const lastName = useRef();
    const age = useRef();
    const address = useRef();
    const email = useRef();
    const phoneNumber = useRef();
    const companyName = useRef();
    const job = useRef();
    const sex = useRef();
    const driverLicense = useRef();
    const area = useRef();
    const measure = useRef();
    const [jobField, setJobField] = useState('Cultivator');
    const [validate, setValidate] = useState(false);
    const [hasDriverLicense, setDriverLicense] = useState('NU');
    const [checkedState, setCheckedState] = useState(new Array(driverCategories.length).fill(false));
    const handleOnChangeCateg = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item)
        setCheckedState(updatedCheckedState)
    };
    


    function getDriverCateg(driverArray) {
        // console.log("S-a apelat");
        let driverCateg = "";
        if(driverArray[0] == true)
            driverCateg += "B";
        if(driverArray[1] == true)
            driverCateg += "B1";
        if(driverArray[2] == true)
            driverCateg += "C";
        if(driverArray[3] == true)
            driverCateg += "C1";
        if(driverArray[4] == true)
            driverCateg += "D";
        if(driverArray[5] == true)
            driverCateg += "D1";

        return driverCateg;

    }

    const history = useHistory();
    var ok = false;
    var driverCateg = getDriverCateg(checkedState);
    var refProfile;
    var refRole;
    while(ok == false)
    {
        
        
            while (typeof currentUser == 'undefined')
            {
                ok = false;
            }
            if(typeof currentUser != 'undefined')
            {
                while (typeof currentUser.uid == 'undefined')
                {
                    ok = false;
                }
                refProfile = firebase.firestore().collection("users").doc(currentUser.uid);
                refRole = firebase.firestore().collection("userRole").doc(currentUser.uid);
                ok = true;
            }
        
        
        
    }
    
    function checkIfUserExists() {
        const refProfile = firebase.firestore().collection("users").doc(currentUser.uid);
        refProfile.get().then(doc => {
            if(doc.exists)
            {
                const itemProfile = [];
                itemProfile.push(doc.data());
                console.log(itemProfile);
                console.log("lungimea este: ", itemProfile.length);
                history.push("/");
            }
            else
            {
                console.log("Inca nu exista acest document");
            }
        })
        
    }
    // functie care adauga un nou profil de utilizator
    function addProfile(e, role, sex, area, measure, firstName, lastName, age, address, email, phoneNumber, job, param1, param2) {
        e.preventDefault();
        const form = e.currentTarget;
        setValidate(true);
        if (form.checkValidity() === true) 
        {
            var ok = true;
        const errorsMsg = [];
        if(role == '' || firstName == '' || lastName == '' || age == '' || address == '' || email == '' || phoneNumber == '' || job == '')
        {
            ok = false;
            errorsMsg.push("Trebuie sa completati toate campurile formularului\n");
        }
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) == false)
        {
            ok = false;
            errorsMsg.push("Formatul adresei de email nu este corect\n");
        }
            
        if(phoneNumber.length != 10)
        {
            ok = false;
            errorsMsg.push("Formatul numarului de telefon nu este corect\n");
        }
        var suprf = area;
        if(measure == 'mp')
            suprf = suprf / 10000;
        var companyName = '';
        var hasDriverLicense = '';
        
        if(role === 'CC')
        {
            companyName = param1;
        } 
        if(role === 'A')
        {
            hasDriverLicense = param1;
        }
        // console.log("sunt:",firstName, lastName, age, address, email, phoneNumber, job, companyName, hasDriverLicense, catState);

        if(ok)
        {
            refProfile
            .set({
                firstName, lastName, age, email, address, phoneNumber, job, companyName, hasDriverLicense, driverCateg, sex, suprf
            })
            .catch((err) => {
                console.log(err);
            });
        refRole
            .set({
                job
            })
            .catch((err) => {
                console.log(err);
            })
            if(verifEmail)
            {
                console.log("S-a facut adaugarea de profil cu succes");
                history.push("/");
            }
            else
            {
                console.log("n-a facut verificarea");
            }
            
            
        }
        setErros(errorsMsg);
        
        }

        
    }
    function checkVerifiedEmail() {
        if(currentUser.emailVerified == true) 
        {
            console.log("A verificat email-ul");
            setVerifEmail(true);
        }
        else
        {
            console.log("N-a verificat email-ul");
        }
    }

    async function handleEmailVerification() {
        try {
            await emailVerification();
        } catch(err) {
            console.log("Nu s-a putut trimite email-ul de verificare");
        }
    }

    useEffect(() => {
       checkIfUserExists();
       checkVerifiedEmail();
    }, []);
    
    return (
        <div className={styles.mainPage}>
        <Tooltip title="Apasati pentru a verifica adresa de email.">
            <Button onClick={handleEmailVerification} className={styles.verEmailButton}>Verificare email</Button>
        </Tooltip>
        {
            (typeof currentUser.uid != 'undefined') ?
            <div className={styles.princContainer}>
            <p className={`text-center ${styles.formTitle}`}>Adaugă profil</p>
            <div className={styles.mainContainer}>
            
            <Form className={styles.input} validated={validate}>
            <div className={styles.rowContainer}>
            <div className={styles.flexItem}>
                        
                            <Form.Group className={styles.inputItem}>
                                <Form.Label htmlFor="lastname"><strong className={styles.tags}>Nume</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependLastName">
                                            <InputGroup.Text>
                                                <i className={`fa fa-user ${styles.icons}`} aria-hidden="true" />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control ref={lastName} type="text" placeholder="Nume" aria-describedby="inputGroupPrependLastName"
                                            required
                                            className={styles.formInputControl}
                                        />
                                    </InputGroup>
                            </Form.Group>
                            <Form.Group className={styles.inputItem}>
                                <Form.Label htmlFor="firstname"><strong className={styles.tags}>Prenume</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependFirstName">
                                            <InputGroup.Text>
                                                <i className={`fa fa-user ${styles.icons}`} aria-hidden="true" />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control 
                                            ref={firstName}
                                            type="text"
                                            placeholder="Prenume"
                                            aria-describedby="inputGroupPrependFirstName"
                                            required
                                        />
                                    </InputGroup>
                            </Form.Group>
                            <Form.Group className={styles.inputItem}>
                                <Form.Label htmlFor="age"><strong className={styles.tags}>Vârsta</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependAge">
                                            <InputGroup.Text>
                                                <i className={`fa fa-child ${styles.icons}`} aria-hidden="true" />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control 
                                            ref={age}
                                            type="number"
                                            min="0"
                                            placeholder="Vârsta"
                                            aria-describedby="inputGroupPrependAge"
                                            required
                                        />
                                    </InputGroup>
                            </Form.Group>
                            <Form.Group className={styles.inputItem}>
                                <Form.Label htmlFor="address"><strong className={styles.tags}>Adresa</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependAddress">
                                            <InputGroup.Text>
                                                <i className={`fa fa-address-card ${styles.icons}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control 
                                            ref={address}
                                            type="text"
                                            placeholder="Adresa"
                                            aria-describedby="inputGroupPrependAddress"
                                            required
                                        />
                                    </InputGroup>
                            </Form.Group>
                            <Form.Group className={styles.inputItem}>
                                <Form.Label htmlFor="address"><strong className={styles.tags}>Email</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependEmail">
                                            <InputGroup.Text>
                                                <i className={`fa fa-envelope ${styles.icons}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control 
                                            ref={email}
                                            defaultValue={currentUser.email}
                                            type="email"
                                            placeholder="Email"
                                            aria-describedby="inputGroupPrependEmail"
                                            required
                                        />
                                    </InputGroup>
                            </Form.Group>
                            </div>
                            <div  className={styles.flexItem}>
                            
                            <Form.Group className={styles.inputItem}>
                                <Form.Label htmlFor="phone-number"><strong className={styles.tags}>Nr. Telefon</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependPhoneNumber">
                                            <InputGroup.Text>
                                                <i className={`fa fa-phone ${styles.icons}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control 
                                            ref={phoneNumber}
                                            type="text"
                                            placeholder="Nr. Telefon"
                                            aria-describedby="inputGroupPrependPhoneNumber"
                                            required
                                        />
                                    </InputGroup>
                            </Form.Group>
                            <Form.Group className={styles.inputItem}>
                                    <Form.Label htmlFor="function"><strong className={styles.tags}>Gen</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependSex">
                                            <InputGroup.Text>
                                                <i className={`fa fa-user ${styles.icons}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control as="select" ref={sex} aria-describedby="inputGroupPrependSex"
                            required>
                                            {
                                                ['F', 'M'].map((j) => (
                                                    <option key={j}>
                                                        {j}
                                                    </option>
                                                ))
                                            }
                                        </Form.Control>
                                    </InputGroup>
                                </Form.Group>
                            <Form.Group className={styles.inputItem}>
                                    <Form.Label htmlFor="function"><strong className={styles.tags}>Funcție</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependFunction">
                                            <InputGroup.Text>
                                                <i className={`fa fa-briefcase ${styles.icons}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control as="select" ref={job} aria-describedby="inputGroupPrependProduct"
                            required value={jobField} onChange={(e) => setJobField(e.target.value)}>
                                            {
                                                jobs.map((j) => (
                                                    <option key={j}>
                                                        {j}
                                                    </option>
                                                ))
                                            }
                                        </Form.Control>
                                    </InputGroup>
                                </Form.Group>
                            {
                                ['Cultivator', 'Cumparator'].includes(jobField) == false ? (
                                    <>
                                    <Form.Group className={styles.inputItem}>
                                        <Form.Label htmlFor="driver-license"><strong className={styles.tags}>Permis de conducere</strong></Form.Label>
                                        <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependDriverLicense">
                                            <InputGroup.Text>
                                                <i className={`fa fa-car ${styles.icons}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control as="select" ref={driverLicense} aria-describedby="inputGroupPrependDriverLicense"
                                         value={hasDriverLicense} onChange={(e) => setDriverLicense(e.target.value)}>
                                            {
                                                ['DA', 'NU'].map((j) => (
                                                    <option key={j}>
                                                        {j}
                                                    </option>
                                                ))
                                            }
                                        </Form.Control>
                                     </InputGroup>
                                    </Form.Group>

                                    <div className="d-flex flex-row justify-content-around">
                                    <Form.Group className={styles.inputItem}>
                                    {
                                        hasDriverLicense === 'DA' ? 
(                                           <><Form.Label htmlFor="driver-license-categ"><strong className={styles.tags}>Categorie permis</strong></Form.Label><br/></>
)                                        :
                                        null

                                    }
                                    {

                                    
                                        hasDriverLicense === 'DA' ? (
                                                driverCategories.map(({name}, index) => (
                                                    
                                                        <Form.Check
                                                            key={index}
                                                            custom
                                                            inline
                                                            label={name}
                                                            type="checkbox"
                                                            id={`custom-checkbox-${index}`}
                                                            checked={checkedState[index]}
                                                            onChange={() => handleOnChangeCateg(index)}
                                                        />
                                                    
                                                )
                                                   
                                                
                                                )
                                        ) : 
                                        
                                            null
                                        
                                    }
                                    </Form.Group>
                                    </div>
                                    </>
                                ) 
                                :
                                (<>
                                    <Form.Group className={styles.inputItem}>
                                    <Form.Label htmlFor="area"><strong className={styles.tags}>Suprafață</strong></Form.Label>
                                        <InputGroup>
                                            <InputGroup.Prepend id="inputGroupArea">
                                                <InputGroup.Text>
                                                    <i className={`fa fa-area-chart ${styles.icons}`} aria-hidden="true" />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <Form.Control 
                                                ref={area}
                                                type="number"
                                                min="1"
                                                placeholder="Suprafață"
                                                aria-describedby="inputGroupArea"
                                                defaultValue={area}
                                                required
                                            />
                                            <InputGroup.Prepend id="inputGroupPrependMeasure">
                                            <Form.Control as="select" ref={measure} aria-describedby="inputGroupPrependMeasure"
                                        required>
                                                <option>mp</option>
                                                <option>ha</option>
                                            </Form.Control>
                                        </InputGroup.Prepend>
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group className={styles.inputItem}>
                                        <Form.Label htmlFor="company-name"><strong className={styles.tags}>Nume companie</strong></Form.Label>
                                        <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependCompanyName">
                                            <InputGroup.Text>
                                                <i className={`fa fa-building-o ${styles.icons}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control 
                                            ref={companyName}
                                            type="text"
                                            placeholder="Nume companie"
                                            aria-describedby="inputGroupPrependCompanyName"
                                            required
                                        />
                                        </InputGroup>
                                    </Form.Group>
                                </>
                                )
                            }
                            
                                </div>
                                </div>
                            <div className="text-center">
                                {
                                    ['Cultivator'].includes(jobField) ? (
                                        <Tooltip title="Adresa de mail trebuie confirmata pentru salvarea datelor. Dupa confirmarea adresei dati refresh paginii.">
                                            <button className={`btn btn-success ${styles.saveDataButton}`} 
                                            onClick={(e) => {e.preventDefault();  console.log(firstName.current.value, lastName.current.value, age.current.value, address.current.value, email.current.value, phoneNumber.current.value, job.current.value, sex.current.value, companyName.current.value); addProfile(e, 'CC', sex.current.value, area.current.value, measure.current.value, firstName.current.value, lastName.current.value, age.current.value, address.current.value, email.current.value, phoneNumber.current.value, job.current.value, companyName.current.value, null )}}
                                            >
                                                Salvează date
                                            </button>
                                        </Tooltip>
                                    ) :
                                    (
                                        <button className={`btn btn-success ${styles.saveDataButton}`}
                                        onClick={(e) => { e.preventDefault();console.log(firstName.current.value, 
                                            lastName.current.value, 
                                            age.current.value, 
                                            address.current.value, 
                                            email.current.value, 
                                            phoneNumber.current.value, 
                                            job.current.value, 
                                            hasDriverLicense, 
                                            checkedState); addProfile(e, 'A', sex.current.value, null, null, firstName.current.value, lastName.current.value, age.current.value, address.current.value, email.current.value, phoneNumber.current.value, job.current.value, hasDriverLicense, checkedState )}}
                                        >
                                            Salvează date
                                        </button>
                                       
                                    )
                                }
                                
                            </div>
                            
                        </Form>
        {
            errors.length ?
            (
                errors.map(p => (
                    <Alert variant="warning" key={p} className={styles.alerts}>
                        {p}
                    </Alert>
                ))
            )
            :
            (
                <div></div>
            )
        }
        </div>
        </div>
        :
            <div></div>
        }
        
        </div>
    )
}
