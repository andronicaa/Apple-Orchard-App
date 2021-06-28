import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Card } from 'react-bootstrap';
import styles from './Style/TreatmentSchedule.module.css';
import { products } from './Utility/ProductsFeature';
import CustomModal from './CustomModal';
import { Link } from 'react-router-dom';


export default function TreatmentSchedule() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false); 
    const handleShow = (e) => {
        e.preventDefault();
        setShow(true);
    }

    return (
        <div className={styles.mainContainer}>
            <Button>Programeaza tratament</Button>            
            <Table bordered className={styles.treatmentTable}>
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
                        <td colSpan="2"><button className={styles.linkButton} onClick={handleShow}>Chorus 50</button>
                            <CustomModal show={show} nume="Chorus50" />
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
                        <td colSpan="2"><Link>Coprantol Duo</Link>
                           
                        </td>
                        <td colSpan="4"><button className={styles.linkButton} onClick={handleShow}>Score 250EC</button>
                           
                        </td>
                        <td></td>
                        <td></td>
                        <td><button className={styles.linkButton} onClick={handleShow}>Coprantol Duo</button>
                            
                        </td>
                    </tr>
                   <tr>
                        <td id={styles["blueTheme"]}>Focul Bacterian</td>
                        <td colSpan="2"><button className={styles.linkButton}>Coprantol Duo</button></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><button className={styles.linkButton} >Coprantol Duo</button></td>
                    </tr>
                    <tr>
                        <td id={styles["blueTheme"]}>Fainare</td>
                        <td colSpan="2"><button className={styles.linkButton} onClick={handleShow}>ThiovitJet</button>
                            
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
                        <td id={styles["blueTheme"]}></td>
                        <td></td>
                        <td colSpan="5"><button className={styles.linkButton} onClick={handleShow}>Topas</button>
                            
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td id={styles["orangeTheme"]}>Molia cojilor</td>
                        <td></td>
                        <td><button className={styles.linkButton} onClick={handleShow}>Affirm Opti</button>
                           
                        </td>
                        <td></td>
                        <td colSpan="5"><button className={styles.linkButton} onClick={handleShow}>Affirm Opti</button>
                           
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <td rowSpan="2" id={styles["orangeTheme"]}>Acarieni</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colSpan="2"><button className={styles.linkButton} onClick={handleShow}>Voliam Targo</button>
                         
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colSpan="2"><button className={styles.linkButton} onClick={handleShow}>Vertimec</button>
                            
                        </td>
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
                        <td colSpan="2"><button className={styles.linkButton} onClick={handleShow}>Voliam Targo</button>
                           
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><button className={styles.linkButton} onClick={handleShow}>Karate Zeon</button>
                           
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
                        <td rowSpan="2" id={styles["orangeTheme"]}>Virmele merelor</td>
                        <td></td>
                        <td><button className={styles.linkButton} onClick={handleShow}>Karate Zeon</button>
                           
                        </td>
                        <td></td>
                        <td colSpan="5"></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colSpan="4"><button className={styles.linkButton} onClick={handleShow}>Voliam Targo</button>
                            
                        </td>
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
                        <td><button className={styles.linkButton} onClick={handleShow}>Switch</button>
                           
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <td id={styles["pinkTheme"]}>Rarit chimic</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><button className={styles.linkButton} onClick={handleShow}>Brevis</button>
                           
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}
