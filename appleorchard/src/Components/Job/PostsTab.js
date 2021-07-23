import React, { useState } from 'react';
import OrchardMenu from '../Orchard/OrchardMenu';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import AddJob from './AddJob';
import RejectedOffer from './RejectedOffer';
import JobRequests from './JobRequests';
import AcceptedOffer from './AcceptedOffer';
import styles from './Style/PostsTab.module.css';

export default function ReceiptPageTabs() {
    const [activeTab, setActiveTab] = useState('1');
    const toggle = tab => {
        if(activeTab !== tab)
            setActiveTab(tab);
    }
    return (
        <>
            <OrchardMenu />
        <div className={styles.tabs}>
        <Nav tabs>
            <NavItem>
            <NavLink
                className={classnames({ active: activeTab === '1' })}
                onClick={() => { toggle('1'); }}
            >
                Anunturi postate
            </NavLink>
            </NavItem>
            <NavItem>
            <NavLink
                className={classnames({ active: activeTab === '2' })}
                onClick={() => { toggle('2'); }}
            >
                Cereri
            </NavLink>
            </NavItem>
            <NavItem>
            <NavLink
                className={classnames({ active: activeTab === '3' })}
                onClick={() => { toggle('3'); }}
            >
                Oferte respinse
            </NavLink>
            </NavItem>
            <NavItem>
            <NavLink
                className={classnames({ active: activeTab === '4' })}
                onClick={() => { toggle('4'); }}
            >
                Oferte acceptate
            </NavLink>
            </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
            <Row>
                <Col lg="12">
                    <AddJob />
                </Col>
            </Row>
            </TabPane>
            <TabPane tabId="2">
            <Row>
                <Col lg="12">
                    <JobRequests />
                </Col>
            </Row>
            </TabPane>
            <TabPane tabId="3">
            <Row>
                <Col lg="12">
                    <RejectedOffer />
                </Col>
            </Row>
            </TabPane>
            <TabPane tabId="4">
            <Row>
                <Col lg="12">
                    <AcceptedOffer />
                </Col>
            </Row>
            </TabPane>
        </TabContent>
    </div>
    </>
    )
}
