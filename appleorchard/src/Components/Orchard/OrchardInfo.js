import React, { useState, useEffect } from 'react';
import styles from "./Style/OrchardInfo.module.css";
import NotFoundPage from '../Home/NotFoundPage';
import OrchardMenu from "./OrchardMenu";
import ReceiptPageTabs from "./ReceiptPageTabs";
import firebase from "../../Firebase/firebase";
import { useAuth } from '../../Firebase/context/AuthContext';


export default function OrchardInfo() {
    const { currentUser } = useAuth();
    
    return (
        <div className={styles.receiptPage}>
            <OrchardMenu />
            <div className={styles.tableTabs}>
                <ReceiptPageTabs />
            </div>
        
        </div>
    )
}
