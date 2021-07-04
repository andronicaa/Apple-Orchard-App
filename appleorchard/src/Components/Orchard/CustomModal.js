import React from 'react';
import styles from './Style/CustomModal.module.css';
import { products } from './Utility/ProductsFeature';
import { Card } from 'react-bootstrap';

const CustomModal = ({ canShow, updateState, prd }) => {
    if(canShow) {
        console.log(prd);
        console.log(canShow);
        return (
            <div className={styles.modalContainer}>
                <p>{products[prd].nume}</p>
                <button onClick={updateState}>X</button>
            </div>
        );
    }
    return null;
};

export default CustomModal;
