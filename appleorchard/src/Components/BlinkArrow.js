import React from 'react'
import styles from "./BlinkArrow.module.css";
export default function BlinkArrow() {
    return (
        <div className = {styles.arrowContainer}>
        <   i className = {`${styles.arrow} fa fa-arrow-circle-down fa-3x`}></i>
        </div>

    )
}
