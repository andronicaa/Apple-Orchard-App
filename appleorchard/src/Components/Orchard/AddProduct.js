import React, { useRef, useState } from 'react';
import firebase from "../../Firebase/firebase";
import { useAuth } from '../../Firebase/context/AuthContext';
import styles from './Style/AddProduct.module.css';
import { InputGroup, Form, Button, Alert } from 'react-bootstrap';




export default function AddProduct() {
    const [validated, setValidated] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const { currentUser } = useAuth();
    const productName = useRef();
    const action = useRef();
    const dose = useRef();
    const measureQuantity = useRef();
    const measureArea = useRef();
    const refProduct = firebase.firestore().collection("users").doc(currentUser.uid).collection("products");

    const addProduct = (e, product, action, dose, quantity, area) => {

        e.preventDefault();
        var errors = '';
        console.log(quantity, area);
        if (product === '' || action === '' || dose === '')
        {
            errors += "Trebuie sa specificati o valoare pentru toate campurile\n";
        }
        else
        {
            refProduct
            .add({
                product: product,
                action: action,
                dose: parseFloat(dose)
            })
            .catch((err) => {
                console.log(err);
            });
            setErrorMsg([]);
        }
        setErrorMsg(errors);
        
    }
    return (
        <div>
            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
            <Form onSubmit={(e) => addProduct(e, productName.current.value, action.current.value, dose.current.value, measureQuantity.current.value, measureArea.current.value)}>
                <Form.Group>
                    <Form.Label><strong>Nume produs</strong></Form.Label>
                    <InputGroup>
                        <InputGroup.Prepend id="inputGroupPrependProduct">
                            <InputGroup.Text>
                                <i className={`fa fa-user`} aria-hidden="true" />
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control 
                            ref={productName}
                            type="text"
                            placeholder="Nume produs"
                            aria-describedby="inputGroupPrependProduct"
                            required
                        />
                    </InputGroup>
                </Form.Group>
                <Form.Group>
                    <Form.Label><strong>Combatere</strong></Form.Label>
                    <InputGroup>
                        <InputGroup.Prepend id="inputGroupPrependAction">
                            <InputGroup.Text>
                                <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control 
                            ref={action}
                            type="text"
                            placeholder="Combatere"
                            aria-describedby="inputGroupPrependAction"
                            required
                        />
                    </InputGroup>
                </Form.Group>
                <Form.Group>
                    <Form.Label><strong>Doza</strong></Form.Label>
                    <InputGroup>
                        <InputGroup.Prepend id="inputGroupPrependDose">
                            <InputGroup.Text>
                                <i className="fa fa-sort-amount-asc" aria-hidden="true"></i>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control 
                            ref={dose}
                            type="number"
                            placeholder="Doza"
                            aria-describedby="inputGroupPrependDose"
                            required
                        />
                        <Form.Control as="select" ref={measureQuantity}>
                            <option>kg</option>
                            <option>g</option>
                        </Form.Control>
                        <Form.Control as="select" ref={measureArea}>
                            <option>ha</option>
                            <option>mp</option>
                        </Form.Control>
                    </InputGroup>
                </Form.Group>
                <div className="text-center">
                    <Button type="submit" className="btn btn-success">Adauga produs</Button>
                </div>
            </Form>
        </div>
    )
}
