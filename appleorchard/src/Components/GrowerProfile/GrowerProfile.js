import React, { useState, useEffect, useRef } from 'react';
import styles from './Style/GrowerProfile.module.css';
import firebase from '../../Firebase/firebase';
import { useAuth } from '../../Firebase/context/AuthContext';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';
import girl_avatar from '../../Imgs/girl_avatar.png';
import boy_avatar from '../../Imgs/boy_avatar.png';
import GrowerHeader from '../Header/GrowerHeader';
import UpdateProfile from './UpdateProfile';
export default function GrowerProfile() {
    const { currentUser } = useAuth();
    // form data
    const area = useRef(0); // in hectare sau metri patrati
    const measure = useRef('mp');
    const currency = useRef('RON'); 
    const noTrees = useRef(0);
    const year = useRef(0);
    const location = useRef('');
    const plantationPerYear = useRef('');
    const averageAnnualProfit = useRef(); // sa pun sa aleaga in lei sau euro
    const currentYear = new Date().getFullYear();
    const [validate, setValidate] = useState(false);
    // end form data

    const [profile, setProfile] = useState([]);
    const [extProfile, setExtProfile] = useState([]);
    const [loading, setLoading] = useState(true);
    const [gen, setGen] = useState('');
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);

    const [showEdit, setShowEdit] = useState(false);
    const handleShowEdit = () => {console.log("S-a apelat"); setShowEdit(true);}
    const handleCloseEdit = () => setShowEdit(false);
    const refProfile = firebase.firestore().collection("users").doc(currentUser.uid);
    const refProfileExt = firebase.firestore().collection("users").doc(currentUser.uid).collection("extProfile");
    function getProfile() {
        const items = [];
        refProfile.onSnapshot(doc => {
            items.push(doc.data());
            setGen(doc.data().sex);
            console.log("Profilul este: ", items);
            setProfile(items);
            
        })
    } 
    function getExtProfile() {
        const items = [];
        refProfileExt.onSnapshot(querySnapshot => {
            querySnapshot.forEach(doc => {
                items.push(doc.data());
            })
            // console.log(items.length);
            setExtProfile(items);
            setTimeout(function() {
                setLoading(false);
            }, 1000);
        })
    }
    // functie care adauga datele suplimentare despre livada
    function addExtProfile(e, area, noTrees, year, location, plantationPerYear, averageAnnualProfit, currency, measureArea) {
        e.preventDefault();
        const form = e.currentTarget;
        setValidate(true);
        if (form.checkValidity() === true) {
            var suprf = area;
            if(currency == 'EUR')
            {
                averageAnnualProfit = averageAnnualProfit * 4.98;
            }
            // daca s-a dat suprafata in mp => trebuie s-o transform in ha
            if(measureArea == 'mp')
                suprf = suprf / 10000;

            refProfileExt.add(
            {   
                area: suprf,
                noTrees: noTrees,
                year: year,
                location: location, 
                plantationPerYear: plantationPerYear,
                averageAnnualProfit: averageAnnualProfit
            }
            ).catch(err => {
                console.log(err)
            });
            // setShow(false);
        }
        
    }
    useEffect(() => {
        getProfile();
        getExtProfile();
    }, []);
    return (
        <div className={styles.mainPage}>
            <GrowerHeader />
        <div className={styles.mainContainer}>
            <div className={styles.flexContainer}>
                <div className={styles.mainInfo}>
                    <div className={styles.imgContainer}>
                        {
                            gen == 'F' ?
                                <img src={girl_avatar} alt="Avatar utilizator" className={styles.avatarImg}/>
                            :
                                <img src={boy_avatar} alt="Avatar utilizator" className={styles.avatarImg}/>

                        }
                    </div>
                    <div className={styles.infos}>
                        {
                            profile.map(p => (
                                <>
                                    <h4>{p.firstName} {p.lastName}</h4>
                                    <h5 style={{color: "#871f08"}}><i className="fa fa-building" aria-hidden="true"></i> &nbsp; <strong>{p.companyName}</strong></h5>
                                    <h6>{p.email}</h6>
                                    <p>{p.phoneNumber}</p>
                                </>
                            ))   
                        }
                        <div className={styles.updateCont}>
                       <Button className={styles.updateButton} onClick={handleShowEdit}>Editează profil &nbsp; <i className="fa fa-pencil-square-o" aria-hidden="true"></i></Button>
                      
                        <Modal show={showEdit} onHide={handleCloseEdit} animation={false}>
                            <UpdateProfile profile={profile} handleCloseEdit={handleCloseEdit}/>
                        </Modal>
                            
                       
                    </div>
                    </div>
                </div>
                <div className={styles.extProfileContainer}>
                    <div className={styles.title}>
                        <h4>Detalii livadă</h4>
                    </div>
                    <div className="text-center">
                            {
                                extProfile.length == 0 ?
                                    <Button className={styles.addDetailsButton} onClick={handleShow}>Adaugă detalii &nbsp; <i className="fa fa-info-circle" aria-hidden="true"></i>
                                    </Button>
                                :
                                    <div></div>

                            }
                    </div>
                   {
                       extProfile.length ?
                       (
                            loading == false ?
                            (
                                extProfile.map(p => (
                                    <>
                                        <p><strong>Suprafață: </strong>{p.area} ha</p>
                                        <p><strong>Locație: </strong> {p.location}</p>
                                        <p><strong>Nr. pomi: </strong>{p.noTrees}</p>
                                        <p><strong>Anul înființării: </strong>{p.year}</p>
                                        <p><strong>Profit mediu anual: </strong>{p.averageAnnualProfit} lei</p>
                                        <p><strong>Plantații pe an: </strong>{p.plantationPerYear}</p>
                                    </>
                                ))
                            )
                            :
                            (
                                <div></div>
                            )
                       )
                       :
                       (
                           
                               show ?
                               (
                                    <Form validated={validate}>
                                
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
                                    <Form.Label htmlFor="area"><strong className={styles.tags}>Număr copaci</strong></Form.Label>
                                        <InputGroup>
                                            <InputGroup.Prepend id="inputGroupNoTrees">
                                                <InputGroup.Text>
                                                    <i className={`fa fa-calculator ${styles.icons}`} aria-hidden="true" />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <Form.Control 
                                                required="true"
                                                ref={noTrees}
                                                type="number"
                                                min="1"
                                                placeholder="Nr. copaci.."
                                                aria-describedby="inputGroupNoTrees"
                                                
                                            />
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group className={styles.inputItem}>
                                    <Form.Label htmlFor="area"><strong className={styles.tags}>An înființare</strong></Form.Label>
                                        <InputGroup>
                                            <InputGroup.Prepend id="inputGroupYear">
                                                <InputGroup.Text>
                                                    <i className={`fa fa-calendar ${styles.icons}`} aria-hidden="true" />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <Form.Control 
                                                ref={year}
                                                type="number" 
                                                min="1950"
                                                max={currentYear}
                                                placeholder="An înființare.."
                                                aria-describedby="inputGroupYear"
                                                required
                                            />
                                        </InputGroup>
                                        </Form.Group>
                                        <Form.Group className={styles.inputItem}>
                                        <Form.Label htmlFor="area"><strong className={styles.tags}>Locație livadă</strong></Form.Label>
                                            <InputGroup>
                                                <InputGroup.Prepend id="inputGroupLocation">
                                                    <InputGroup.Text>
                                                        <i className={`fa fa-map-pin ${styles.icons}`} aria-hidden="true" />
                                                    </InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control 
                                                    ref={location}
                                                    type="text"
                                                    placeholder="Locație.."
                                                    aria-describedby="inputGroupLocation"
                                                    required
                                                />
                                            </InputGroup>
                                        </Form.Group>

                                        <Form.Group className={styles.inputItem}>
                                        <Form.Label htmlFor="area"><strong className={styles.tags}>Nr. copaci plantați pe an</strong></Form.Label>
                                            <InputGroup>
                                                <InputGroup.Prepend id="inputGroupPlantationPerYear">
                                                    <InputGroup.Text>
                                                        <i className={`fa fa-tree ${styles.icons}`} aria-hidden="true" />
                                                    </InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control 
                                                    ref={plantationPerYear}
                                                    type="number"
                                                    min="1"
                                                    placeholder="Plantație anuală..."
                                                    aria-describedby="inputGroupPlantationPerYear"
                                                    required
                                                />
                                            </InputGroup>
                                        </Form.Group>

                                        <Form.Group className={styles.inputItem}>
                                        <Form.Label htmlFor="area"><strong className={styles.tags}>Profit mediu anual</strong></Form.Label>
                                            <InputGroup>
                                                <InputGroup.Prepend id="inputGroupAverageAnnualProfit">
                                                    <InputGroup.Text>
                                                        <i className={`fa fa-credit-card ${styles.icons}`} aria-hidden="true" />
                                                    </InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control 
                                                    ref={averageAnnualProfit}
                                                    type="number"
                                                    min="1"
                                                    placeholder="Profit mediu..."
                                                    aria-describedby="inputGroupAverageAnnualProfit"
                                                    required
                                                />
                                                <InputGroup.Prepend id="inputGroupPrependCurrency">
                                                <Form.Control as="select" ref={currency} aria-describedby="inputGroupPrependCurrency"
                                        required>
                                                    <option>RON</option>
                                                    <option>EUR</option>
                                                </Form.Control>
                                            
                                        </InputGroup.Prepend>
                                            </InputGroup>
                                        </Form.Group>
                                    
                                <div className={`text-center ${styles.buttonContainer}`}>
                                    <Button type="submit" className={styles.submitButton} onClick={e => addExtProfile(e, area.current.value, noTrees.current.value, year.current.value, location.current.value, plantationPerYear.current.value, averageAnnualProfit.current.value, currency.current.value, measure.current.value)}>Salvează</Button>
                                </div>
                            </Form>
                               )
                               :
                               (
                                    <div></div>
                               )
                           

                       )
                   }
                </div>
            </div>
        </div>
        </div>
    )
}
