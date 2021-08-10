import React from 'react';
import styles from './Style/TreatmentSchedule.module.css';
import OrchardMenu from './OrchardMenu';
import program_tehnologic from '../../Imgs/program-tehnologic-mar.jpg';
import { Link } from 'react-router-dom';

export default function TreatmentSchedule() {
    
    return (
        <div className={styles.mainPage}>
        <OrchardMenu />
        <div className={styles.title}>
            <p>Program tehnologic măr</p>
        </div>
        <div className={styles.mainContainer}>
            <div className={`text-center ${styles.imgContainer}`}>
                <img src={program_tehnologic} className={styles.img} alt="Program tehnologic mar"/>
            </div>
        </div>
        <div className={styles.sourceImg}>
            <a href="https://www.syngenta.ro/program-tehnologic-mar" className={styles.link} target="_blank">Sursă tabel Syngenta</a>
        </div>
        </div>
    )
}
