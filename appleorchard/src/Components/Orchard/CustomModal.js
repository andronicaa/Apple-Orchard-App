import React from 'react';
import styles from './Style/CustomModal.module.css';
import Backdrop from './Backdrop';
export default function CustomModal(props) {
    console.log(props.show); 
    console.log(props.nume);
    return (
        <>
        <Backdrop show={props.show} clicked={props.close} />
        <div className={styles.mainContainer}
            style={{
                transform: props.show ? "translateY(0)" : "translateY(-100vh)",
                opacity: props.show ? 1 : 0
            }}
        >
            <p>Buna ziua</p>
        </div>
        </>
    )
}
