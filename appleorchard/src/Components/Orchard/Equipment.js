import React, { useState, useRef, useEffect } from 'react';
import { useTable, usePagination, useFilters } from 'react-table';
import firebase from "../../Firebase/firebase";
import { useAuth } from '../../Firebase/context/AuthContext';
import styles from './Style/Receipts.module.css';
import { months, equipmentType } from './Utility/ProductsFeature';
import jsPDF from 'jspdf';
import generatePdfReceipt from './Utility/GeneratePdfReceipt';
import { Modal, Table, Card, Alert, InputGroup, Form, Button } from 'react-bootstrap';

export default function Equipment() {
    const [filterInput, setFilterInput] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [data, setReceipts] = useState([]);
    const nameEq = useRef();
    const capacity = useRef();
    const currency = useRef();
    const price = useRef();
    const month = useRef();
    const type = useRef();
    const year = new Date().getFullYear();
    const [errorMsg, setErrorMsg] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { currentUser } = useAuth();
    const refCurrentUser = firebase.firestore().collection("users").doc(currentUser.uid).collection("receiptEquipment");
    const handleFilterChange = e => {
        const value = e.target.value || undefined;
        setFilter("product", value);
        setFilterInput(value);
    }
    function addEquipment(e, nameEq, price, capacity, month, currency, type) {
        e.preventDefault();
        // trebuie sa fac validarea
        var newPrice = parseFloat(price);
        var errors = [];
        var ok = true;
        if(currency === 'EUR')
        {
            newPrice = price * 4.897;
        }
        if(nameEq === '' || price === '' || capacity === '' || month === '' || currency === '')
        {
            errors.push("Trebuie sa specificati o valoare pentru fiecare camp");
            ok = false;
        }
        // pentru utilajele stationare capacitatea poate fi 0
        if(capacity[0] === '.' || capacity[0] === '-')
        {   
            if(capacity[0] === '-')
                errors.push("Capacitatea trebuie sa fie un numar pozitiv");
            else
                errors.push("Formatul capacitatii nu este un numar corect");
            ok = false;
        }
        if(price[0] === '0' || price[0] === '.' || price[0] === '-')
        {
            if(price[0] === '-')
                errors.push("Pretul trebuie sa fie un numar pozitiv");
            else 
                errors.push("Formatul pretului nu este un numar corect");
            ok = false;
        }
        if(ok)
        {
            handleClose();
            refCurrentUser
            .add({
                nameEq: nameEq,
                price: newPrice,
                capacity: capacity,
                month: month, 
                currency: currency,
                type: type,
                year: year, 
                busy: []
            })
            .catch((err) => {
                console.log(err);
            });
            setErrorMsg([]);
        }
        setErrorMsg(errors);
    }
    function deleteProduct(e, product) {

        console.log(product);
        refCurrentUser.
        doc(product.id).delete().then(() => {console.log("Sters", product.id)}).catch((err) => {console.log(err)});
    }
    function listReceipt() {
        refCurrentUser.onSnapshot((querySnapshot) => {
          const items = [];
          var totalPriceLocal = 0;
          querySnapshot.forEach((doc) => {
            items.push({id: doc.id,...doc.data()});
            totalPriceLocal += doc.data().price;
          });
          setReceipts(items);
          console.log("Item", items)
          setTotalPrice(totalPriceLocal);
        });
    } 
    const columns = React.useMemo(
        () => [
            {
                Header: 'Nume utilaj',
                accessor: 'nameEq'
                
            },
            {
                Header: 'Pret (lei)',
                accessor: 'price'
            },
            {
                Header: 'Tip utilaj',
                accessor: 'type'
            },
            {
                Header: 'Sterge',
                accessor: (row) => {
                   return (
                       <Button variant="success" onClick = {e => deleteProduct(e, row)}><i className="fa fa-trash" aria-hidden="true"></i></Button>
                   )
                } 
            },
            {
                Header: 'Detalii',
                accessor: (row) => {
                    return (
                        <Button variant="danger" onClick={(e) => generatePdfReceipt(e, row)}><i className="fa fa-file-pdf-o" aria-hidden="true"></i></Button>
                    )
                }
            }
        ],
        []
    );

    useEffect(() => {
        console.log("Am intrat");
        listReceipt();
    }, []);

    const {
        getTableProps, // table props from react-table
        getTableBodyProps, // table body props from react-table
        headerGroups, // nu cred ca am nevoie de asta -> headerGroups, if table has groupins
        prepareRow, // this frunction needs to be called for each row before getting the row props
        page, // datele efective din tabel
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setFilter,
        state: {pageIndex, pageSize},
    } = useTable(
        {
            columns, data, initialState: {pageIndex: 0, pageSize: 4},
        },
        useFilters,
        usePagination
    )
    return (
        <>
        <Card className={styles.receiptCard}>
            <Card.Body>
            <div className="input-group-prepend">
                <span className="input-group-text">
                    <i className="fa fa-search" aria-hidden="true"></i>
                </span>
                <input 
                    value={filterInput}
                    onChange={handleFilterChange}
                    placeholder={"Cauta factura"}
                />
            </div>
                
                <Table {...getTableProps()}>
                    <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                        )
                    })}
                    </tbody>
                </Table>
                <div className={styles.pagination}>
                    <div className={styles.subPagination}>
                        <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                            <i className="fa fa-angle-double-left" aria-hidden="true"></i>
                        </Button>{' '}
                        <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
                            <i className="fa fa-angle-left" aria-hidden="true"></i>
                        </Button>{'   '}
                        <Button onClick={() => nextPage()} disabled={!canNextPage} className="">
                            <i className="fa fa-angle-right" aria-hidden="true"></i>
                        </Button>{' '}
                        <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                            <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                        </Button>{' '}
                            <span>
                            <strong>
                                {pageIndex + 1} / {pageOptions.length}
                            </strong>{' '}
                            </span>
                            <span>
                            Pagina:{' '}
                            <input
                                type="number"
                                defaultValue={pageIndex + 1}
                                onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                gotoPage(page)
                                }}
                                style={{ width: '70px'}}
                            />
                            </span>{' '}
                    </div>
                    
                </div>
            <div>
                <Button type="button" className="btn btn-primary">
                    Total <span class="badge badge-light">{totalPrice}</span> lei
                </Button>
            </div>
            <button className={`btn btn-success ${styles.addReceiptButton}`} onClick={handleShow}><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;Adauga factura</button>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Body>
                        <div>
                            <h3 className={`text-center`}>Adauga factura</h3>
                            <Form>
                                {errorMsg.length && <Alert variant="danger">
                                    {
                                        errorMsg.map((err) => (
                                            <p>{err}</p>
                                        ))
                                    }    
                                </Alert>}
                                <Form.Group>
                                    <Form.Label><strong>Nume utilaj</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependEqName">
                                            <InputGroup.Text>
                                                <i className={`fa fa-truck ${styles.icons}`} aria-hidden="true" />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control 
                                            ref={nameEq}
                                            type="text"
                                            placeholder="Nume"
                                            aria-describedby="inputGroupPrependEqName"
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label><strong>Pret</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependPrice">
                                            <InputGroup.Text>
                                                <i className="fa fa-money" aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control ref={price} type="number" placeholder="Pret..." aria-describedby="inputGroupPrependPrice"
                            required/>
                                        <InputGroup.Prepend id="inputGroupPrependCurrency">
                                            <Form.Control as="select" ref={currency} aria-describedby="inputGroupPrependCurrency"
                            required>
                                                <option>RON</option>
                                                <option>EUR</option>
                                            </Form.Control>
                                        </InputGroup.Prepend>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label><strong>Luna achizitie</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependMonth">
                                            <InputGroup.Text>
                                                <i className="fa fa-calendar" aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control as="select" ref={month} placeholder="Luna achizitie..." aria-describedby="inputGroupPrependMonth"
                            required>
                                            {
                                                months.map((m) => (
                                                    <option>{m}</option>
                                                ))
                                            }
                                        </Form.Control>
                                    </InputGroup>
                                    
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label><strong>Tip utilaj</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependEqType">
                                            <InputGroup.Text>
                                                <i className="fa fa-truck" aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control as="select" ref={type} placeholder="Tip utilaj..." aria-describedby="inputGroupPrependEqType"
                            required>
                                            {
                                                equipmentType.map((m) => (
                                                    <option>{m}</option>
                                                ))
                                            }
                                        </Form.Control>
                                    </InputGroup>
                                    
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label><strong>Capacitate cilindrica (cp)</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependCapacity">
                                            <InputGroup.Text>
                                                <i className={`fa fa-bar-chart ${styles.icons}`} aria-hidden="true" />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control 
                                            ref={capacity}
                                            type="text"
                                            placeholder="Capacitate"
                                            aria-describedby="inputGroupPrependCapacity"
                                            required
                                        />
                                    </InputGroup>
                                    
                                </Form.Group>
                                <div className="text-center">
                                    <button className={`btn btn-success`}
                                        onClick={(e) => addEquipment(e, nameEq.current.value, price.current.value, capacity.current.value, month.current.value, currency.current.value, type.current.value)}
                                    >
                                        Incarca factura
                                    </button>
                                </div>
                            </Form>
                        </div>
                    </Modal.Body>
                </Modal>
            </Card.Body>
        </Card>
        </>
    )
}
