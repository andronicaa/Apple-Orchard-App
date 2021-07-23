import React, { useEffect } from 'react'
import styles from "./Styles/Home.module.css";
import NeauthHeader from '../Header/NeauthHeader';
import logo from "../../Imgs/temp_logo.png";
import about from "../../Imgs/about_img.jpg";
import neauth_home from '../../Imgs/new_neauth_home.jpg';
import about_footer from "../../Imgs/img_footer.jpg";
import home from '../../Imgs/home.jpg';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import Login from '../SignUp/Login';

export default function Home() {
    useEffect(() => {
    }, [window.screen.width])
    return (
        <div className={styles.pageContainer}>
            {
                console.log(window.screen.width)
            }
            {
                window.screen.width > 773 ?
                (
                    <>
                        <Login />
                        <NeauthHeader className={styles.header}/>
                    </>
                )
                :
                (
                    <>
                        <NeauthHeader className={styles.header}/>
                        <Login />
                    </>
                )
            }
            
            <div className={styles.mainContainer}>
                <div className={styles.descriptionContainer}>
                    <div className={styles.textItem}>
                        <h4 className={styles.text}>Împreună pentru agricultură și comunitate</h4>
                        <div className={styles.buttonsItem}>
                            <Button className={styles.growerButton}>Cultivator</Button>
                            <Button className={styles.employeeButton}>Angajat</Button>
                        </div>
                    </div>

                </div>
            </div>
           
            
        </div>
    
    )
}
