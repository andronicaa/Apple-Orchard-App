import React, { useRef, useState } from 'react';
import firebase from "../../Firebase/firebase";
import { useAuth } from '../../Firebase/context/AuthContext';
import styles from './Style/AddProduct.module.css';




export default function AddProduct() {
    const [errorMsg, setErrorMsg] = useState([]);
    const { currentUser } = useAuth();
    const productName = useRef();
    const action = useRef();
    const dose = useRef();
    const measureQuantity = useRef();
    const measureArea = useRef();
    const refProduct = firebase.firestore().collection("users").doc(currentUser.uid).collection("products");

    function addProduct(e, product, action, dose, quantity, area) {
        var errors = [];
        e.preventDefault();
        console.log(quantity, area);
        if (product === '' || action === '' || dose === '')
        {
            errors.push("Trebuie sa specificati o valoare pentru toate campurile");
            setErrorMsg(errors);
        }
        else
        {
            refProduct
            .add({
                product: product,
                action: action,
                dose: dose
            })
            .catch((err) => {
                console.log(err);
            });
            setErrorMsg([]);
        }
        
    }
    return (
        <div>
            <h3 className={`text-center`}>Adauga produs</h3>
            <form>
                <div className="form-group">
                    <label for="lastname"><strong>Nume produs</strong></label>
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <i className={`fa fa-user`}></i>
                        </span>
                        <input  ref={productName}
                        type="text" className="form-control" id="first-name-input" placeholder="Nume produs..."/>
                    </div>
                </div>
                <div className="form-group">
                    <label for="firstname"><strong>Combatere</strong></label>
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <i className={`fa fa-user`}></i>
                        </span>
                        <input ref={action} type="text" className="form-control" id="first-name-input" placeholder="Action..."/>
                    </div>
                </div>
                <div className="form-group">
                    <label for="firstname"><strong>Dozaj</strong></label>
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <i className={`fa fa-user`}></i>
                        </span>
                        <input ref={dose} type="text" className="form-control" id="first-name-input" placeholder="Doza..."/>
                        <span className="input-group-text">
                            <select className={styles.selectValuta} ref={measureQuantity}>
                                <option>kg</option>
                                <option>g</option>
                            </select>
                        </span>
                        <span className="input-group-text">
                            <select className={styles.selectValuta} ref={measureArea}>
                                <option>ha</option>
                                <option>mp</option>
                            </select>
                        </span>
                    </div>
                </div>
                <div className="text-center">
                    <button className={`btn btn-success`}
                        onClick={(e) => addProduct(e, productName.current.value, action.current.value, dose.current.value, measureQuantity.current.value, measureArea.current.value)}
                    >
                        Adauga
                    </button>
                </div>
            </form>
        </div>
    )
}
