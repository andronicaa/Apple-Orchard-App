import React, { useState, useEffect, useRef } from 'react';
import firebase from "../../Firebase/firebase";
import { useAuth } from '../../Firebase/context/AuthContext';
import { Modal, Card, Alert, InputGroup, Form, Button } from 'react-bootstrap';
import { months } from './Utility/ProductsFeature';
import styles from './Style/Receipts.module.css';
import generatePdfReceipt from './Utility/GeneratePdfReceipt';


export default function PhoneSubstanceReceipt() {

    const [totalPrice, setTotalRrice] = useState(0);
    const [errorMsg, setErrorMsg] = useState([]);
    const { currentUser } = useAuth();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [data, setReceipts] = useState([]);
    const measureQuantity = useRef();
    const currency = useRef();
    const product = useRef();
    const price = useRef();
    const quantity = useRef();
    const month = useRef();
    const year = new Date().getFullYear();
    const refCurrentUser = firebase.firestore().collection("users").doc(currentUser.uid).collection("receipt");
    const products = ['Affirm Opti', 'Brevis', 'Chorus50', 'Coprantol Duo', 'Karate Zeon', 'Score 250EC', 'Switch', 'Thiovit Jet', 'Topas', 'Vertimec', 'Voliam Targo']
    

    // functie pentru adaugare de factura
    function addReceipt(e, product, price, quantity, month, currency, measureQuantity) {
        // parsam valoarea pretului(ar trebui si a cantitatii)
        var newPrice = parseFloat(price);
        var newQuantity = parseFloat(quantity);
        var ok = true;
        console.log("valuta este ", currency);
        console.log("Tipul campului pret este ", typeof newPrice);
        var errors = [];
        e.preventDefault();
        console.log(product, newPrice, quantity, month);
        if(currency === 'EUR')
        {
            newPrice = price * 4.897;
        }
        if(measureQuantity === 'g')
        {
            newQuantity = quantity * 0.0010000;
        }
        console.log(newPrice);

        if(product === '' || price === '' || quantity === '' || month === '')
        {
            errors.push("Trebuie sa specificati o valoare pentru fiecare camp");
            ok = false;
        }
        if(ok)
        {
            handleClose();
            refCurrentUser
            .add({
                product: product,
                price: newPrice, 
                quantity: newQuantity,
                month: month,
                year: year,
                currency: currency
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
          setTotalRrice(totalPriceLocal);
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
                                    <Form.Label><strong>Produs</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependProduct">
                                            <InputGroup.Text>
                                                <i class={`fa fa-product-hunt ${styles.icon}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control as="select" ref={product} aria-describedby="inputGroupPrependProduct"
                            required>
                                            {
                                                products.map((prd) => (
                                                    <option key={prd}>
                                                        {prd}
                                                    </option>
                                                ))
                                            }
                                        </Form.Control>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label><strong>Preț</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependPrice">
                                            <InputGroup.Text>
                                                <i className={`fa fa-money ${styles.icon}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control ref={price} type="number" placeholder="Pret..." min="1" aria-describedby="inputGroupPrependPrice"
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
                                    <Form.Label><strong>Cantitate achiziționată</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependQuantity">
                                            <InputGroup.Text>
                                                <i className={`fa fa-sort-amount-desc ${styles.icon}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control ref={quantity} type="number" placeholder="Cantitate..." min="1" aria-describedby="inputGroupPrependQuantity"
                            required/>
                                        <InputGroup.Prepend id="inputGroupPrependMeasureQ">
                                            <Form.Control as="select" ref={measureQuantity} aria-describedby="inputGroupPrependMeasureQ"
                            required>
                                                <option>kg</option>
                                                <option>g</option>
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
                                <div className="text-center">
                                    <Button className={styles.addProductButton}
                                        onClick={(e) => addReceipt(e, product.current.value, price.current.value, quantity.current.value, month.current.value, currency.current.value, measureQuantity.current.Value)}
                                    >
                                        Incarcă factura
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
                            <Button className={styles.pdfButton} onClick={e => generatePdfReceipt(e, rc, "substance")}><i className="fa fa-file-pdf-o" aria-hidden="true"></i></Button>
                       </Card.Footer>
                    </Card>
               ))
           }
        </div>
        
    )
}
