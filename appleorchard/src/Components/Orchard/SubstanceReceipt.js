import React, { useState, useRef, useEffect } from 'react';
import styles from './Style/Receipts.module.css';
import firebase from "../../Firebase/firebase";
import { useAuth } from '../../Firebase/context/AuthContext';
import { useTable, usePagination, useFilters } from 'react-table';
import generatePdfReceipt from './Utility/GeneratePdfReceipt';
import { Modal, Table, Card, Alert, InputGroup, Form, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import { months } from './Utility/ProductsFeature';

export default function SubstanceReceipt() {
    // pentru functionalitatea de search
    const [filterInput, setFilterInput] = useState('');
    const [totalPrice, setTotalRrice] = useState(0);
    const [errorMsg, setErrorMsg] = useState([]);
    const { currentUser } = useAuth();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [data, setReceipts] = useState([]);
    const measureQuantity = useRef();
    const currency = useRef();
    const product = useRef();
    const price = useRef();
    const quantity = useRef();
    const month = useRef();
    const year = new Date().getFullYear();
    const refCurrentUser = firebase.firestore().collection("users").doc(currentUser.uid).collection("receipt");
    const products = ['Affirm Opti', 'Brevis', 'Chorus50', 'Coprantol Duo', 'Karate Zeon', 'Score 250EC', 'Switch', 'Thiovit Jet', 'Topas', 'Vertimec', 'Voliam Targo']
    
    const handleFilterChange = e => {
        const value = e.target.value || undefined;
        setFilter("product", value);
        setFilterInput(value);
    }
    
    // functie pentru adaugare de factura
    function addReceipt(e, product, price, quantity, month, currency, measureQuantity) {
        // parsam valoarea pretului(ar trebui si a cantitatii)
        var newPrice = parseFloat(price);
        var newQuantity = parseFloat(quantity);
        var ok = true;
        console.log("valuta este ", currency);
        console.log("Tipul campului pret este ", typeof newPrice);
        var errors = [];
        e.preventDefault();
        console.log(product, newPrice, quantity, month);
        if(currency === 'EUR')
        {
            newPrice = price * 4.897;
        }
        if(measureQuantity === 'g')
        {
            newQuantity = quantity * 0.0010000;
        }
        console.log(newPrice);

        if(product === '' || price === '' || quantity === '' || month === '')
        {
            errors.push("Trebuie să specificați o valoare pentru fiecare câmp");
            ok = false;
        }
        if(ok)
        {
            handleClose();
            refCurrentUser
            .add({
                product: product,
                price: newPrice, 
                quantity: newQuantity,
                month: month,
                year: year,
                currency: currency
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

    const columns = React.useMemo(
        () => [
            {
                Header: 'Nume produs',
                accessor: 'product'
                
            },
            {
                Header: 'Preț (lei)',
                accessor: 'price'
            },
            {
                Header: 'Cantitate (kg)',
                accessor: 'quantity'
            },
            {
                Header: 'Șterge',
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
                        <Button className={styles.pdfButton} onClick={(e) => generatePdfReceipt(e, row, "substance")}><i className="fa fa-file-pdf-o" aria-hidden="true"></i></Button>
                    )
                }
            }
        ],
        []
    );

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
    
    function listReceipt() {
        refCurrentUser.onSnapshot((querySnapshot) => {
          const items = [];
          var totalPriceLocal = 0;
          querySnapshot.forEach((doc) => {
            items.push({id: doc.id,...doc.data()});
            totalPriceLocal += doc.data().price;
          });
          setReceipts(items);
          console.log("FACTURILE SUNT", items)
          setTotalRrice(totalPriceLocal);
        });
    }

   
    useEffect(() => {
        console.log("Am intrat");
        listReceipt();
    }, []);


    return (
    <div>
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
            <Button className={styles.addReceiptButton} onClick={handleShow}><i className="fa fa-plus" aria-hidden="true"></i>&nbsp;Adauga factura</Button>
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
                                    <Form.Label><strong>Produs</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependProduct">
                                            <InputGroup.Text>
                                                <i className={`fa fa-product-hunt ${styles.icon}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control as="select" ref={product} aria-describedby="inputGroupPrependProduct"
                            required>
                                            {
                                                products.map((prd) => (
                                                    <option key={prd}>
                                                        {prd}
                                                    </option>
                                                ))
                                            }
                                        </Form.Control>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label><strong>Preț</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependPrice">
                                            <InputGroup.Text>
                                                <i className={`fa fa-money ${styles.icon}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control ref={price} type="number" placeholder="Pret..." min="1" aria-describedby="inputGroupPrependPrice"
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
                                    <Form.Label><strong>Cantitate achiziționată</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependQuantity">
                                            <InputGroup.Text>
                                                <i className={`fa fa-sort-amount-desc ${styles.icon}`} aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control ref={quantity} type="number" placeholder="Cantitate..." min="1" aria-describedby="inputGroupPrependQuantity"
                            required/>
                                        <InputGroup.Prepend id="inputGroupPrependMeasureQ">
                                            <Form.Control as="select" ref={measureQuantity} aria-describedby="inputGroupPrependMeasureQ"
                            required>
                                                <option>kg</option>
                                                <option>g</option>
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
                                <div className="text-center">
                                    <Button className={styles.addProductButton}
                                        onClick={(e) => addReceipt(e, product.current.value, price.current.value, quantity.current.value, month.current.value, currency.current.value, measureQuantity.current.Value)}
                                    >
                                        Încarcă factura
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Modal.Body>
                </Modal>
            </Card.Body>
        </Card>
    </div>
    )
}
