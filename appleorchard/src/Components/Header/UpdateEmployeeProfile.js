import React, { useRef, useState } from 'react';
import firebase from '../../Firebase/firebase';
import { useAuth } from '../../Firebase/context/AuthContext';
import styles from '../SignUp/Styles/AddProfile.module.css'
import { Form, InputGroup, Button } from 'react-bootstrap';
import { driverCategories } from '../SignUp/UtilityStuff';


export default function UpdateEmployeeProfile({profile, handleClose}) {
    const { currentUser } = useAuth();
    const firstName = useRef();
    const lastName = useRef();
    const age = useRef();
    const address = useRef();
    const email = useRef();
    const phoneNumber = useRef();
    const [checkChange, setCheckChange] = useState(false);
    const [hasDriverLicense, setDriverLicense] = useState(profile.hasDriverLicense);
    const [checkedState, setCheckedState] = useState(new Array(driverCategories.length).fill(false));
    const handleOnChangeCateg = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item)
        setCheckedState(updatedCheckedState);
        setCheckChange(true);
    };
    const refProfile = firebase.firestore().collection("users").doc(currentUser.uid);


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

    function updateEmployeeProfile(e) {
        e.preventDefault();
        handleClose();
        var categories = checkedState;
        console.log("CATEGORIILE CARE S-AU SCHIMBAT SUNT: ", checkedState);
        console.log(lastName.current.value);
        console.log(firstName.current.value);
        console.log(age.current.value);
        console.log(email.current.value);
        console.log("are permis", hasDriverLicense);
        console.log(getDriverCateg(checkedState));
        
        categories = getDriverCateg(checkedState);
        if(hasDriverLicense == 'NU')
            categories = '';
        if(checkChange == false && hasDriverLicense == 'DA')
            categories = profile.driverCateg;
        refProfile.update({
            lastName: lastName.current.value,
            firstName: firstName.current.value,
            address: address.current.value,
            age: age.current.value,
            email: email.current.value,
            driverCateg: categories,
            hasDriverLicense: hasDriverLicense,
            phoneNumber: phoneNumber.current.value
        }).then(() => {console.log("Operatia de update s-a realizat cu succes")}).catch(err => console.log(err));
        
    }


    return (
        <div>
             <Form>
                <Form.Group className={styles.inputItem}>
                <Form.Label htmlFor="lastname"><strong className={styles.tags}>Nume</strong></Form.Label>
                    <InputGroup>
                        <InputGroup.Prepend id="inputGroupPrependLastName">
                            <InputGroup.Text>
                                <i className={`fa fa-user ${styles.icons}`} aria-hidden="true" />
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control ref={lastName} type="text" aria-describedby="inputGroupPrependLastName"
                            required
                            className={styles.formInputControl}
                            defaultValue={profile.lastName}
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
                        <Form.Control ref={firstName} type="text"  aria-describedby="inputGroupPrependFirstName"
                            required
                            className={styles.formInputControl}
                            defaultValue={profile.firstName}
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
                        <Form.Control ref={age} type="number" min="0" aria-describedby="inputGroupPrependAge"
                            required
                            className={styles.formInputControl}
                            defaultValue={profile.age}
                        />
                    </InputGroup>
            </Form.Group>

            <Form.Group className={styles.inputItem}>
                <Form.Label htmlFor="email"><strong className={styles.tags}>Email</strong></Form.Label>
                    <InputGroup>
                        <InputGroup.Prepend id="inputGroupPrependEmail">
                            <InputGroup.Text>
                                <i className={`fa fa-envelope ${styles.icons}`} aria-hidden="true" />
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control ref={email} type="text" aria-describedby="inputGroupPrependEmail"
                            required
                            className={styles.formInputControl}
                            defaultValue={profile.email}
                        />
                    </InputGroup>
            </Form.Group>
            <Form.Group className={styles.inputItem}>
                <Form.Label htmlFor="address"><strong className={styles.tags}>Adresa</strong></Form.Label>
                    <InputGroup>
                        <InputGroup.Prepend id="inputGroupPrependAddress">
                            <InputGroup.Text>
                                <i className={`fa fa-address-card ${styles.icons}`} aria-hidden="true" />
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control ref={address} type="text" aria-describedby="inputGroupPrependAddress"
                            required
                            className={styles.formInputControl}
                            defaultValue={profile.address}
                        />
                    </InputGroup>
            </Form.Group>
            <Form.Group className={styles.inputItem}>
                <Form.Label htmlFor="phoneNumber"><strong className={styles.tags}>Nr. Telefon</strong></Form.Label>
                    <InputGroup>
                        <InputGroup.Prepend id="inputGroupPrependPhoneNumber">
                            <InputGroup.Text>
                                <i className={`fa fa-phone ${styles.icons}`} aria-hidden="true" />
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control ref={phoneNumber} type="text" aria-describedby="inputGroupPrependPhoneNumber"
                            required
                            className={styles.formInputControl}
                            defaultValue={profile.phoneNumber}
                        />
                    </InputGroup>
            </Form.Group>
            <Form.Group className={styles.inputItem}>
                <Form.Label htmlFor="driver-license"><strong className={styles.tags}>Permis de conducere</strong></Form.Label>
                <InputGroup>
                <InputGroup.Prepend id="inputGroupPrependDriverLicense">
                    <InputGroup.Text>
                        <i className={`fa fa-car ${styles.icons}`} aria-hidden="true"></i>
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control as="select" aria-describedby="inputGroupPrependDriverLicense"
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


            {
                hasDriverLicense === 'DA' ? 
(               <><Form.Label htmlFor="driver-license-categ"><strong className={styles.tags}>Categorie permis</strong></Form.Label><br/></>
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
            <div className={styles.emplUpdateCont}>
                <Button onClick={e => updateEmployeeProfile(e)} className={styles.saveEmplButton}>Salvează date</Button>
            </div>
        </Form>
        </div>
    )
}
