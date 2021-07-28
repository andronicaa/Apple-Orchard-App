import React from 'react';
import styles from './Style/CustomModal.module.css';
import { products } from './Utility/ProductsFeature';
import { Button } from 'react-bootstrap';

const CustomModal = ({ canShow, updateState, prd }) => {
    if(canShow) {
        console.log(prd);
        console.log(canShow);
        return (
            <div className={`${styles.modalContainer} card`}>
                <div className="d-flex flex-row justify-content-between">
                    <h5>{products[prd].nume}</h5>
                    <Button onClick={updateState} variant="danger">X</Button>
                </div>
                <div>
                    <p><strong>Substanta activa: </strong>{products[prd].subst_activ}</p>
                    <p><strong>Tip produs: </strong>{products[prd].tip_produs}</p>
                    <p><strong>Nr. maxim tratamente: </strong>{products[prd].nr_max_trat}</p>
                    <p><strong>Doza: </strong>{products[prd].dozaj}</p>
                    <p><strong>Volum apa: </strong>{products[prd].vol_apa}</p>
                    <p><strong>Recomandari: </strong>{products[prd].recomandari}</p>
                </div>
            </div>
        );
    }
    return null;
};

export default CustomModal;
