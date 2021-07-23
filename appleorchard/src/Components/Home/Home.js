import React from 'react'
import styles from "./Styles/Home.module.css";
import NeauthHeader from '../Header/NeauthHeader';
import logo from "../../Imgs/temp_logo.png";
import about from "../../Imgs/about_img.jpg";
import neauth_home from '../../Imgs/new_neauth_home.jpg';
import about_footer from "../../Imgs/img_footer.jpg";
import home from '../../Imgs/home.jpg';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';

export default function Home() {
    return (
        <>
            <div className={styles.mainContainer}>
                <NeauthHeader />
                <div className={`${styles.anchorContainer} text-center`}>
                    <a href="#About"><i className={`fa fa-arrow-down ${styles.arrow}`} aria-hidden="true"></i></a>
                </div>
                <Row className={styles.rowContainer}>
                   <Col lg={4} className={styles.textCol}>
                       
                       <div className={styles.buttonsContainer}>
                            <p className={styles.describe}>Ana are mere</p>
                        <div className={` d-flex flex-row justify-content-around`}>
                            <Button className={styles.growerButton}>Cultivator</Button>
                            <Button className={styles.employeeButton}>Angajat</Button>
                        </div>
                       </div>
                   </Col>
                   <Col lg={8} className={styles.col}>
                       <img src={neauth_home} className={styles.princImg} alt="Imagine pentru pagina de home"/>
                   </Col>
                </Row>
            </div>
           
            <div className={styles.aboutContainer} id="About">
                <h3 className="text-center">Abous us</h3>
                <div  className={`d-flex flex-row justify-content-around ${styles.flexContainer}`}>
                    <div className={styles.paragraphContainer}>
                        <p className={styles.aboutUsPar}>
                        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. 
                        </p>
                    </div>
                    
                    <div className={styles.aboutImgContainer}>
                        <img src={about_footer} alt="About Us Image" className={styles.abtImg}/>
                    </div>
                </div>
                
            </div>
            <hr className={styles.delLine} id="Contact"/>
           
                <div className={`${styles.footer} d-flex flex-row justify-content-around`}>
                    <div className={styles.logoContainer}>
                        <span className={styles.logoText}><img src={logo} alt="logo" className={styles.logo}/>Măruleț</span>
                    </div>
                    <div className={styles.infoContainer}>
                        <p className={styles.contactTitle}>Contact us</p>
                        <i className={`fa fa-facebook-square ${styles.socialIcon}`} aria-hidden="true"></i>
                        <i className={`fa fa-instagram ${styles.socialIcon}`} aria-hidden="true"></i>
                        <i className={`fa fa-linkedin ${styles.socialIcon}`} aria-hidden="true"></i>
                    </div>
                </div>
                
            
            
        </>
    
    )
}
