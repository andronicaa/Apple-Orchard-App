import React from 'react'
import styles from "./Styles/Home.module.css";
import Header from "./Components/Header/HeaderNeauth";
import logo from "./Imgs/temp_logo.png";
import 'font-awesome/css/font-awesome.min.css';
export default function Home() {
    return (
        <>
            <div className={styles.mainContainer}>
                <Header />
            </div>
            <div className={styles.aboutContainer}>
                <h3 className="text-center">Abous us</h3>
                <p className={styles.aboutUsPar}>
                "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."
                </p>
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
