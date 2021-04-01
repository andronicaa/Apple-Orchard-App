import React, { useState, useRef, useEffect } from 'react';
import styles from './Style/SubstanceReceipt.module.css';
import generalcss from './Style/GeneralOrchardCSS.module.css';
import firebase from "../../Firebase/firebase";
import { useAuth } from '../../Firebase/context/AuthContext';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { useTable, usePagination, useFilters } from 'react-table';


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
        console.log("valuta este ", currency);
        console.log("Tipul campului pret este ", typeof newPrice);
        var errors = [];
        e.preventDefault();
        console.log(product, newPrice, quantity, month);
        if (currency === 'EUR')
        {
            newPrice = newPrice * 4.897;
        }
        console.log(newPrice);
        if (product === '' || newPrice === '' || quantity === '' || month === '')
        {
            errors.push("Trebuie sa specificati o valoare pentru toate campurile");
            setErrorMsg(errors);
        }
        else
        {
            handleClose();
            refCurrentUser
            .add({
                product: product,
                price: newPrice, 
                quantity: quantity,
                month: month
            })
            .catch((err) => {
                console.log(err);
            });
            setErrorMsg([]);
        }
        
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
          querySnapshot.forEach((doc) => {
            items.push(doc.data());
          });
          setReceipts(items);
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
        console.log(data);
        data.map((prd) => {
            totalPriceLocal += prd.price; 
        });
        // console.log("Pretul total local", totalPriceLocal);
        setTotalRrice(totalPriceLocal);
        // console.log("Pretul total al substantelor este ", totalPrice);
    }

    useEffect(() => {
        console.log("Am intrat");
        getProducts();
        listReceipt();
        totalPriceOfSubstances();
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
                            <form>
                                {errorMsg.length && <p>{errorMsg[0]}</p>}
                                <div className="form-group">
                                    <label for="lastname"><strong>Produs</strong></label>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            <i className={`fa fa-user`}></i>
                                        </span>
                                        <select className="form-control" ref={product}>
                                            {
                                                products.map((prd) => (
                                                    <option key={prd}>
                                                        {prd.product}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label for="firstname"><strong>Pret</strong></label>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            <i className={`fa fa-user`}></i>
                                        </span>
                                        <input ref={price} type="number" step="0.01" className="form-control" id="price-input" placeholder="Pret..."/>
                                        <span className="input-group-text">
                                            <select className={generalcss.selectValuta} ref={currency}>
                                                <option>RON</option>
                                                <option>EUR</option>
                                            </select>
                                        </span>
                                    </div>
                                    
                                </div>
                                <div className="form-group">
                                    <label for="firstname"><strong>Cantitate</strong></label>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            <i className={`fa fa-user`}></i>
                                        </span>
                                        <input ref={quantity} type="number" className="form-control" id="quantity-input" placeholder="Cantitate..."/>
                                        <span className="input-group-text">
                                            <select className={generalcss.selectValuta} ref={measureQuantity}>
                                                <option>kg</option>
                                                <option>g</option>
                                            </select>
                                        </span>
                                    </div>
                                    
                                </div>
                                <div className="form-group">
                                    <label for="firstname"><strong>Luna achizitie</strong></label>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            <i className={`fa fa-user`}></i>
                                        </span>
                                        <select className="form-control" ref={month}>
                                            {
                                                months.map((m) => (
                                                    <option key={m}>
                                                        {m}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    
                                </div>
                                <div className="text-center">
                                    <button className={`btn btn-success`}
                                        onClick={(e) => addReceipt(e, product.current.value, price.current.value, quantity.current.value, month.current.value, currency.current.value, measureQuantity.current.Value)}
                                    >
                                        Incarca factura
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Modal.Body>
                </Modal>
            </Card.Body>
        </Card>
    </>
    )
}
