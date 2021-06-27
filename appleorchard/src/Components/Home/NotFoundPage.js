import React from 'react';
import styles from './Styles/NotFound.module.css';
import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <Row className={styles.mainContainer}>
            <Col lg={4} className={styles.col} />
            <Col lg={4} className="text-center">
                <p className={styles.text}>Te-ai rătăcit?</p>
                <Link to="/"><Button variant="danger">Acasă</Button></Link>
            </Col>
            <Col lg={4} className={styles.col} />
        </Row>
    )
}
