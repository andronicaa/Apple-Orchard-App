import React from 'react';
import styles from './Style/CustomModal.module.css';
import { products } from './Utility/ProductsFeature';
import { Button } from 'react-bootstrap';

const CustomModal = ({ canShow, updateState, prd }) => {
    if(canShow) {
        console.log(prd);
        console.log(canShow);
        return (
            <div className={styles.modalContainer}>
                <div className="d-flex flex-row justify-content-between">
                    <p>{products[prd].nume}</p>
                    <Button onClick={updateState} variant="danger">X</Button>
                </div>
                
            </div>
        );
    }
    return null;
};

export default CustomModal;
