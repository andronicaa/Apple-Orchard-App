import React, { useState, useRef, useEffect } from 'react';
import { useTable, usePagination, useFilters } from 'react-table';
import firebase from "../../Firebase/firebase";
import { useAuth } from '../../Firebase/context/AuthContext';
import styles from './Style/Receipts.module.css';
import { months, appleTypes } from './Utility/ProductsFeature';
import jsPDF from 'jspdf';
import generatePdfReceipt from './Utility/GeneratePdfReceipt';
import { Modal, Table, Card, Alert, InputGroup, Form, Button } from 'react-bootstrap';

export default function Equipment() {

    const [filterInput, setFilterInput] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [data, setReceipts] = useState([]);
    const name = useRef();
    const quantity = useRef();
    const currency = useRef();
    const price = useRef();
    const month = useRef();
    const year = new Date().getFullYear();
    const [errorMsg, setErrorMsg] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { currentUser } = useAuth();
    const refCurrentUser = firebase.firestore().collection("users").doc(currentUser.uid).collection("receiptTrees");
    const handleFilterChange = e => {
        const value = e.target.value || undefined;
        setFilter("name", value);
        setFilterInput(value);
    }
    function addTree(e, name, price, month, currency, quantity) {
        e.preventDefault();
        // trebuie sa fac validarea
        var newPrice = parseFloat(price);
        var errors = [];
        var ok = true;
        if(currency === 'EUR')
        {
            newPrice = price * 4.897;
        }
        if(name === '' || quantity === '' || currency === '' || price === '' || month === '')
        {
            errors.push("Trebuie sa specificati o valoare pentru fiecare camp");
            ok = false;
        }
        // pentru utilajele stationare capacitatea poate fi 0
        if(ok)
        {
            handleClose();
            refCurrentUser
            .add({
                name: name,
                price: newPrice,
                quantity: quantity,
                month: month, 
                currency: currency,
                year: year
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
                Header: 'Soi',
                accessor: 'name'
                
            },
            {
                Header: 'Pret (lei)',
                accessor: 'price'
            },
            {
                Header: 'Cantitate (total)',
                accessor: 'quantity'
            },
            {
                Header: 'Sterge',
                accessor: (row) => {
                   return (
                       <Button variant="danger" onClick = {e => deleteProduct(e, row)}><i className="fa fa-trash" aria-hidden="true"></i></Button>
                   )
                } 
            },
            {
                Header: 'Detalii',
                accessor: (row) => {
                    return (
                        <Button className={styles.pdfButton} onClick={(e) => generatePdfReceipt(e, row, "trees")}><i className="fa fa-file-pdf-o" aria-hidden="true"></i></Button>
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
                        <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className={styles.arrowButton}>
                            <i className="fa fa-angle-double-left" aria-hidden="true"></i>
                        </Button>{' '}
                        <Button onClick={() => previousPage()} disabled={!canPreviousPage} className={styles.arrowButton}>
                            <i className="fa fa-angle-left" aria-hidden="true"></i>
                        </Button>{'   '}
                        <Button onClick={() => nextPage()} disabled={!canNextPage} className={styles.arrowButton}>
                            <i className="fa fa-angle-right" aria-hidden="true"></i>
                        </Button>{' '}
                        <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className={styles.arrowButton}>
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
                <Button type="button" className={styles.totalButton}>
                    Total <span class="badge badge-light">{totalPrice}</span> lei
                </Button>
            </div>
            <Button className={styles.addReceiptButton} onClick={handleShow}><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;Adauga factura</Button>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Body>
                        <div>
                            <h3 className={`text-center`} style={{color: "#871f08"}}>Adaugă factură</h3>
                            <Form>
                                    {errorMsg.length ?
                                        (
                                            errorMsg.map((err) => (
                                                <Alert variant="danger">{err}</Alert>
                                            ))
                                        )
                                        :
                                        (
                                            <div></div>
                                        ) 
                                    }   
                                <Form.Group>
                                    <Form.Label><strong>Soi</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependName">
                                            <InputGroup.Text>
                                                <i className={`fa fa-shopping-bag ${styles.icon}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control as="select" ref={name} placeholder="Soi..." aria-describedby="inputGroupPrependName"
                            required>
                                            {
                                                appleTypes.map((m) => (
                                                    <option>{m}</option>
                                                ))
                                            }
                                        </Form.Control>
                                    </InputGroup>
                                    
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label><strong>Preț (total)</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependPrice">
                                            <InputGroup.Text>
                                                <i className={`fa fa-money ${styles.icon}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control ref={price} type="number" min="1" placeholder="Preț..." aria-describedby="inputGroupPrependPrice"
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
                                    <Form.Label><strong>Lună achiziție</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependMonth">
                                            <InputGroup.Text>
                                                <i className={`fa fa-calendar ${styles.icon}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control as="select" ref={month} placeholder="Lună achiziție..." aria-describedby="inputGroupPrependMonth"
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
                                    <Form.Label><strong>Cantitate</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependQuantity">
                                            <InputGroup.Text>
                                                <i className={`fa fa-sort-amount-desc ${styles.icon}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control ref={quantity} type="number" min="1" placeholder="Cantitate..." aria-describedby="inputGroupPrependQuantity"
                            required/>
                                    </InputGroup>
                                </Form.Group>
                                <div className="text-center">
                                    <Button className={styles.addProductButton}
                                        onClick={(e) => addTree(e, name.current.value, price.current.value, month.current.value, currency.current.value, quantity.current.value)}
                                    >
                                        Încarca factura
                                    </Button>
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