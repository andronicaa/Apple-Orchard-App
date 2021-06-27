import React from 'react'
import styles from "./Styles/Home.module.css";
import Header from "../Header/Header";
import logo from "../../Imgs/temp_logo.png";
import about from "../../Imgs/about_img.jpg";
import about_footer from "../../Imgs/img_footer.jpg";
import home from '../../Imgs/home.jpg';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

export default function Home() {
    return (
        <>
            <div className={styles.mainContainer}>
                <Header />
                <div className={`${styles.anchorContainer} text-center`}>
                    <a href="#About"><i className={`fa fa-arrow-down ${styles.arrow}`} aria-hidden="true"></i></a>
                </div>
                <Row className={styles.rowContainer}>
                   <div className={styles.textContainer}>
                        <div className={styles.subTextContainer}>
                            <p className="text-center">Ana are mere</p>
                            <button className>Cultivator</button>
                            <button>Cumparator</button>
                        </div>
                   </div>

                   <div className={styles.imgContainer}>
                        <img src={about_footer} className={styles.princImg}/>
                   </div>
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
            <hr className={styles.delLine}/>
           
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
