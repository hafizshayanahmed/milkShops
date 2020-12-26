import React from 'react';
import Firebase from "../config/firebase";
import Table from 'react-bootstrap/Table'
import { Button, Form, Modal, Navbar, Nav } from "react-bootstrap"

class dailyWork extends React.Component {
    constructor() {
        super();
        this.state = {
            con: false,
            date: "",
            setShow: false,
            setShow1: false,
            count: 0,
        }
    }

    checkWork() {
        var monthNumber = this.state.month - 1
        var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        var newArr = []
        var milk = document.getElementsByName('milk');
        var yogurt = document.getElementsByName('yogurt');
        for (var i = 0, length = milk.length; i < length; i++) {
            if (milk[i].checked && yogurt[i].checked) {
                let mlk = milk[i].id
                mlk = JSON.parse(mlk)
                mlk.isMilkDelivered = true
                mlk.isYogurtDelivered = true
                let pay = Number(mlk.pay)
                let milkRate = Number(mlk.milkRate)
                let yogurtRate = Number(mlk.yogurtRate)
                let milkAmount = milkRate * Number(mlk.milkQuantity)
                let yogurtAmount = yogurtRate * Number(mlk.yogurtQuantity)
                pay = pay - (milkAmount + yogurtAmount)
                mlk.pay = pay
                mlk.date = this.state.date
                mlk.month = month[monthNumber]
                mlk.milkAmount = milkAmount
                mlk.yogurtAmount = yogurtAmount
                mlk.timeStamp = Firebase.database.ServerValue.TIMESTAMP
                delete mlk.credit
                delete mlk.opening
                newArr.push(mlk)
            }
            if (yogurt[i].checked && milk[i].checked === false) {
                let ygt = yogurt[i].id
                ygt = JSON.parse(ygt)
                ygt.isYogurtDelivered = true
                ygt.isMilkDelivered = false
                let pay = Number(ygt.pay)
                let yogurtRate = Number(ygt.yogurtRate)
                let yogurtAmount = yogurtRate * Number(ygt.yogurtQuantity)
                pay = pay - (yogurtAmount)
                ygt.pay = pay
                ygt.date = this.state.date
                ygt.month = month[monthNumber]
                ygt.yogurtAmount = yogurtAmount
                ygt.milkAmount = 0
                ygt.timeStamp = Firebase.database.ServerValue.TIMESTAMP
                delete ygt.credit
                delete ygt.opening
                newArr.push(ygt)
            }
            if (milk[i].checked && yogurt[i].checked === false) {
                let ygt = yogurt[i].id
                ygt = JSON.parse(ygt)
                ygt.isYogurtDelivered = false
                ygt.isMilkDelivered = true
                let pay = Number(ygt.pay)
                let milkRate = Number(ygt.milkRate)
                let milkAmount = milkRate * Number(ygt.milkQuantity)
                pay = pay - (milkRate)
                ygt.pay = pay
                ygt.date = this.state.date
                ygt.month = month[monthNumber]
                ygt.milkAmount = milkAmount
                ygt.yogurtAmount = 0
                ygt.timeStamp = Firebase.database.ServerValue.TIMESTAMP
                delete ygt.credit
                delete ygt.opening
                newArr.push(ygt)
            }
            if (yogurt[i].checked === false && milk[i].checked === false) {
                let ygt = yogurt[i].id
                ygt = JSON.parse(ygt)
                ygt.isYogurtDelivered = false
                ygt.isMilkDelivered = false
                let pay = ygt.pay
                ygt.pay = pay
                ygt.date = this.state.date
                ygt.month = month[monthNumber]
                ygt.yogurtAmount = 0
                ygt.milkAmount = 0
                ygt.timeStamp = Firebase.database.ServerValue.TIMESTAMP
                delete ygt.credit
                delete ygt.opening
                newArr.push(ygt)
            }
        }
        let user = JSON.parse(localStorage.getItem("user"))
        var newObj = {
            date: this.state.date
        }
        if (this.state.dailyCheck !== undefined) {
            if (this.state.dailyCheck[this.state.dailyCheck.length - 1].date === this.state.date) {
                this.setState({
                    setShow1: true
                })
            }
            else if (this.state.dailyCheck[this.state.dailyCheck.length - 1].date !== this.state.date) {
                Firebase.database().ref("dailyWork/" + user.uid).push(newArr).then(() => {
                    Firebase.database().ref("dailyCheck/" + user.uid).push(newObj).then(() => {
                        this.setState({
                            setShow: true
                        })
                    })
                })
            }
        }
        else if (this.state.dailyCheck === undefined) {
            Firebase.database().ref("dailyWork/" + user.uid).push(newArr).then(() => {
                Firebase.database().ref("dailyCheck/" + user.uid).push(newObj).then(() => {
                    this.setState({
                        setShow: true
                    })
                })
            })
        }
    }

