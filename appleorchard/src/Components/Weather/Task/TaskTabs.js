import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import ToDoTask from './ToDoTask';
import DoneTask from './DoneTask';
import styles from '../../Orchard/Style/ReceiptPageTabs.module.css';

export default function TaskTabs() {
    const [activeTab, setActiveTab] = useState('1');
    const toggle = tab => {
        if(activeTab !== tab)
            setActiveTab(tab);
    }
    return (
        <div className={styles.tabsContainer}>
        <Nav tabs className={styles.tabs}>
            <NavItem  style={{width: "50%"}}>
            <NavLink
                className={`${classnames({ active: activeTab === '1' })} ${styles.navLink}`}
                onClick={() => { toggle('1'); }}
               
            >
                Operatiuni programate 
                
            </NavLink>
            </NavItem >
            <NavItem style={{width: "50%"}}>
            <NavLink
                className={`${classnames({ active: activeTab === '2' })} ${styles.navLink}`}
                onClick={() => { toggle('2'); }}
            >
                Operatiuni finalizate
            </NavLink>
            </NavItem>
           
        </Nav>
        <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
            <Row>
                <Col lg="12">
                    <ToDoTask />
                </Col>
            </Row>
            </TabPane>
            <TabPane tabId="2">
            <Row>
                <Col lg="12">
                    <DoneTask />
                </Col>
            </Row>
            </TabPane>
        </TabContent>
    </div>
    )
}
