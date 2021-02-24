import React, { useRef, useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap';
import styles from "./Styles/SignUp.module.css";
import { useAuth } from '../../context/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import temp_logo from "../../Imgs/temp_logo.png";

export function SignUp() {
  const refEmail = useRef();
  const refPassword = useRef();
  const refPasswordConfirm = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const[loading, setLoading] = useState(false);
  const history =  useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (refPassword.current.value !== refPasswordConfirm.current.value) {
      return setError('Parolele nu sunt la fel');
    }


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
    <div className={styles.cardForm}>
      <h3 className="text-center">Măruleț</h3>
      <div className={`text-center ${styles.logoContainer}`}>
        <img src={temp_logo} className={styles.logo} alt="Logo temporar"/>
      </div>
      <div>
        {/* <h2 className="text-center mb-4">Sign Up</h2> */}
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
          <Button disabled={loading} className="w-100 btn btn-success" type="submit">
            Sign Up
          </Button>
        </Form>
      </div>
      <div className="w-100 text-center mt-2">
      Already have an account?  <Link to="/login"><strong>Log In</strong></Link>
    </div>
    </div>
    </>
  )
}

export default SignUp;
