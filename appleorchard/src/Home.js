import React from 'react'
import styles from "./Styles/Home.module.css";
import Header from "./Components/Header/HeaderNeauth";
import logo from "./Imgs/temp_logo.png";
import about from "./Imgs/about_img.jpg";
import 'font-awesome/css/font-awesome.min.css';
export default function Home() {
    return (
        <>
            <div className={styles.mainContainer}>
                <Header />
            </div>
            <div className={styles.aboutContainer}>
                <h3 className="text-center">Abous us</h3>
                <div  className={`d-flex flex-row justify-content-around ${styles.flexContainer}`}>
                    <div className={styles.paragraphContainer}>
                        <p className={styles.aboutUsPar}>
                        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. 
                        </p>
                    </div>
                    
                    <div className={styles.aboutImgContainer}>
                        <img src={about} alt="About Us Image" className={styles.abtImg}/>
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
                        <i className="fa fa-facebook-square" aria-hidden="true"></i>
                        <i className="fa fa-instagram" aria-hidden="true"></i>
                        <i className="fa fa-linkedin" aria-hidden="true"></i>
                    </div>
                </div>
                
            
            
        </>
    
    )
}
