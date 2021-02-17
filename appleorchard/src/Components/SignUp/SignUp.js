import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap';
import styles from "./Styles/SignUp.module.css";
import { useAuth } from '../../context/AuthContext';
import { Link, useHistory } from 'react-router-dom';


export function SignUp() {
  const refEmail = useRef();
  const refPassword = useRef();
  const refPasswordConfirm = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const[loading, setLoading] = useState(false);
  const history=  useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (refPassword.current.value !== refPasswordConfirm.current.value) {
      return setError('Parolele nu sunt la fel');
    }
    // console.log(refPasswordConfirm.current.value);
    // console.log(refPassword.current.value);
    try {
      setError('');
      setLoading(true);
      await signup(refEmail.current.value, refPassword.current.value);
      history.push("/");
    } catch {
      setError("Failed to create an account");
    }
    setLoading(false);
  }
  return (
    <>
    <Card className={styles.cardForm}>
      <Card.Body>
        <h2 className="text-center mb-4">Sign Up</h2>
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
          <Form.Group id="password-confirm">
            <Form.Label>Password Confirmation</Form.Label>
            <Form.Control type="password" ref={refPasswordConfirm} required />
          </Form.Group>
          <Button disabled={loading} className="w-100" type="submit">
            Sign Up
          </Button>
        </Form>
      </Card.Body>
      <div className="w-100 text-center mt-2">
      Already have an account?  <Link to="/login">Login</Link>
    </div>
    </Card>
    
    </>
  )
}

export default SignUp;
