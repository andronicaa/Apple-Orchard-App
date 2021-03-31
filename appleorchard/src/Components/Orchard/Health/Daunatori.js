import React from 'react';
import Card from 'react-bootstrap/Card';
import daunatori from "../../../Imgs/daunatori_1.jpg";
import styles from "./Style/Daunatori.module.css";




export default function Daunatori() {
    return (
        <div className={styles.mainCard}>
            <Card>
                <Card.Img variant="top" src={daunatori} className={styles.imgCard}/>
                <Card.Body>
                    Buna ziua
                </Card.Body>
            </Card>
        </div>
    )
}
