import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import SubstanceReceipt from "./SubstanceReceipt";
import PhoneSubstanceReceipt from './PhoneSubstanceReceipt';
import Equipment from './Equipment';
import TreeReceipts from './TreeReceipts';
import PhoneTreeReceipt from './PhoneTreeReceipt';
import PhoneEquipmentReceipt from './PhoneEquipmentReceipt';
import styles from './Style/ReceiptPageTabs.module.css';

export default function ReceiptPageTabs() {
    const [activeTab, setActiveTab] = useState('1');
    const toggle = tab => {
        if(activeTab !== tab)
            setActiveTab(tab);
    }
    return (
        <div className={styles.tabsContainer}>
        <Nav tabs className={styles.tabs}>
            <NavItem>
            <NavLink
                className={`${classnames({ active: activeTab === '1' })} ${styles.navLink}`}
                onClick={() => { toggle('1'); }}
            >
                Facturi substante
            </NavLink>
            </NavItem>
            <NavItem>
            <NavLink
                className={`${classnames({ active: activeTab === '2' })} ${styles.navLink}`}
                onClick={() => { toggle('2'); }}
            >
                Facturi utilaje
            </NavLink>
            </NavItem>
            <NavItem>
            <NavLink
                className={`${classnames({ active: activeTab === '4' })} ${styles.navLink}`}
                onClick={() => { toggle('3'); }}
            >
                Facturi pomi
            </NavLink>
            </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
            <Row>
                <Col lg={12} xs={12}>
                    {
                        window.screen.width > 501 ?
                            <SubstanceReceipt />
                        :
                            <PhoneSubstanceReceipt />
                    }
                    
                </Col>
            </Row>
            </TabPane>
            <TabPane tabId="2">
            <Row>
                <Col lg={12} xs={12}>
                
                    {
                        window.screen.width > 501 ?
                            <Equipment />
                        :
                            <PhoneEquipmentReceipt />
                    }
                </Col>
            </Row>
            </TabPane>
            <TabPane tabId="3">
            <Row>
                <Col lg={12} xs={12}>
                
                    {
                        window.screen.width > 501 ?
                            <TreeReceipts />
                        :
                            <PhoneTreeReceipt />
                    }
                </Col>
            </Row>
            </TabPane>
        </TabContent>
    </div>
    )
}
