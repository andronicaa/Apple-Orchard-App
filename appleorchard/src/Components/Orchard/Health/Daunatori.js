import React from 'react';
import Card from 'react-bootstrap/Card';
import daunatori from "../../../Imgs/daunatori_1.jpg";
import styles from "./Style/Daunatori.module.css";
import OrchardMenu from '../OrchardMenu';




export default function Daunatori() {
    return (
        <>
        <OrchardMenu />
        <div className={styles.mainCard}>
            <Card>
                <Card.Img variant="top" src={daunatori} className={styles.imgCard}/>
                <Card.Body>
                    Buna ziua
                </Card.Body>
            </Card>
        </div>
        </>
    )
}
