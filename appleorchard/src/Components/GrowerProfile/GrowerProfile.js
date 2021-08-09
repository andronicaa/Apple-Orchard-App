import React, { useState, useEffect, useRef } from 'react';
import styles from './Style/GrowerProfile.module.css';
import firebase from '../../Firebase/firebase';
import { useAuth } from '../../Firebase/context/AuthContext';
import { Button, Form, InputGroup, Modal, Row, Col } from 'react-bootstrap';
import girl_avatar from '../../Imgs/girl_avatar.png';
import image from '../../Imgs/new_home.png';
import GrowerHeader from '../Header/GrowerHeader';
export default function GrowerProfile() {
    const { currentUser } = useAuth();
    // form data
    const area = useRef(0); // in hectare sau metri patrati
    const measure = useRef();
    const currency = useRef('mp');
    const variety = useRef('RON'); 
    const noTrees = useRef(0);
    const year = useRef(0);
    const features = useRef('');
    const location = useRef('');
    const plantationPerYear = useRef('');
    const averageAnnualProfit = useRef(); // sa pun sa aleaga in lei sau euro
    // end form data
    const [profile, setProfile] = useState([]);
    const [extProfile, setExtProfile] = useState([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const refProfile = firebase.firestore().collection("users").doc(currentUser.uid);
    const refProfileExt = firebase.firestore().collection("users").doc(currentUser.uid).collection("extProfile");
    function getProfile() {
        const items = [];
        refProfile.onSnapshot(doc => {
            items.push(doc.data());
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
    function addExtProfile(e, area, noTrees, year, features, location, plantationPerYear, averageAnnualProfit, currency, measureArea) {
        e.preventDefault();
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
                features: features, 
                location: location, 
                plantationPerYear: plantationPerYear,
                averageAnnualProfit: averageAnnualProfit
            }
        ).catch(err => {
            console.log(err)
        })
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
                        <img src={girl_avatar} alt="Avatar utilizator" className={styles.avatarImg}/>
                    </div>
                    <div className={styles.infos}>
                        {
                            
                            profile.map(p => (
                                <>
                                    <h4>{p.firstName} {p.lastName}</h4>
                                    <h5 style={{color: "#871f08"}}><strong>{p.companyName}</strong></h5>
                                    <p>{p.email}</p>
                                    <p>{p.phoneNumber}</p>
                                </>
                            ))
                            
                        }
                        <div className="text-center">
                            {
                                extProfile.length == 0 ?
                                    <Button className={styles.addDetailsButton} onClick={handleShow}>Adauga detalii</Button>
                                :
                                    <div></div>

                            }
                        </div>
                    </div>
                </div>
                <div className={styles.extProfileContainer}>
                   {
                       extProfile.length ?
                       (
                            loading == false ?
                            (
                                extProfile.map(p => (
                                    <>
                                        <p><strong>Suprafata: </strong>{p.area} ha</p>
                                        <p><strong>Locatie: </strong> {p.location}</p>
                                        <p><strong>Nr. pomi: </strong>{p.noTrees}</p>
                                        <p><strong>Anul infiintarii: </strong>{p.year}</p>
                                        <p><strong>Profit mediu anual: </strong>{p.averageAnnualProfit} lei</p>
                                        <p><strong>Plantatii pe an: </strong>{p.plantationPerYear}</p>
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
                                    <Form>
                                
                                    <Form.Group className={styles.inputItem}>
                                    <Form.Label htmlFor="area"><strong className={styles.tags}>Suprafata</strong></Form.Label>
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
                                                placeholder="Suprafata"
                                                aria-describedby="inputGroupArea"
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
                                    <Form.Label htmlFor="area"><strong className={styles.tags}>Numar copaci</strong></Form.Label>
                                        <InputGroup>
                                            <InputGroup.Prepend id="inputGroupNoTrees">
                                                <InputGroup.Text>
                                                    <i className={`fa fa-calculator ${styles.icons}`} aria-hidden="true" />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <Form.Control 
                                                ref={noTrees}
                                                type="number"
                                                min="1"
                                                placeholder="Nr. copaci.."
                                                aria-describedby="inputGroupNoTrees"
                                                required
                                            />
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group className={styles.inputItem}>
                                    <Form.Label htmlFor="area"><strong className={styles.tags}>An infiintare</strong></Form.Label>
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
                                                placeholder="An infiintare.."
                                                aria-describedby="inputGroupYear"
                                                required
                                            />
                                        </InputGroup>
                                        </Form.Group>
                                        <Form.Group className={styles.inputItem}>
                                        <Form.Label htmlFor="area"><strong className={styles.tags}>Locatie livada</strong></Form.Label>
                                            <InputGroup>
                                                <InputGroup.Prepend id="inputGroupLocation">
                                                    <InputGroup.Text>
                                                        <i className={`fa fa-map-pin ${styles.icons}`} aria-hidden="true" />
                                                    </InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control 
                                                    ref={location}
                                                    type="text"
                                                    placeholder="Locatie.."
                                                    aria-describedby="inputGroupLocation"
                                                    required
                                                />
                                            </InputGroup>
                                        </Form.Group>

                                        <Form.Group className={styles.inputItem}>
                                        <Form.Label htmlFor="area"><strong className={styles.tags}>Nr. copaci plantati pe an</strong></Form.Label>
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
                                                    placeholder="Plantatie anuala..."
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
                                    <Button className={styles.submitButton} onClick={e => addExtProfile(e, area.current.value, noTrees.current.value, year.current.value, location.current.value, plantationPerYear.current.value, averageAnnualProfit.current.value, currency.current.value, measure.current.value)}>Salveaza</Button>
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
