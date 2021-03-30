import React, { useState, useRef, useEffect } from 'react';
import styles from './Style/SubstanceReceipt.module.css';
import generalcss from './Style/GeneralOrchardCSS.module.css';
import firebase from "../../Firebase/firebase";
import { useAuth } from '../../Firebase/context/AuthContext';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';


export default function SubstanceReceipt() {
    const [totalPrice, setTotalRrice] = useState(0);
    const [errorMsg, setErrorMsg] = useState([]);
    const [products, setProducts] = useState([]);
    const { currentUser } = useAuth();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [receipts, setReceipts] = useState([]);
    const measureQuantity = useRef();
    const currency = useRef();
    const product = useRef();
    const price = useRef();
    const quantity = useRef();
    const month = useRef();
    const refCurrentUser = firebase.firestore().collection("users").doc(currentUser.uid).collection("receipt");
    const refProducts = firebase.firestore().collection("users").doc(currentUser.uid).collection("products");
    const months = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
    // functie pentru adaugare de factura
    function addReceipt(e, product, price, quantity, month, currency) {
        var errors = [];
        e.preventDefault();
        console.log(product, price, quantity, month);
        if (currency === 'EUR')
        {
            price = price * 4.897;
        }
        console.log(price);
        if (product === '' || price === '' || quantity === '' || month === '')
        {
            errors.push("Trebuie sa specificati o valoare pentru toate campurile");
            setErrorMsg(errors);
        }
        else
        {
            handleClose();
            refCurrentUser
            .add({
                product: product,
                price: price, 
                quantity: quantity,
                month: month
            })
            .catch((err) => {
                console.log(err);
            });
            setErrorMsg([]);
        }
        
    }

    function listReceipt() {
        refCurrentUser.onSnapshot((querySnapshot) => {
          const items = [];
          querySnapshot.forEach((doc) => {
            items.push(doc.data());
          });
          setReceipts(items);
        });
    }

    function getProducts() {
        refProducts.onSnapshot((querySnapshot) => {
            const prds = [];
            querySnapshot.forEach((doc) => {
                prds.push(doc.data());

            });
            setProducts(prds);
        });
    }

    function totalPriceOfSubstances() {
        var totalPriceLocal = 0;
        for(var prd in products)
        {
            totalPriceLocal += prd.price;
        }
        setTotalRrice(totalPriceLocal);
        console.log("Pretul total al substantelor este ", totalPrice);
    }

    useEffect(() => {
        console.log("Am intrat");
        getProducts();
        listReceipt();
        totalPriceOfSubstances();
    }, []);
    return (
        <div>
            <Card className={styles.receiptCard}>
                <Card.Body>
                    <Table>
                        <thead>
                            <tr>
                                <th>Produs</th>
                                <th>Pret</th>
                                <th>Cantitate</th>
                                <th>Luna achizitie</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                receipts.map((rec) => (
                                <tr key={rec}>
                                    <td>{rec.product}</td>
                                    <td>{rec.price}</td>
                                    <td>{rec.quantity}</td>
                                    <td>{rec.month}</td>
                                </tr>
                                ))
                            }
                        </tbody>
                    
                    </Table>
            
                <button className="btn btn-success" onClick={handleShow}><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;Adauga factura</button>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Body>
                        <div>
                            <h3 className={`text-center`}>Adauga factura</h3>
                            <form>
                                {errorMsg.length && <p>{errorMsg[0]}</p>}
                                <div className="form-group">
                                    <label for="lastname"><strong>Produs</strong></label>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            <i className={`fa fa-user`}></i>
                                        </span>
                                        <select className="form-control" ref={product}>
                                            {
                                                products.map((prd) => (
                                                    <option key={prd}>
                                                        {prd.product}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label for="firstname"><strong>Pret</strong></label>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            <i className={`fa fa-user`}></i>
                                        </span>
                                        <input ref={price} type="number" className="form-control" id="first-name-input" placeholder="Pret..."/>
                                        <span className="input-group-text">
                                            <select className={generalcss.selectValuta} ref={currency}>
                                                <option>RON</option>
                                                <option>EUR</option>
                                            </select>
                                        </span>
                                    </div>
                                    
                                </div>
                                <div className="form-group">
                                    <label for="firstname"><strong>Cantitate</strong></label>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            <i className={`fa fa-user`}></i>
                                        </span>
                                        <input ref={quantity} type="number" className="form-control" id="first-name-input" placeholder="Cantitate..."/>
                                        <span className="input-group-text">
                                            <select className={generalcss.selectValuta} ref={currency}>
                                                <option>kg</option>
                                                <option>g</option>
                                            </select>
                                        </span>
                                    </div>
                                    
                                </div>
                                <div className="form-group">
                                    <label for="firstname"><strong>Luna achizitie</strong></label>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            <i className={`fa fa-user`}></i>
                                        </span>
                                        <select className="form-control" ref={month}>
                                            {
                                                months.map((m) => (
                                                    <option key={m}>
                                                        {m}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    
                                </div>
                                <div className="text-center">
                                    <button className={`btn btn-success`}
                                        onClick={(e) => addReceipt(e, product.current.value, price.current.value, quantity.current.value, month.current.value, currency.current.value)}
                                    >
                                        Incarca factura
                                    </button>
                                </div>
                                <div>
                                    <p>{totalPrice}</p>
                                </div>
                            </form>
                        </div>
                    </Modal.Body>
                </Modal>
                </Card.Body>
                </Card>
        </div>
    )
}
