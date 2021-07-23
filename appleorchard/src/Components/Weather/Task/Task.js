import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { Modal, Button, Form } from 'react-bootstrap';
import TimeKeeper from 'react-timekeeper';


export default function Task() {
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().substring(0, 10));
    const [date, setDate] = useState(new Date());
    const [startHour, setStartHour] = useState('12:25pm');
    const [endHour, setEndHour] = useState('12:25pm');
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const location = useLocation();
    const weatherData  = location.state.data;
    console.log("location", location.state.data);
    function handleSubmit(e, startHour, endHour, date) {
        console.log(startHour, endHour);
    }
    console.log("Datele primite ca parametru sunt: ", weatherData);
    return (
        
        <div>
            <Button onClick={handleShow}>Programeaza operatiune</Button>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Form>
                    <Form.Group>
                            <Form.Label>Data tratament</Form.Label>
                            <Form.Control type="date" name="dob" placeholder="Date of Birth" onChange={e => setDate(e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <TimeKeeper 
                            time={startHour}
                            onChange={data => setStartHour(data.formatted12)}
                            hour24Mode
                        />
                    </Form.Group>
                    <Form.Group>
                        <TimeKeeper 
                            time={endHour}
                            onChange={data => setEndHour(data.formatted12)}
                            hour24Mode
                        />
                    </Form.Group>
                    <Button onClick={e => handleSubmit(e, startHour, endHour, date)}>Salveaza</Button>
                </Form>
            </Modal>
        </div>
        
    )
}
