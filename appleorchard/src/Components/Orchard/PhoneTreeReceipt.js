import React, { useState, useEffect, useRef } from 'react';
import firebase from "../../Firebase/firebase";
import { useAuth } from '../../Firebase/context/AuthContext';
import { Modal, Card, Alert, InputGroup, Form, Button } from 'react-bootstrap';
import { months, appleTypes } from './Utility/ProductsFeature';
import styles from './Style/Receipts.module.css';

export default function PhoneTreeReceipt() {
    const [totalPrice, setTotalPrice] = useState(0);
    const [data, setReceipts] = useState([]);
    const name = useRef();
    const quantity = useRef();
    const currency = useRef();
    const price = useRef();
    const month = useRef();
    const [errorMsg, setErrorMsg] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { currentUser } = useAuth();
    const year = new Date().getFullYear();
    const refCurrentUser = firebase.firestore().collection("users").doc(currentUser.uid).collection("receiptTrees");
    

    function addTree(e, name, price, month, currency, quantity) {
        e.preventDefault();
        // trebuie sa fac validarea
        var newPrice = parseFloat(price);
        var errors = [];
        var ok = true;
        if(currency === 'EUR')
        {
            newPrice = price * 4.897;
        }
        if(name === '' || quantity === '' || currency === '' || price === '' || month === '')
        {
            errors.push("Trebuie sa specificati o valoare pentru fiecare camp");
            ok = false;
        }
        if(ok)
        {
            handleClose();
            refCurrentUser
            .add({
                name: name,
                price: newPrice,
                quantity: quantity,
                month: month, 
                currency: currency,
                year: year
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
          console.log("FACTURILE SUNT", items)
          setTotalPrice(totalPriceLocal);
        });
    }

   
    useEffect(() => {
        console.log("Am intrat");
        listReceipt();
    }, []);

    return (
        
        <div className={styles.smallScreen}>
            <Button className={styles.addReceiptButton} onClick={handleShow}><i className="fa fa-plus" aria-hidden="true"></i>&nbsp;Adauga factura</Button>
            <Modal show={show} onHide={handleClose}>
                    <Modal.Body>
                        <div>
                            <h3 className={`text-center`} style={{color: "#871f08"}}>Adaugă factură</h3>
                            <Form>
                                    {errorMsg.length ?
                                        (
                                            errorMsg.map((err) => (
                                                <Alert variant="danger">{err}</Alert>
                                            ))
                                        )
                                        :
                                        (
                                            <div></div>
                                        ) 
                                    }   
                                <Form.Group>
                                    <Form.Label><strong>Soi</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependName">
                                            <InputGroup.Text>
                                                <i className={`fa fa-shopping-bag ${styles.icon}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control as="select" ref={name} placeholder="Soi..." aria-describedby="inputGroupPrependName"
                            required>
                                            {
                                                appleTypes.map((m) => (
                                                    <option>{m}</option>
                                                ))
                                            }
                                        </Form.Control>
                                    </InputGroup>
                                    
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label><strong>Preț (total)</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependPrice">
                                            <InputGroup.Text>
                                                <i className={`fa fa-money ${styles.icon}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control ref={price} type="number" min="1" placeholder="Pret..." aria-describedby="inputGroupPrependPrice"
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
                                    <Form.Label><strong>Lună achiziție</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependMonth">
                                            <InputGroup.Text>
                                                <i className={`fa fa-calendar ${styles.icon}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control as="select" ref={month} placeholder="Lună achiziție..." aria-describedby="inputGroupPrependMonth"
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
                                    <Form.Label><strong>Cantitate</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependQuantity">
                                            <InputGroup.Text>
                                                <i className={`fa fa-sort-amount-desc ${styles.icon}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control ref={quantity} type="number" min="1" placeholder="Cantitate..." aria-describedby="inputGroupPrependQuantity"
                            required/>
                                    </InputGroup>
                                </Form.Group>
                                <div className="text-center">
                                    <Button className={styles.addProductButton}
                                        onClick={(e) => addTree(e, name.current.value, price.current.value, month.current.value, currency.current.value, quantity.current.value)}
                                    >
                                        Incarcă factură
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Modal.Body>
                </Modal>
           {
               data.map(rc => (
                   <Card className={styles.infoCard}>
                        <Card.Body>
                           <p><strong>Produs: </strong>{rc.product}</p>
                           <p><strong>Cantitate: </strong>{rc.quantity}</p>
                           <p><strong>Preț: </strong>{rc.price} {rc.currency}</p>
                        </Card.Body>
                        <Card.Footer>
                            <Button variant="danger" className={styles.deleteButton} onClick = {e => deleteProduct(e, rc)}><i className="fa fa-trash" aria-hidden="true"></i></Button>
                            <Button className={styles.pdfButton}><i className="fa fa-file-pdf-o" aria-hidden="true"></i></Button>
                       </Card.Footer>
                    </Card>
               ))
           }
        </div>
        
    )
}
