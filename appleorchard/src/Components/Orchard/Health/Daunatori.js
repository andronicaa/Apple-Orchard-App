import React from 'react';
import Card from 'react-bootstrap/Card';
import daunatori from "../../../Imgs/daunatori_1.jpg";
import styles from "./Style/Daunatori.module.css";
import OrchardMenu from '../OrchardMenu';
import { ListGroup, ListGroupItem } from 'react-bootstrap';




export default function Daunatori() {

    return (
        <>
        <OrchardMenu />
        <div className={styles.mainCard}>
            <Card>
                <Card.Header className={styles.cardHeader}>
                    Bolile marului - prezentare
                </Card.Header>
                <Card.Img variant="top" src={daunatori} className={styles.imgCard}/>
                <Card.Body>
                    <ListGroup>
                        <ListGroup.Item>
                            <strong>Rapanul </strong>
                            este cea mai raspandita si periculoasa boala a marului. Aceasta poate sa compromita intreaba productie daca nu este tratata corespunzator. Se dezvolta pe ramuri tinere, frunze, flori si cel mai intalnit chiar pe fruct. In stadiu incipient, pe frunze apar pete circulare rosiatice. 
                            Fructele pot fi atacate incepand de la formare pana la maturare. Daca acestea sunt afectata inca dintr-o faza tanara, raman slab dezvoltate si prezinta crapaturi.
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Fainarea </strong>
                            apare in special primavara. Florile, frunzele, lastarii si fructele tinere atacate sunt acoperite de o pasla albicioasa, care ulterior devine galbuie. 
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Focul bacterian al rozaceelor </strong>
                            apare pe toate organele verzi ale plantei sub forma de brunificari. 
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Cancerul ramurilor </strong>
                            se manifesta prin aparitia de rani uscate ale scoartei localizate pe trunchi si sarpante. Ciuperca provine din rani produse de grindina sau de catre mijloace mecanica, apo in conditii de umiditate se dezvolta si apare fenomenul de uscare a portiunii infectate. 
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Putrezirea coletului </strong>
                            apare in zonele mai umede la pomii altoiti pe partaltoiul MM 106.
                        </ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>
        </div>
        </>
    )
}
