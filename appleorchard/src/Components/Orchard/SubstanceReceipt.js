import React, { useState, useRef, useEffect } from 'react';
import styles from './Style/SubstanceReceipt.module.css';
import generalcss from './Style/GeneralOrchardCSS.module.css';
import firebase from "../../Firebase/firebase";
import { useAuth } from '../../Firebase/context/AuthContext';
import { useTable, usePagination, useFilters } from 'react-table';
import { Modal, Table, Card, Alert, InputGroup, Form, Button } from 'react-bootstrap';


export default function SubstanceReceipt() {
    // pentru functionalitatea de search
    const [filterInput, setFilterInput] = useState('');
    const [totalPrice, setTotalRrice] = useState(0);
    const [errorMsg, setErrorMsg] = useState([]);
    const [products, setProducts] = useState([]);
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
    const refCurrentUser = firebase.firestore().collection("users").doc(currentUser.uid).collection("receipt");
    const refProducts = firebase.firestore().collection("users").doc(currentUser.uid).collection("products");
    const months = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
    
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
            errors.push("Trebuie sa specificati o valoare pentru fiecare camp\n");
        }
        // numerele nu trebuie sa inceapa cu 0, punct sau sa fie negative
        if(quantity[0] === '0' || quantity[0] === '.' || quantity[0] === '-')
        {
            errors.push("Formatul cantitatii nu este un numar corect\n");
        }
        if(price[0] === '0' || price[0] === '.' || price[0] === '-')
        {
            errors.push("Formatul pretului nu este un numar corect\n");
        }

        else
        {
            handleClose();
            refCurrentUser
            .add({
                product: product,
                price: newPrice, 
                quantity: newQuantity,
                month: month
            })
            .catch((err) => {
                console.log(err);
            });
            setErrorMsg([]);
        }
        setErrorMsg(errors);
        
    }

    const columns = React.useMemo(
        () => [
            {
                Header: 'Nume',
                accessor: 'product'
                
            },
            {
                Header: 'Pret',
                accessor: 'price'
            },
            {
                Header: 'Cantitate',
                accessor: 'quantity'
            },
            {
                Header: 'Luna achizitie',
                accessor: 'month'
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
        setPageSize,
        setFilter,
        state: {pageIndex, pageSize},
    } = useTable(
        {
            columns, data, initialState: {pageIndex: 0},
        },
        useFilters,
        usePagination
    )
    
    function listReceipt() {
        refCurrentUser.onSnapshot((querySnapshot) => {
          const items = [];
          var totalPriceLocal = 0;
          querySnapshot.forEach((doc) => {
            items.push(doc.data());
            totalPriceLocal += doc.data().price;
          });
          setReceipts(items);
          setTotalRrice(totalPriceLocal);
        });
    }

    function getProducts() {
        refProducts.onSnapshot((querySnapshot) => {
            const prds = [];
            querySnapshot.forEach((doc) => {
                prds.push(doc.data());
            });
            setProducts(prds);
        });
    }

    function totalPriceOfSubstances() {
        var totalPriceLocal = 0;
        console.log("Facturile sunt", data);
        data.map((prd) => {
            totalPriceLocal += prd.price; 
        });
        // console.log("Pretul total local", totalPriceLocal);
        setTotalRrice(totalPriceLocal);
        console.log("Pretul total al substantelor este ", totalPrice);
    }

    useEffect(() => {
        console.log("Am intrat");
        getProducts();
        listReceipt();
        // totalPriceOfSubstances();
    }, []);


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
                    placeholder={"Search name"}
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
                <div className="pagination">
                    <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                        {'<<'}
                    </button>{' '}
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                        {'<'}
                    </button>{' '}
                    <button onClick={() => nextPage()} disabled={!canNextPage} className="">
                        {'>'}
                    </button>{' '}
                    <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                        {'>>'}
                    </button>{' '}
                        <span>
                        Page{' '}
                        <strong>
                            {pageIndex + 1} of {pageOptions.length}
                        </strong>{' '}
                        </span>
                        <span>
                        | Go to page:{' '}
                        <input
                            type="number"
                            defaultValue={pageIndex + 1}
                            onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(page)
                            }}
                            style={{ width: '100px' }}
                        />
                        </span>{' '}
                        <select
                        value={pageSize}
                        onChange={e => {
                            setPageSize(Number(e.target.value))
                        }}
                        >
                        {[1, 2, 3].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                            </option>
                        ))}
                        </select>
                </div>
            <div>{totalPrice}</div>
            <button className={`btn btn-success ${styles.addReceiptButton}`} onClick={handleShow}><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;Adauga factura</button>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Body>
                        <div>
                            <h3 className={`text-center`}>Adauga factura</h3>
                            <Form>
                                {errorMsg.length && <Alert variant="danger">{errorMsg}</Alert>}
                                <Form.Group>
                                    <Form.Label><strong>Produs</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependProduct">
                                            <InputGroup.Text>
                                                <i class="fa fa-product-hunt" aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control as="select" ref={product} aria-describedby="inputGroupPrependProduct"
                            required>
                                            {
                                                products.map((prd) => (
                                                    <option key={prd}>
                                                        {prd.product}
                                                    </option>
                                                ))
                                            }
                                        </Form.Control>
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
                                    <Form.Label><strong>Cantitate</strong></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend id="inputGroupPrependQuantity">
                                            <InputGroup.Text>
                                                <i className="fa fa-sort-amount-desc" aria-hidden="true"></i>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control ref={quantity} type="number" placeholder="Cantitate..." aria-describedby="inputGroupPrependQuantity"
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
                                <div className="text-center">
                                    <button className={`btn btn-success`}
                                        onClick={(e) => addReceipt(e, product.current.value, price.current.value, quantity.current.value, month.current.value, currency.current.value, measureQuantity.current.Value)}
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