    componentDidMount() {
        document.getElementById('DateField').valueAsDate = new Date();
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
        let user = JSON.parse(localStorage.getItem("user"))
        var arr = []
        Firebase.database().ref("dailyCheck/" + user.uid).on("value", (e) => {
            if (e.val() !== null) {
                this.setState({ dailyCheck: Object.values(e.val()) })
            }
        })
        Firebase.database().ref("dailyWork/" + user.uid).on("value", (e) => {
            if (e.val() !== null) {
                Object.values(e.val()).filter((a) => {
                    Object.values(a).filter((v) => {
                        arr.push(v)
                    })
                })
                var sortedArr = arr.sort(function (x, y) {
                    return y.timeStamp - x.timeStamp;
                })
                var filteredArr = sortedArr.filter((ele, ind) => ind === sortedArr.findIndex(elem => elem.ID === ele.ID))
                this.setState({
                    customers: filteredArr.reverse(),
                    date: today,
                    con: true,
                    month: mon,
                })
            }
            else {
                Firebase.database().ref("customer/" + user.uid).on("value", (e) => {
                    if (e.val() !== null) {
                        this.setState({
                            customers: Object.values(e.val()),
                            date: today,
                            con: true,
                            month: mon
                        })
                    }
                })
            }
        })
    }

    close() {
        this.setState({
            setShow: false
        })
    }

    close1() {
        this.setState({
            setShow1: false
        })
    }

    render() {
        const navColor = {
            color: "#37A000"
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
                        <Nav.Link style={navColor} onClick={() => this.props.history.push("allCustomers")} >Dashboard</Nav.Link>
                        <Nav.Link style={navColor} onClick={() => this.props.history.push("/dailyWork")} >Daily Work</Nav.Link>
                    </Nav>
                </div>
                <div style={{ width: "95%", minWidth: 1300, margin: "0 auto" }}>
                    <br />
                    <div style={{ width: "20%", minWidth: 180, margin: "0 auto" }}>
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label style={{ display: "inline" }}>Date:</Form.Label>
                                <Form.Control type="date" disabled={false} onChange={(e) => this.setState({
                                    date: e.target.value
                                })} id="DateField" />
                            </Form.Group>
                        </Form>
                    </div>
                    <br />
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th style={{ width: 50 }}>#</th>
                                <th style={{ width: 200 }}>Name</th>
                                <th style={{ width: 200 }}>Mobile</th>
                                <th style={{ width: 200 }}>Milk Qty</th>
                                <th style={{ width: 200 }}>Yogurt Qty</th>
                                <th style={{ width: 200 }}>Milk Delivered</th>
                                <th style={{ width: 200 }}>Yogurt Delivered</th>
                            </tr>
                        </thead>
                    </Table>
                    {
                        this.state.con && this.state.customers.map((v, i) => {
                            return <Table key={i} striped bordered hover size="sm">
                                <tbody>
                                    <tr>
                                        <td style={{ width: 50 }}>{i + 1}</td>
                                        <td style={{ width: 200 }}>{v.name}</td>
                                        <td style={{ width: 200 }}>{v.mobile}</td>
                                        <td style={{ width: 200 }}>{v.milkQuantity}</td>
                                        <td style={{ width: 200 }}>{v.yogurtQuantity}</td>
                                        <td style={{ width: 200 }}><input type="checkbox" id={JSON.stringify(v)} name="milk" defaultChecked /></td>
                                        <td style={{ width: 200 }}><input type="checkbox" id={JSON.stringify(v)} name="yogurt" defaultChecked /></td>
                                    </tr>
                                </tbody>
                            </Table>
                        })
                    }
                    <Button variant="primary" onClick={() => this.checkWork()} disabled={!this.state.con}>Post</Button>
                    <Button style={{ marginLeft: 10 }} variant="primary" onClick={() => this.props.history.push("allCustomers")}>Go back to Dashboard</Button>
                    <Modal show={this.state.setShow} onHide={() => this.close()}>
                        <Modal.Header closeButton>
                            <Modal.Title>Alert</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Record updated</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.close()}>
                                OK
          </Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal show={this.state.setShow1} onHide={() => this.close1()}>
                        <Modal.Header closeButton>
                            <Modal.Title><b>Alert</b></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>You have already posted work for today</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.close1()}>OK</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div >
        );
    }
}

export default dailyWork;