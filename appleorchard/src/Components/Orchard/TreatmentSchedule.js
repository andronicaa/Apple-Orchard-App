import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Card } from 'react-bootstrap';
import styles from './Style/TreatmentSchedule.module.css';
import { products } from './Utility/ProductsFeature';
import CustomModal from './CustomModal';
import { Link } from 'react-router-dom';


export default function TreatmentSchedule() {
    const [show, setShow] = useState(0);
    const update = () => setShow(0);
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
                        <td colSpan="2"><button className={styles.linkButton} onClick={() => setShow(1)}>Chorus 50</button>
                            <CustomModal canShow={show == 1} updateState={update} prd="Chorus50"/>
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
                        <td colSpan="2"><button className={styles.linkButton} onClick={() => setShow(18)}>Coprantol Duo</button>
                            <CustomModal canShow={show == 18} updateState={update} prd="CoprantolDuo"/>
                        </td>
                        <td colSpan="4"><button className={styles.linkButton} onClick={() => setShow(2)}>Score 250EC</button>
                            <CustomModal canShow={show == 2} updateState={update} prd="Score250"/>
                        </td>
                        <td></td>
                        <td></td>
                        <td><button className={styles.linkButton} onClick={() => setShow(3)}>Coprantol Duo</button>
                            <CustomModal canShow={show == 3} updateState={update} prd="CoprantolDuo"/>
                        </td>
                    </tr>
                   <tr>
                        <td id={styles["blueTheme"]}>Focul Bacterian</td>
                        <td colSpan="2"><button className={styles.linkButton} onClick={() => setShow(4)}>Coprantol Duo</button>
                            <CustomModal canShow={show == 4} updateState={update} prd="CoprantolDuo"/>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colSpan="2"><button className={styles.linkButton} onClick={() => setShow(5)}>Coprantol Duo</button>
                            <CustomModal canShow={show == 5} updateState={update} prd="CoprantolDuo"/>
                        </td>
                    </tr>
                    
                     <tr>
                        <td id={styles["blueTheme"]}>Fainare</td>
                        <td colSpan="2"><button className={styles.linkButton} onClick={() => setShow(6)}>ThiovitJet</button>
                            <CustomModal canShow={show == 6} updateState={update} prd="ThiovitJet"/>
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
                        <td colSpan="5"><button className={styles.linkButton} onClick={() => setShow(7)}>Topas</button>
                            <CustomModal canShow={show == 7} updateState={update} prd="Topas"/>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td id={styles["orangeTheme"]}>Molia cojilor</td>
                        <td></td>
                        <td><button className={styles.linkButton} onClick={() => setShow(8)}>Affirm Opti</button>
                            <CustomModal canShow={show == 8} updateState={update} prd="AffirmOpti"/>
                        </td>
                        <td></td>
                        <td colSpan="5"><button className={styles.linkButton} onClick={() => setShow(9)}>Affirm Opti</button>
                            <CustomModal canShow={show == 9} updateState={update} prd="AffirmOpti"/>
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <td rowSpan="2" id={styles["orangeTheme"]}>Acarieni</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colSpan="2"><button className={styles.linkButton} onClick={() => setShow(10)}>Voliam Targo</button>
                            <CustomModal canShow={show == 10} updateState={update} prd="VoliamTargo"/>
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
                        <td colSpan="2"><button className={styles.linkButton} onClick={() => setShow(11)}>Vertimec</button>
                            <CustomModal canShow={show == 11} updateState={update} prd="Vertimec"/>
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
                        <td colSpan="2"><button className={styles.linkButton} onClick={() => setShow(12)}>Voliam Targo</button>
                            <CustomModal canShow={show == 12} updateState={update} prd="VoliamTargo"/>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><button className={styles.linkButton} onClick={() => setShow(13)}>Karate Zeon</button>
                            <CustomModal canShow={show == 13} updateState={update} prd="KarateZeon"/>
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
                        <td><button className={styles.linkButton} onClick={() => setShow(14)}>Karate Zeon</button>
                            <CustomModal canShow={show == 14} updateState={update} prd="KarateZeon"/>
                        </td>
                        <td></td>
                        <td colSpan="5"></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colSpan="4"><button className={styles.linkButton} onClick={() => setShow(15)}>Voliam Targo</button>
                            <CustomModal canShow={show == 15} updateState={update} prd="VoliamTargo"/>
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
                        <td><button className={styles.linkButton} onClick={() => setShow(16)}>Switch</button>
                            <CustomModal canShow={show == 16} updateState={update} prd="Switch"/>
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <td id={styles["pinkTheme"]}>Rarit chimic</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><button className={styles.linkButton} onClick={() => setShow(17)}>Brevis</button>
                            <CustomModal canShow={show == 17} updateState={update} prd="Brevis"/>
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
