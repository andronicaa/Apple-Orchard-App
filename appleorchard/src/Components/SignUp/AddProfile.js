import React, { useRef, useState } from 'react'
import styles from "./Styles/AddProfile.module.css";
import firebase from "../../Firebase/firebase";
import { useAuth } from '../../Firebase/context/AuthContext';
import { useHistory } from 'react-router-dom';
import { InputGroup, Form } from 'react-bootstrap';
import { jobs, driverCategories } from './UtilityStuff';

export default function AddProfile() {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const firstName = useRef();
    const lastName = useRef();
    const age = useRef();
    const address = useRef();
    const email = useRef();
    const phoneNumber = useRef();
    const companyName = useRef();
    const job = useRef();
    const driverLicense = useRef();
    const [jobField, setJobField] = useState('Cultivator');
    const [hasDriverLicense, setDriverLicense] = useState('NU');
    const [checkedState, setCheckedState] = useState(new Array(driverCategories.length).fill(false));
    const handleOnChangeCateg = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item)
        setCheckedState(updatedCheckedState)
    };
    
    const history = useHistory();
    var ok = false;
    var refProfile = "";
    var refRole = "";
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
    
    // functie care adauga un nou profil de utilizator
    function addProfile(e, role, firstName, lastName, age, address, email, phoneNumber, job, param1, param2) {
        e.preventDefault();

        var companyName = '';
        var hasDriverLicense = '';
        var catState = [];
        
        if(role === 'CC')
        {
            companyName = param1;
        } 
        if(role === 'A')
        {
            hasDriverLicense = param1;
            catState = param2;
        }
        // console.log("sunt:",firstName, lastName, age, address, email, phoneNumber, job, companyName, hasDriverLicense, catState);
        var busy = [];
        refProfile
            .set({firstName, lastName, age, email, address, phoneNumber, job, companyName, hasDriverLicense, catState, busy})
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
            console.log("S-a facut adaugarea de profil cu succes");
        history.push("/");
    }
    return (
        <>
        {
            (typeof currentUser.uid != 'undefined') ?
            <>
            <h3 className={`text-center ${styles.formTitle}`}>Adauga profil</h3>
            <div className={styles.mainContainer}>
            
            <form className={styles.input}>
            <div className={styles.rowContainer}>
            <div className={styles.flexItem}>
                        
                            <Form.Group className={styles.inputItem}>
                                <Form.Label htmlFor="lastname"><strong className={styles.tags}>Name</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependLastName">
                                            <InputGroup.Text>
                                                <i className={`fa fa-user ${styles.icons}`} aria-hidden="true" />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control 
                                            ref={lastName}
                                            type="text"
                                            placeholder="Nume"
                                            aria-describedby="inputGroupPrependLastName"
                                            required
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
                                <Form.Label htmlFor="age"><strong className={styles.tags}>Varsta</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependAge">
                                            <InputGroup.Text>
                                                <i className={`fa fa-child ${styles.icons}`} aria-hidden="true" />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control 
                                            ref={age}
                                            type="text"
                                            placeholder="Varsta"
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
                        </div>
                            <div  className={styles.flexItem}>
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
                                            type="text"
                                            placeholder="Email"
                                            aria-describedby="inputGroupPrependEmail"
                                            required
                                        />
                                    </InputGroup>
                            </Form.Group>
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
                                    <Form.Label htmlFor="function"><strong className={styles.tags}>Functie</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependFunction">
                                            <InputGroup.Text>
                                                <i className="fa fa-briefcase" aria-hidden="true"></i>
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
                                                <i className="fa fa-briefcase" aria-hidden="true"></i>
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
                                (
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
                                        />
                                        </InputGroup>
                                    </Form.Group>
                                )
                            }
                            
                                </div>
                                </div>
                            <div className="text-center">
                                {
                                    ['Cultivator', 'Cumparator'].includes(jobField) ? (
                                        <button className={`btn btn-success ${styles.saveDataButton}`}
                                        onClick={(e) => {e.preventDefault();  console.log(firstName.current.value, lastName.current.value, age.current.value, address.current.value, email.current.value, phoneNumber.current.value, job.current.value, companyName.current.value); addProfile(e, 'CC', firstName.current.value, lastName.current.value, age.current.value, address.current.value, email.current.value, phoneNumber.current.value, job.current.value, companyName.current.value, null )}}
                                        >
                                            Salveaza date
                                        </button>
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
                                            checkedState); addProfile(e, 'A', firstName.current.value, lastName.current.value, age.current.value, address.current.value, email.current.value, phoneNumber.current.value, job.current.value, hasDriverLicense, checkedState )}}
                                        >
                                            Salveaza date
                                        </button>
                                       
                                    )
                                }
                                
                            </div>
                            
                        </form>
        </div>
        </>
        :
            <div></div>
        }
        
        </>
    )
}
