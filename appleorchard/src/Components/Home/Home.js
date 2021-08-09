import React, { useEffect } from 'react'
import styles from "./Styles/Home.module.css";
import { Button } from 'react-bootstrap';
import Login from '../SignUp/Login';

export default function Home() {
    useEffect(() => {
    }, [window.screen.width])
    return (
        <>
        
        <div className={styles.pageContainer}>
            {/* <div className={styles.titleContainer}>
                <p>Marulet</p>
            </div> */}
            <Login className={styles.loginContainer}/>
            
            
            
                <div className={styles.descriptionContainer}>
                    <div className={styles.textItem}>
                        <h4 className={styles.text}>Împreună pentru agricultură și comunitate</h4>
                        <div className={styles.buttonsItem}>
                            <Button className={styles.growerButton}>Cultivator</Button>
                            <Button className={styles.employeeButton}>Angajat</Button>
                        </div>
                    </div>

                </div>
           
           <div>
               
           </div>
            
        </div>
        </>
    )
}
