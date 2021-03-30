import React, { useRef, useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import styles from "./Styles/SignUp.module.css";
import { useAuth } from '../../Firebase/context/AuthContext';
import 'font-awesome/css/font-awesome.min.css';
import temp_logo from "../../Imgs/temp_logo.png";
import ForgotPassword from "./ForgotPassword";
import Modal from 'react-bootstrap/Modal';

export function Login() {
  const refEmail = useRef();
  const refPassword = useRef();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const[loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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
    <div className={styles.loginPage}>
    <div className={styles.cardForm}>
     <h3 className="text-center">Măruleț</h3>
      <div className={`text-center ${styles.logoContainer}`}>
        <img src={temp_logo} className={styles.logo} alt="Logo temporar"/>
      </div>
      <div className={styles.cardBody}>
        {/* <h2 className="text-center mb-4">Log In</h2> */}
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
          <Button disabled={loading} className="w-100 btn btn-success" type="submit">
            Log In
          </Button>
          <Button className={`w-100 ${styles.googleButton}`}><i class="fa fa-google"></i> Login with Google</Button>
        </Form>
        <button type="link" onClick={handleShow} className={styles.forgotButton}>
          Forgot password?
        </button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Forgot password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ForgotPassword />
          </Modal.Body>
        </Modal>
      </div>
      <div className="w-100 text-center mt-2">
      <strong>Need an account? </strong><Link to="/signup"><strong>Sign Up</strong></Link>
    </div>
    </div>
    
    </div>
  )
}

export default Login;
