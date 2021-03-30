import React, { useState, useRef, useEffect } from 'react';
import styles from "./Style/OrchardInfo.module.css";
import OrchardMenu from "./OrchardMenu";
import ReceiptPageTabs from "./ReceiptPageTabs";


export default function OrchardInfo() {

    
    return (
        <div className={styles.receiptPage}>
            <OrchardMenu />
            <div className={styles.tableTabs}>
                <ReceiptPageTabs />
            </div>
            
            </div>
        
    )
}
