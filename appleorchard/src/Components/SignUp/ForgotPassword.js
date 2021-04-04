import React, { useRef, useState } from 'react';
import styles from "./Styles/ForgotPassword.module.css";
import { Form, Button, Card, Alert, InputGroup } from 'react-bootstrap';
import { useAuth } from '../../Firebase/context/AuthContext';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    const refEmail = useRef();
    const { resetPassword } = useAuth();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
    
        try {
          setMessage("");
          setError("");
          setLoading(true);
          await resetPassword(refEmail.current.value);
          setMessage("Check your inbox for further instructions");
        } catch {
          setError("Failed to reset password");
        }
    
        setLoading(false);
      }

    return (
        <>
      <Card>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
          <Form.Group id="email">
            <Form.Label>Email</Form.Label>
            <InputGroup>
              <InputGroup.Prepend id="inputGroupPrependEmail">
                <InputGroup.Text>
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control type="email" ref={refEmail} required  aria-describedby="inputGroupPrependEmail"/>
            </InputGroup>
            
          </Form.Group>
            <Button disabled={loading} className={`w-100 ${styles.resetButton}`} type="submit">
              Reseteaza parola
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/login" className={styles.loginLink}><strong>Login</strong></Link>
          </div>
        </Card.Body>
      </Card>
    </>
    )
}
