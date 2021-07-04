import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import SubstanceReceipt from "./SubstanceReceipt";
import Equipment from './Equipment';
import TreeReceipts from './TreeReceipts';

export default function ReceiptPageTabs() {
    const [activeTab, setActiveTab] = useState('1');
    const toggle = tab => {
        if(activeTab !== tab)
            setActiveTab(tab);
    }
    return (
        <div>
        <Nav tabs>
            <NavItem>
            <NavLink
                className={classnames({ active: activeTab === '1' })}
                onClick={() => { toggle('1'); }}
            >
                Facturi substante
            </NavLink>
            </NavItem>
            <NavItem>
            <NavLink
                className={classnames({ active: activeTab === '2' })}
                onClick={() => { toggle('2'); }}
            >
                Facturi utilaje
            </NavLink>
            </NavItem>
            <NavItem>
            <NavLink
                className={classnames({ active: activeTab === '3' })}
                onClick={() => { toggle('3'); }}
            >
                Facturi pomi
            </NavLink>
            </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
            <Row>
                <Col lg="12">
                    <SubstanceReceipt />
                </Col>
            </Row>
            </TabPane>
            <TabPane tabId="2">
            <Row>
                <Col lg="12">
                    <Equipment />
                </Col>
            </Row>
            </TabPane>
            <TabPane tabId="3">
            <Row>
                <Col lg="12">
                    <TreeReceipts />
                </Col>
            </Row>
            </TabPane>
        </TabContent>
    </div>
    )
}
