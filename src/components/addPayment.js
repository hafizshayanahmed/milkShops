import React from 'react';
import Modal from 'react-modal';
import Firebase from "../config/firebase";
import Table from 'react-bootstrap/Table'
import { Button, Form, Col, Row, Navbar, Nav } from "react-bootstrap"

Modal.setAppElement('body')

class addPayments extends React.Component {
    constructor() {
        super();
        this.state = {
            con: false,
            reference: "",
        }
        this.closeModal = this.closeModal.bind(this);
        this.closeModal1 = this.closeModal1.bind(this);
    }

    history(ID) {
        var user = JSON.parse(localStorage.getItem("user"))
        Firebase.database().ref("payments/" + user.uid).on("value", (e) => {
            if (e.val() !== null) {
                let val = e.val()
                let newArr = Object.values(val).filter((e) => {
                    return e.ID === ID
                })
                this.setState({
                    newArr,
                    modalIsOpen1: true
                })
            }
        })
    }

    checkPayCondition(e) {
        if (e !== undefined) {
            if (e.toString() > 0) {
                this.setState({
                    payCondition: false,
                    pay: e
                })
            }
            if (e.toString() <= 0) {
                this.setState({
                    payCondition: true,
                    pay: e
                })
            }
        }
        else {
            this.setState({
                payCondition: true
            })
        }
    }

