import React, { useRef, useState } from 'react'
import { Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import styles from "./Styles/SignUp.module.css";
import { useAuth } from '../../Firebase/context/AuthContext';
import temp_logo from "../../Imgs/temp_logo.png";
import ForgotPassword from "./ForgotPassword";
import Modal from 'react-bootstrap/Modal';
import firebase from '../../Firebase/firebase';


export function Login() {
  const refEmail = useRef();
  const refPassword = useRef();
  const { login, signInWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const[loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [typed, setTyped] = useState('');
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const history = useHistory();
 

  function loginWithGoogle(e, typed) {
    setTyped(typed);
    handleSubmit(e);
  }
  function checkProfile() {
    const refProfile = firebase.firestore().collection("users").doc(currentUser.uid);
    refProfile.onSnapshot(doc => {
      const items = [];
      items.push(doc.data());
      return items.length == 0 ? false : true;
    }) 
    
}
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      console.log('Tipul de login este', typed);
      if(typed === 'normalLogin')
      {
        await login(refEmail.current.value, refPassword.current.value);
        // dupa ce un utilizator se inregistreaza sau se autentifica => va fi redirectionat catre pagina principala
        history.push("/");
      }
      else
      {
        console.log("Autentificare cu google");
        await signInWithGoogle();
      }
        
      
    } catch {
      setError("Autentificarea a eșuat.");
    }
    setLoading(false);
  }


  return (
    <div className={styles.cardForm}>
     <h3 className="text-center">Măruleț</h3>
      <div className={`text-center ${styles.logoContainer}`}>
        <img src={temp_logo} className={styles.logo} alt="Logo temporar"/>
      </div>
      <div className={styles.cardBody}>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group id="email">
            <Form.Label>Email</Form.Label>
            <InputGroup>
              <InputGroup.Prepend id="inputGroupPrependEmail">
                <InputGroup.Text>
                  <i className={`fa fa-envelope ${styles.inputIcon}`} aria-hidden="true"></i>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control type="email" ref={refEmail} required  aria-describedby="inputGroupPrependEmail"/>
            </InputGroup>
          </Form.Group>
          <Form.Group id="password">
            <Form.Label>Parola</Form.Label>
            <InputGroup>
              <InputGroup.Prepend id="inputGroupPrependPassword">
                <InputGroup.Text>
                  <i className={`fa fa-key ${styles.inputIcon}`} aria-hidden="true"></i>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control type="password" ref={refPassword} required  aria-describedby="inputGroupPrependPassword"/>
            </InputGroup>
            
          </Form.Group>
          <Button disabled={loading} className="w-100 btn btn-success" type="submit" onClick={(e) => setTyped('normalLogin')}>
            Conectare <i className="fa fa-sign-in" aria-hidden="true"></i>
          </Button>
        </Form>
        <Button disabled={loading} className={`w-100 ${styles.googleButton}`} onClick={(e) => loginWithGoogle(e, 'googleLogin')}><i className="fa fa-google"></i> Conectare cu Google</Button>
        <button type="link" onClick={handleShow} className={styles.forgotButton}>
          Ai uitat parola?
        </button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Resetare parolă</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ForgotPassword />
          </Modal.Body>
        </Modal>
      </div>
      <div className="w-100 text-center mt-2">
      <strong>Creează cont </strong><Link to="/signup" className={styles.signUpLink}><strong>Autentificare</strong></Link>
    </div>
    </div>
    
  )
}

export default Login;
