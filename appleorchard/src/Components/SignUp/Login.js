import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import styles from "./Styles/SignUp.module.css";
import { useAuth } from '../../context/AuthContext';
import HeaderNeauth from '../Header/HeaderNeauth';


export function Login() {
  const refEmail = useRef();
  const refPassword = useRef();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const[loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(refEmail.current.value, refPassword.current.value);
        // dupa ce un utilizator se inregistreaza sau se autentifica => va fi redirectionat catre pagina principala
      history.push("/");
    } catch {
      setError("Failed to login");
    }
    setLoading(false);
  }
  return (
    <>
    <HeaderNeauth />
    <Card className={styles.cardForm}>
      <Card.Body>
        <h2 className="text-center mb-4">Log In</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group id="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" ref={refEmail} required />
          </Form.Group>
          <Form.Group id="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" ref={refPassword} required />
          </Form.Group>
          <Button disabled={loading} className="w-100" type="submit">
            Log In
          </Button>
        </Form>
        <div className="w-100 text-center mt-3">
            <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </Card.Body>
      <div className="w-100 text-center mt-2">
      <strong>Need an account? </strong><Link to="/signup"><strong>Sign Up</strong></Link>
    </div>
    </Card>
    
    </>
  )
}

export default Login;
