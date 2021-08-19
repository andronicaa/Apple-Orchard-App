import React, { useState, useEffect, useRef } from 'react';
import styles from './Styles/NotFound.module.css';
import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

export default function NotFoundPage() {
    var timeLimit = 10;

    const [redirect, setRedirect] = useState(false);
    const [timer, setTimer] = useState(timeLimit);

    const interval = useRef(null);
    const intervalIsSet = useRef(false);

    function decreaseCount() {
        console.log(timer);
        setTimer((prevTimer) => prevTimer - 1);
    }

    useEffect(() => {
        if (!intervalIsSet.current) {
        console.log("setinterval");
        intervalIsSet.current = true;
        interval.current = setInterval(decreaseCount, 1000);
        }
        return function cleanup() {
        console.log("clearinterval");
        clearInterval(interval.current);
        intervalIsSet.current = false;
        };
    }, []);

    useEffect(() => {
        console.log(timer);

        if (timer === 0) {
        console.log("redirect true");
        setRedirect(true);
        }
    }, [timer]);

    const renderRedirect = () => {
        if (redirect) {
        return <Redirect to="/" />;
        }
    };


    return (
        <Row className={styles.mainContainer}>
             {renderRedirect()}
            <Col lg={4} className={styles.col} />
            <Col lg={4} xs={12} className={styles.textCol}>
                <p className={styles.text}>Te-ai rătăcit?</p>
                <Link to="/"><Button variant="danger" className={styles.homeButton}>Du-mă acasă</Button></Link>
                <p><strong>Vei fi redirectionat catre pagina principala in {timer}</strong></p>
            </Col>
            <Col lg={4} className={styles.col} />
        </Row>
    )
}
