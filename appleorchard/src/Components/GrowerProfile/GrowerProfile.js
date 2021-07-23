import React, { useState, useEffect, useRef } from 'react';
import styles from './Style/GrowerProfile.module.css';
import firebase from '../../Firebase/firebase';
import { useAuth } from '../../Firebase/context/AuthContext';
import { Button, Form, InputGroup, Modal, Row, Col } from 'react-bootstrap';
import image from '../../Imgs/new_home.png';
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
        })
    }
    // functie care adauga datele suplimentare despre livada
    function addExtProfile(e, area, noTrees, year, features, location, plantationPerYear, averageAnnualProfit) {
        e.preventDefault();
        refProfileExt.add(
            {   
                area: area,
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
        <div className={styles.mainContainer}>
            {
                extProfile.length == 0 ? 
                (
                    <>
                        <Button variant="success" onClick={handleShow}>Adauga detalii</Button>
                        <Modal show={show} onHide={handleClose} dialogClassName={styles.modalContainer} animation={false}>
                            <h4 className={`text-center ${styles.title}`}>Detalii suplimentare livada</h4>
                            <Form>
                                <Row className={styles.mainContainer}>
                                    <Col lg={5}>
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
                                                type="text"
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
                                    <Form.Label htmlFor="area"><strong className={styles.tags}>Soiuri cultivate/crescute</strong></Form.Label>
                                        <InputGroup>
                                            <InputGroup.Prepend id="inputGroupVariaty">
                                                <InputGroup.Text>
                                                    <i className={`fa fa-tree ${styles.icons}`} aria-hidden="true" />
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <Form.Control 
                                                ref={variety}
                                                type="text"
                                                placeholder="Soiuri.."
                                                aria-describedby="inputGroupVariaty"
                                                required
                                            />
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
                                                type="text"
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
                                                type="text"
                                                placeholder="An infiintare.."
                                                aria-describedby="inputGroupYear"
                                                required
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                    </Col>
                                    <Col lg={2}></Col>
                                    <Col lg={5}>
                                        <Form.Group className={styles.inputItem}>
                                        <Form.Label htmlFor="area"><strong className={styles.tags}>Dotari</strong></Form.Label>
                                            <InputGroup>
                                                <InputGroup.Prepend id="inputGroupFeatures">
                                                    <InputGroup.Text>
                                                        <i className={`fa fa-plus-circle ${styles.icons}`} aria-hidden="true" />
                                                    </InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control 
                                                    ref={features}
                                                    type="text"
                                                    placeholder="Dotari.."
                                                    aria-describedby="inputGroupFeatures"
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
                                                    type="text"
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
                                                    type="text"
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
                                    </Col>
                                </Row>
                                <div className={`text-center ${styles.buttonContainer}`}>
                                    <Button className={styles.submitButton} onClick={e => addExtProfile(e, area.current.value, noTrees.current.value, year.current.value, features.current.value, location.current.value, plantationPerYear.current.value, averageAnnualProfit.current.value, currency.current.value, currency.current.value)}>Salveaza</Button>
                                </div>
                            </Form>
                        </Modal>
                    </>
                )
                :
                (
                    <Row className={styles.infoContainer}>
                        <Col lg={6}>
                            <img src={image} className={styles.profileImg}/>
                        </Col>

                        <Col lg={3} className={styles.textCol}>
                            {
                                profile.map(p => (
                                    <>
                                        <h3>{p.companyName}</h3>
                                        <p><strong>Nume: </strong>{p.lastName}</p>
                                        <p><strong>Prenume: </strong>{p.firstName}</p>
                                        <p><strong>Email: </strong>{p.email}</p>
                                        <p><strong>Nr. Telefon: </strong>{p.phoneNumber}</p>
                                    </>
                                ))
                            }
                        </Col>
                        <Col lg={3} className={styles.textCol}>
                            buna ziua
                        </Col>
                    </Row>
                )
            }
        </div>
    )
}
