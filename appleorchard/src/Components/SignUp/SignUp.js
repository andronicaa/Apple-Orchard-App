import React, { useRef, useState } from 'react'
import { Form, Button, Alert, InputGroup, Modal } from 'react-bootstrap';
import Tooltip from "@material-ui/core/Tooltip";
import styles from "./Styles/SignUp.module.css";
import { useAuth } from '../../Firebase/context/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import temp_logo from "../../Imgs/temp_logo.png";

export function SignUp() {
  const refEmail = useRef();
  const refPassword = useRef();
  const refPasswordConfirm = useRef();
  const { currentUser, signup } = useAuth();
  const [error, setError] = useState([]);
  const[loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const history =  useHistory();

  function checkSpecialChar(pass) {
    var ok = false;
    if(pass.includes('!') || pass.includes('@') || pass.includes('#') || pass.includes('$') || pass.includes('%') || pass.includes('&') || pass.includes('*'))
      ok = true;

    return ok;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const errs = [];
    var ok = false;
    if(refPassword.current.value.length < 8 || refPasswordConfirm.current.value.length < 8)
    {
      errs.push("Parola trebuie să conțină cel puțin 8 caractere.\n");
      ok = true;
      
    }
    const regexAlph = /[a-zA-Z]/g;

    if(regexAlph.test(refPassword.current.value) == false || regexAlph.test(refPasswordConfirm.current.value) == false)
    {
      errs.push("Parola trebuie sa contina cel putin o litera.\n");
      ok = true;
    }

    const regexDigit = /\d/;
    if(regexDigit.test(refPassword.current.value) == false || regexDigit.test(refPasswordConfirm.current.value) == false)
    {
      errs.push("Parola trebuie sa contina cel putin o cifra.\n");
      ok = true;
    }

    if(checkSpecialChar(refPassword.current.value) == false)
    {
      errs.push("Parola trebuie sa contina cel putin un caracter special (!@#$%&)");
      ok = true;
    }
    if (refPassword.current.value !== refPasswordConfirm.current.value) {
      errs.push('Parolele nu corespund.\n');
      ok = true;
    }

    
    if(ok) 
    {
      setError(errs);
      return handleShow();
    }

    try {
      setError([]);
      setLoading(true);
      await signup(refEmail.current.value, refPassword.current.value);
      
      setTimeout(function(){
        history.push("/addprofile");
      }, 1500);
      
    }catch(err) {
      setLoading(false);
      alert(err.message);
    }
      setError(errs);

  }
  return (
    <div className={styles.loginPage}>
    <div className={styles.cardForm}>
      <h3 className="text-center">Măruleț</h3>
      <div className={`text-center ${styles.logoContainer}`}>
        <img src={temp_logo} className={styles.logo} alt="Logo temporar"/>
      </div>
      <div>
        <Modal show={show} onHide={handleClose}>
          {
              error.length ?
                error.map(p => (
                  <Alert variant="danger" severity="error">
                      {p}
                  </Alert>
                ))
              :
                  <div></div>
            }
        </Modal>
        {/* <h2 className="text-center mb-4">Sign Up</h2> */}
        
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
            <Form.Label>Parolă</Form.Label>
            <InputGroup>
              <InputGroup.Prepend id="inputGroupPrependPassword">
                <InputGroup.Text>
                  <i className={`fa fa-key ${styles.inputIcon}`} aria-hidden="true"></i>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Tooltip
                title={
                  <ul>
                    <li>Lungime minimă: 8 caractere</li>
                    <li>Cel puțin o cifră</li>
                    <li>Un caracter special (!@#$%)</li>
                  </ul>
                }
              >
                <Form.Control type="password" ref={refPassword} required  aria-describedby="inputGroupPrependPassword"/>
              </Tooltip>
            </InputGroup>
          </Form.Group>
          <Form.Group id="password-confirm">
            <Form.Label>Confirmare parolă</Form.Label>
            <InputGroup>
              <InputGroup.Prepend id="inputGroupPrependPasswordConf">
                <InputGroup.Text>
                  <i className={`fa fa-key ${styles.inputIcon}`} aria-hidden="true"></i>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Tooltip
                title={
                  <ul>
                    <li>Lungime minimă: 8 caractere</li>
                    <li>Cel puțin o cifră</li>
                    <li>Un caracter special (!@#$%)</li>
                  </ul>
                }
              >
                <Form.Control type="password" ref={refPasswordConfirm} required  aria-describedby="inputGroupPrependPasswordConf"/>
              </Tooltip>
            </InputGroup>
            
          </Form.Group>
          <Button disabled={loading} className="w-100 btn btn-success" type="submit">
            Autentificare
          </Button>
        </Form>
      </div>
      <div className="w-100 text-center mt-2">
        Ai deja cont?  <Link to="/neauth-home" className={styles.signUpLink}><strong>Conectare</strong></Link>
    </div>
    </div>
    </div>
  )
}

export default SignUp;