    async addPayment() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        let mon = mm

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        today = dd + '-' + mm + '-' + yyyy;
        today = today.toString()
        var user = JSON.parse(localStorage.getItem("user"))
        // var additionalInfo = JSON.parse(localStorage.getItem("additionalInfo"))
        let obj = {
            name: this.state.name,
            ID: this.state.ID,
            pay: this.state.pay,
            date: new Date().toString(),
            timeStamp: Firebase.database.ServerValue.TIMESTAMP,
            reference: this.state.reference
        }
        var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        var filter = await this.state.arr.filter((v, i) => {
            return v.ID === this.state.ID
        })
        var pay = Number(filter[filter.length - 1].pay) + Number(this.state.pay)
        console.log(filter[filter.length - 1])
        var name = filter[filter.length - 1].name
        var mobile = filter[filter.length - 1].mobile
        var milkQuantity = filter[filter.length - 1].milkQuantity
        var yogurtQuantity = filter[filter.length - 1].yogurtQuantity
        var milkRate = filter[filter.length - 1].milkRate
        var yogurtRate = filter[filter.length - 1].yogurtRate
        let paymentObj = {
            ID: this.state.ID,
            date: today,
            credit: this.state.pay,
            pay: pay,
            timeStamp: Firebase.database.ServerValue.TIMESTAMP,
            name,
            mobile,
            yogurtQuantity,
            milkQuantity,
            milkRate,
            yogurtRate,
            month: month[mon - 1],
            reference: this.state.reference
        }
        paymentObj = [paymentObj]
        if (this.state.payCondition !== undefined) {
            Firebase.database().ref("payments/" + user.uid).push(obj).then(() => {
                Firebase.database().ref("dailyWork/" + user.uid).push(paymentObj).then(() => {
                    alert("payment posted")
                    this.setState({
                        modalIsOpen: false,
                        modalIsOpen1: false
                    })
                })
            })
        }
        else {
            this.checkPayCondition(this.state.pay)
        }
    }

    componentDidMount() {
        var user = JSON.parse(localStorage.getItem("user"))
        Firebase.database().ref("customer/" + user.uid).on("value", (e) => {
            if (e.val() !== null) {
                let val = e.val();
                this.setState({
                    paymentArr: Object.values(val),
                    con: true
                })
            }
        })
        let arr = []
        Firebase.database().ref("dailyWork/" + user.uid).on("value", (e) => {
            if (e.val() !== null) {
                Object.values(e.val()).filter((a) => {
                    Object.values(a).filter((v) => {
                        arr.push(v)
                    })
                })
            }
            else {
                Firebase.database().ref("customer/" + user.uid).on("value", (e) => {
                    if (e.val() !== null) {
                        Object.values(e.val()).filter((a) => {
                            arr.push(a)
                        })
                    }
                })
            }
        })
        this.setState({
            arr,
        })
    }

    openModal(v) {
        this.setState({ modalIsOpen: true, ID: v.ID, name: v.name });
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    openModal1(v) {
        this.history(v.ID)
    }

    closeModal1() {
        this.setState({ modalIsOpen1: false });
    }

    render() {
        const customStyles = {
            content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)'
            }
        };
        const navColor = {
            color: "#37A000"
        },
            nav = {
                width: "35%",
                marginLeft: "32%",
            }
        return (
            <div>
                <div
                    style={{
                        minWidth: 1300,
                        backgroundColor: "white",
                        padding: 10,
                        borderTop: "1px solid lightgrey",
                        borderBottom: "2px solid lightgrey",
                        boxShadow: "0 3px 3px -1px lightgray"
                    }}
                >
                    <Navbar.Brand style={{ float: "left" }}>Milk Shops</Navbar.Brand>
                    <Nav>
                        <Nav.Link style={navColor} onClick={() => this.props.history.push("/allCustomers")} >Dashboard</Nav.Link>
                        <Nav.Link style={navColor} onClick={() => this.props.history.push("/addPayment")} >Add Receipt</Nav.Link>
                    </Nav>
                </div>
                <div style={{ width: "90%", minWidth: 1300, margin: "30px auto" }}>
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th style={{ width: 50 }}>#</th>
                                <th style={{ width: 200 }}>Name</th>
                                <th style={{ width: 200 }}>Mobile</th>
                                <th style={{ width: 200 }}>Option</th>
                                <th style={{ width: 200 }}>Option</th>
                            </tr>
                        </thead>
                    </Table>
                    {this.state.con && this.state.paymentArr.map((v, i) => {
                        return <Table key={i} striped bordered hover size="sm">
                            <tbody>
                                <tr>
                                    <td style={{ width: 50 }}>{i + 1}</td>
                                    <td style={{ width: 200 }}>{v.name}</td>
                                    <td style={{ width: 200 }}>{v.mobile}</td>
                                    <td style={{ width: 200 }}><Button onClick={() => this.openModal(v)}>Add payment</Button></td>
                                    <td style={{ width: 200 }}><Button onClick={() => this.openModal1(v)}>Payment history</Button></td>
                                </tr>
                            </tbody>
                            <Modal
                                isOpen={this.state.modalIsOpen}
                                onAfterOpen={this.afterOpenModal}
                                onRequestClose={this.closeModal}
                                style={customStyles}
                                contentLabel="Example Modal"
                            >
                                <div>
                                    <br />
                                    <Form>
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column sm="2"><b>Date:</b></Form.Label>
                                            <Col sm="10">
                                                <Form.Control plaintext readOnly defaultValue={new Date().toString().slice(0, 16)} />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} style={{ width: 278 }} controlId="formPlaintext">
                                            <Col>
                                                <Form.Control type="text" placeholder="Amount" onChange={(e) => {
                                                    this.checkPayCondition(e.target.value)
                                                }} />
                                            </Col>PKR
                                    </Form.Group>
                                        <Form.Group as={Row} style={{ width: 250 }} controlId="formPlaintext">
                                            <Col>
                                                <Form.Control type="text" placeholder="Reference" value={this.state.reference}
                                                    onChange={(e) => this.setState({
                                                        reference: e.target.value
                                                    })}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Form>
                                    <p style={{ color: "red" }}>{this.state.payCondition ? "Invalid input" : ""}</p>
                                    <br />
                                    <Button onClick={() => this.addPayment()}>Add</Button>
                                </div>
                            </Modal>
                            <Modal
                                isOpen={this.state.modalIsOpen1}
                                onAfterOpen={this.afterOpenModal1}
                                onRequestClose={this.closeModal1}
                                style={customStyles}
                                contentLabel="Example Modal"
                            >
                                <Table striped bordered hover size="sm">
                                    <thead>
                                        <tr>
                                            <th style={{ width: 30 }}>#</th>
                                            <th style={{ width: 60 }}>Name</th>
                                            <th style={{ width: 60 }}>Pay</th>
                                            <th style={{ width: 150 }}>Payment date</th>
                                        </tr>
                                    </thead>
                                </Table>
                                <div>
                                    {this.state.modalIsOpen1 && this.state.newArr.map((v, i) => {
                                        return <Table striped bordered hover size="sm">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: 30 }}>{i + 1}</th>
                                                    <th style={{ width: 60 }}>{v.name}</th>
                                                    <th style={{ width: 60 }}>{v.pay}</th>
                                                    <th style={{ width: 150 }}>{v.date}</th>
                                                </tr>
                                            </thead>
                                        </Table>
                                    })}
                                    <br />
                                    <Button variant="secondary" onClick={() => this.closeModal1()}>OK</Button>
                                </div>
                            </Modal>
                        </Table>
                    })
                    }
                    < Button variant="primary" onClick={() => this.props.history.push("/allCustomers")}>Go back to Dashboard</Button>
                </div >
            </div>
        );
    }
}

export default addPayments;