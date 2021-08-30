import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import ToDoTask from './ToDoTask';
import DoneTask from './DoneTask';
import AllTasks from './AllTasks';
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
            <NavItem >
            <NavLink
                className={`${classnames({ active: activeTab === '1' })} ${styles.navLink}`}
                onClick={() => { toggle('1'); }}
               
            >
                Operațiuni programate (ziua curentă)
                
            </NavLink>
            </NavItem >

            <NavItem >
            <NavLink
                className={`${classnames({ active: activeTab === '2' })} ${styles.navLink}`}
                onClick={() => { toggle('2'); }}
            >
                Operațiuni programate (toate zilele)
            </NavLink>
            </NavItem>

            <NavItem >
            <NavLink
                className={`${classnames({ active: activeTab === '3' })} ${styles.navLink}`}
                onClick={() => { toggle('3'); }}
            >
                Operațiuni finalizate
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
                    <AllTasks />
                </Col>
            </Row>
            </TabPane>

            <TabPane tabId="3">
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
