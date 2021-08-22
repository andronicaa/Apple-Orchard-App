import React, { useState, useEffect, useRef } from 'react';
import { driverCategories } from '../SignUp/UtilityStuff';
import firebase from "../../Firebase/firebase";
import { useAuth } from '../../Firebase/context/AuthContext';
import styles from './Style/Receipts.module.css';
import { months, equipmentType } from './Utility/ProductsFeature';
import { Modal, Table, Card, Alert, InputGroup, Form, Button } from 'react-bootstrap';
import generatePdfReceipt from './Utility/GeneratePdfReceipt';
export default function PhoneEquipmentReceipt() {
    const [totalPrice, setTotalPrice] = useState(0);
    const [data, setReceipts] = useState([]);
    const nameEq = useRef();
    const capacity = useRef();
    const currency = useRef();
    const price = useRef();
    const month = useRef();
    const type = useRef();
    const year = new Date().getFullYear();
    const [errorMsg, setErrorMsg] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { currentUser } = useAuth();
    const [checkedState, setCheckedState] = useState(new Array(driverCategories.length).fill(false));
    const refCurrentUser = firebase.firestore().collection("users").doc(currentUser.uid).collection("receiptEquipment");

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

    function addEquipment(e, nameEq, price, capacity, month, currency, type, checkedState ) {
        e.preventDefault();
        // trebuie sa fac validarea
        var newPrice = parseFloat(price);
        var errors = [];
        var ok = true;
        var driverCateg = getDriverCateg(checkedState);
        if(currency === 'EUR')
        {
            newPrice = price * 4.897;
        }
        if(nameEq === '' || price === '' || capacity === '' || month === '' || currency === '')
        {
            errors.push("Trebuie sa specificati o valoare pentru fiecare camp");
            ok = false;
        }
        // pentru utilajele stationare capacitatea poate fi 0
        if(capacity[0] === '.' || capacity[0] === '-')
        {   
            if(capacity[0] === '-')
                errors.push("Capacitatea trebuie sa fie un numar pozitiv");
            else
                errors.push("Formatul capacitatii nu este un numar corect");
            ok = false;
        }
        if(price[0] === '0' || price[0] === '.' || price[0] === '-')
        {
            if(price[0] === '-')
                errors.push("Pretul trebuie sa fie un numar pozitiv");
            else 
                errors.push("Formatul pretului nu este un numar corect");
            ok = false;
        }
        if(ok)
        {
            handleClose();
            refCurrentUser
            .add({
                nameEq: nameEq,
                price: newPrice,
                capacity: capacity,
                month: month, 
                currency: currency,
                type: type,
                year: year, 
                driverCateg: driverCateg
            })
            .catch((err) => {
                console.log(err);
            });
            setErrorMsg([]);
        }
        setErrorMsg(errors);
    }
    function deleteProduct(e, product) {

        console.log(product);
        refCurrentUser.
        doc(product.id).delete().then(() => {console.log("Sters", product.id)}).catch((err) => {console.log(err)});
    }
    function listReceipt() {
        refCurrentUser.onSnapshot((querySnapshot) => {
          const items = [];
          var totalPriceLocal = 0;
          querySnapshot.forEach((doc) => {
            items.push({id: doc.id,...doc.data()});
            totalPriceLocal += doc.data().price;
          });
          setReceipts(items);
          console.log("Item", items)
          setTotalPrice(totalPriceLocal);
        });
    } 

    useEffect(() => {
        console.log("Am intrat");
        listReceipt();
    }, []);

    return (
        <div>
            <Button className={styles.addReceiptButton} onClick={handleShow}><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;Adauga factura</Button>
                <Modal show={show} onHide={handleClose} animation={false}>
                    <Modal.Body>
                        <div>
                            <h3 className={`text-center`}>Adauga factura</h3>
                            <Form>
                                {errorMsg.length && <Alert variant="danger">
                                    {
                                        errorMsg.map((err) => (
                                            <p>{err}</p>
                                        ))
                                    }    
                                </Alert>}
                                <Form.Group>
                                    <Form.Label><strong>Nume utilaj</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependEqName">
                                            <InputGroup.Text>
                                                <i className={`fa fa-truck ${styles.icons}`} aria-hidden="true" />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control 
                                            ref={nameEq}
                                            type="text"
                                            placeholder="Nume"
                                            aria-describedby="inputGroupPrependEqName"
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label><strong>Pret</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependPrice">
                                            <InputGroup.Text>
                                                <i className="fa fa-money" aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control ref={price} type="number" placeholder="Pret..." aria-describedby="inputGroupPrependPrice"
                            required/>
                                        <InputGroup.Prepend id="inputGroupPrependCurrency">
                                            <Form.Control as="select" ref={currency} aria-describedby="inputGroupPrependCurrency"
                            required>
                                                <option>RON</option>
                                                <option>EUR</option>
                                            </Form.Control>
                                        </InputGroup.Prepend>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label><strong>Luna achizitie</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependMonth">
                                            <InputGroup.Text>
                                                <i className="fa fa-calendar" aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control as="select" ref={month} placeholder="Luna achizitie..." aria-describedby="inputGroupPrependMonth"
                            required>
                                            {
                                                months.map((m) => (
                                                    <option>{m}</option>
                                                ))
                                            }
                                        </Form.Control>
                                    </InputGroup>
                                    
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label><strong>Tip utilaj</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependEqType">
                                            <InputGroup.Text>
                                                <i className="fa fa-truck" aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control as="select" ref={type} placeholder="Tip utilaj..." aria-describedby="inputGroupPrependEqType"
                            required>
                                            {
                                                equipmentType.map((m) => (
                                                    <option>{m}</option>
                                                ))
                                            }
                                        </Form.Control>
                                    </InputGroup>
                                    
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label><strong>Capacitate cilindrica (cp)</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependCapacity">
                                            <InputGroup.Text>
                                                <i className={`fa fa-bar-chart ${styles.icons}`} aria-hidden="true" />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control 
                                            ref={capacity}
                                            type="text"
                                            placeholder="Capacitate"
                                            aria-describedby="inputGroupPrependCapacity"
                                            required
                                        />
                                    </InputGroup>
                                    
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label><strong>Categorii permis</strong></Form.Label>
                                    {
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
                                    }
                                    
                                </Form.Group>
                                <div className="text-center">
                                    <button className={`btn btn-success`}
                                        onClick={(e) => addEquipment(e, nameEq.current.value, price.current.value, capacity.current.value, month.current.value, currency.current.value, type.current.value, checkedState)}
                                    >
                                        Incarca factura
                                    </button>
                                </div>
                            </Form>
                        </div>
                    </Modal.Body>
                </Modal>
            
            {
               data.map(rc => (
                   <Card className={styles.infoCard}>
                        <Card.Body>
                           <p><strong>Produs: </strong>{rc.nameEq}</p>
                           <p><strong>Cantitate: </strong>{rc.type}</p>
                           <p><strong>Preț: </strong>{rc.price} {rc.currency}</p>
                        </Card.Body>
                        <Card.Footer>
                            <Button variant="danger" className={styles.deleteButton} onClick = {e => deleteProduct(e, rc)}><i className="fa fa-trash" aria-hidden="true"></i></Button>
                            <Button className={styles.pdfButton} onClick={e => generatePdfReceipt(e, rc, "equipment")}><i className="fa fa-file-pdf-o" aria-hidden="true"></i></Button>
                       </Card.Footer>
                    </Card>
               ))
           }
        </div>
    )
}
