import React, { useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import styles from './Style/TreatmentSchedule.module.css';
import { products } from './Utility/ProductFeature';


export default function TreatmentSchedule() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [p, setPrd] = useState({});
    const handleShow = (e, prd) => {
        e.preventDefault();
        setPrd(prd);
        console.log('Produsul este ', p);
        setShow(true);
        
    };
    function afiseazaProduse() {
        products["CoprantolDuo"].actiune.map((act) => {
            console.log(act);
        })
    }
    function checkEmptyObject(p) {
        for(var i in products[p])
            return false;
        return true;
    }
    return (
        <div className={styles.mainContainer}>
            <Button onClick={afiseazaProduse}>Programeaza tratament</Button>
            <Modal show={show} onHide={handleClose}>
                {
                    (checkEmptyObject(products[p]) == true) ? (
                        <div>
                            <Modal.Header>
                                <Modal.Title>{products[p].nume}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p><strong>Substanta activa: </strong>{products[p].subst_activ}</p>
                                <p><strong>Tip produs: </strong>{products[p].tip_produs}</p>
                                <p><strong>Depozitare: </strong>{products[p].depozitare}</p>
                                <span><strong>Actiune: </strong></span>
                                <ul>
                                    {
                                       products[p].actiune.map((act) => (
                                           <li>{act}</li>
                                       ))
                                   }
                                </ul>
                                   
                                
                                <p><strong>Numar maxim tratamente: </strong>{products[p].nr_max_trat}</p>
                                <p><strong>Dozaj: </strong>{products[p].dozaj}</p>
                                <p><strong>Volum apa: </strong>{products[p].vol_apa}</p>
                                <p><strong>Timp pauza: </strong>{products[p].timp_pauza} zile</p>
                                <p><strong>Recomandari: </strong>{products[p].recomandari}</p>
                                <p><strong>Preparare: </strong>{products[p].prepararea}</p>
                            </Modal.Body>
                        </div>
                            
                        
                    ) : (
                        <div>DAAA</div>
                    )
                }
                </Modal>
            
            <Table striped bordered hover className={styles.treatmentTable}>
                <thead>
                    <tr>
                        <th>Stadiul de dezvoltare<br/>Problema</th>
                        <th>Urechiuse</th>
                        <th>Infrunzit</th>
                        <th>Inflorit</th>
                        <th>Scuturarea petalelor</th>
                        <th>Fruct 2cm</th>
                        <th>Fruct 1/2</th>
                        <th>Fruct 3/4</th>
                        <th>Maturitate</th>
                        <th>Caderea frunzelor</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td rowSpan="2" id={styles["blueTheme"]}>Rapan</td>
                        <td colSpan="2"><button className={styles.linkButton} onClick={(e) => handleShow(e, "Chorus50")}>Chorus 50</button>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colSpan="2"><button className={styles.linkButton} onclick={(e) => handleShow(e, "CoprantolDuo")}>Coprantol Duo</button></td>
                        <td colSpan="4"><button className={styles.linkButton} onClick={(e) => handleShow(e, "Score250")}>Score 250EC</button></td>
                        <td></td>
                        <td></td>
                        <td><button className={styles.linkButton} onclick={(e) => handleShow(e, "CoprantolDuo")}>Coprantol Duo</button></td>
                    </tr>
                    <tr>
                        <td id={styles["blueTheme"]}>Focul Bacterian</td>
                        <td colSpan="2"><button className={styles.linkButton} onClick={(e) => handleShow(e, "CoprantolDuo")}>Coprantol Duo</button></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><button className={styles.linkButton} onClick={(e) => handleShow(e, "CoprantolDuo")}>Coprantol Duo</button></td>
                    </tr>
                    <tr>
                        <td id={styles["blueTheme"]}>Fainare</td>
                        <td colSpan="2"><button className={styles.linkButton} onClick={(e) => handleShow(e, "ThiovitJet")}>ThiovitJet</button></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>

                    <tr>
                        <td id={styles["blueTheme"]}></td>
                        <td></td>
                        <td colSpan="5"><button className={styles.linkButton} onClick={(e) => handleShow(e, "Topas100EC")}>Topas</button></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td id={styles["orangeTheme"]}>Molia cojilor</td>
                        <td></td>
                        <td><button className={styles.linkButton} onClick={(e) => handleShow(e, "AffirmOpti")}>Affirm Opti</button></td>
                        <td></td>
                        <td colSpan="5"><button className={styles.linkButton} onClick={(e) => handleShow(e, "AffirmOpti")}>Affirm Opti</button></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td rowSpan="2" id={styles["orangeTheme"]}>Acarieni</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colSpan="2"><button className={styles.linkButton} onClick={(e) => handleShow(e, "VoliamTargo")}>Voliam Targo</button></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colSpan="2"><button className={styles.linkButton} onClick={(e) => handleShow(e, "Vertimec")}>Vertimec</button></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td rowSpan="2" id={styles["orangeTheme"]}>Insecte minatoare</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colSpan="2"><button className={styles.linkButton} onClick={(e) => handleShow(e, "VoliamTargo")}>Voliam Targo</button></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>Karate Zeon</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>    
                    </tr>
                    <tr>
                        <td rowSpan="2" id={styles["orangeTheme"]}>Virmele merelor</td>
                        <td></td>
                        <td>Karate Zeon</td>
                        <td></td>
                        <td colSpan="5"></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colSpan="4"><button className={styles.linkButton} onClick={(e) => handleShow(e, "VoliamTargo")}>Voliam Targo</button></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td id={styles["blueTheme"]}>Boli de depozitare</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Switch</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td id={styles["pinkTheme"]}>Rarit chimic</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Brevis</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}
