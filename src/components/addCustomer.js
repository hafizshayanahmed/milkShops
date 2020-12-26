import React from 'react';
import Firebase from "../config/firebase";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Modal } from 'react-bootstrap';
import { Navbar, Nav, Col } from "react-bootstrap";
import "../css/furtherInfo.css"

class addCustomer extends React.Component {
    constructor() {
        super();
        this.state = {
            setShow: false,
            city: "",
            area: "",
            subArea: "",
            ID: "",
            yogurtRate: "",
            milkRate: "",
            pay: 0,
            advance: 0,
            name: "",
            mobile: "",
        }
    }

    mobile(e) {
        if (e !== undefined) {
            let mobile = e
            mobile = mobile.toString()
            this.setState({
                mobile
            }, () => {
                this.checkCondition()
            })
        }
        else {
            this.checkCondition()
        }
    }

    checkCondition() {
        if (this.state.mobile !== undefined) {
            if (this.state.mobile.length === 11) {
                this.setState({
                    mobileLength: false
                })
            }
            if (this.state.mobile.length < 11 || this.state.mobile.length > 11) {
                this.setState({
                    mobileLength: true
                })
            }
        }
        else {
            this.setState({
                mobileLength: true
            })
        }
    }

    checkConditionBalance(e) {
        if (e !== undefined) {
            if (e.toString() >= 0) {
                this.setState({
                    balanceCondition: false,
                    pay: e
                })
            }
            else if (e.toString().indexOf("-") !== -1) {
                this.setState({
                    balanceCondition: false,
                    pay: e
                })
            }
        }
        else {
            this.setState({
                balanceCondition: true
            })
        }
    }

    checkConditionAdvance(e) {
        if (e !== undefined) {
            if (e.toString() >= 0) {
                this.setState({
                    advanceCondition: false,
                    advance: e
                })
            }
            else if (e.toString().indexOf("-") !== -1) {
                this.setState({
                    advanceCondition: false,
                    advance: e
                })
            }
        }
        else {
            this.setState({
                advanceCondition: true
            })
        }
    }

    checkMilkPriceCondition(e) {
        if (e !== undefined) {
            if (e.toString() >= 0) {
                this.setState({
                    milkRateCondition: false,
                    milkRate: e
                })
            }
            if (e.toString() < 0 || e.toString() == -0) {
                this.setState({
                    milkRateCondition: true,
                    milkRate: e
                })
            }
        }
        else {
            this.setState({
                milkRateCondition: true
            })
        }
    }

    checkMilkQuantityCondition(e) {
        if (e !== undefined) {
            if (e.toString() >= 0) {
                this.setState({
                    milkQuantityCondition: false,
                    milkQuantity: e
                })
            }
            if (e.toString() < 0 || e.toString() == -0) {
                this.setState({
                    milkQuantityCondition: true,
                    milkQuantity: e
                })
            }
        }
        else {
            this.setState({
                milkQuantityCondition: true
            })
        }
    }

    checkYogurtPriceCondition(e) {
        if (e !== undefined) {
            if (e.toString() >= 0) {
                this.setState({
                    yogurtRateCondition: false,
                    yogurtRate: e
                })
            }
            if (e.toString() < 0 || e.toString() == -0) {
                this.setState({
                    yogurtRateCondition: true,
                    yogurtRate: e
                })
            }
        }
        else {
            this.setState({
                yogurtRateCondition: true
            })
        }
    }

    checkYogurtQuantityCondition(e) {
        if (e !== undefined) {
            if (e.toString() >= 0) {
                this.setState({
                    yogurtQuantityCondition: false,
                    yogurtQuantity: e
                })
            }
            if (e.toString() < 0 || e.toString() == "-0") {
                this.setState({
                    yogurtQuantityCondition: true,
                    yogurtQuantity: e
                })
            }
        }
        else {
            this.setState({
                yogurtQuantityCondition: true
            })
        }
    }

    funcAddCustomer() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        let mon = mm - 1

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        today = dd + '-' + mm + '-' + yyyy;
        today = today.toString()
        var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        var user = JSON.parse(localStorage.getItem("user"))
        let firebaseQuery = Firebase.database().ref().push()
        var newID = firebaseQuery.key
        let obj = {
            name: this.state.name,
            mobile: this.state.mobile,
            pay: (this.state.pay - this.state.advance) * -1,
            milkRate: this.state.milkRate,
            milkQuantity: this.state.milkQuantity,
            yogurtRate: this.state.yogurtRate,
            yogurtQuantity: this.state.yogurtQuantity,
            ID: newID,
            timeStamp: Firebase.database.ServerValue.TIMESTAMP,
            credit: this.state.advance,
            month: month[mon],
            date: today,
            opening: "Opening",
            city: this.state.city,
            area: this.state.area,
            subArea: this.state.subArea,
            previous: this.state.pay
        }
        let newObj = {
            name: this.state.name,
            mobile: this.state.mobile,
            ID: newID,
            pay: this.state.advance,
            date: new Date().toString(),
            timeStamp: Firebase.database.ServerValue.TIMESTAMP
        }
        if (this.state.mobile !== "" && !this.state.mobileLength && !this.state.balanceCondition && !this.state.milkQuantityCondition && !this.state.milkRateCondition && !this.state.yogurtRateCondition && !this.state.yogurtQuantityCondition) {
            Firebase.database().ref("customer/" + user.uid).child(newID).set(obj).then(() => {
                Firebase.database().ref("payments/" + user.uid).child(newID).set(newObj).then(() => {
                    Firebase.database().ref("dailyWork/" + user.uid).push([obj]).then(() => {
                        this.setState({
                            setShow: true
                        })
                    })
                })
            })
        }
        else {
            this.mobile(this.state.mobile)
            this.checkConditionBalance(this.state.pay)
            this.checkConditionBalance(this.state.advance)
            this.checkMilkPriceCondition(this.state.milkRate)
            this.checkMilkQuantityCondition(this.state.milkQuantity)
            this.checkYogurtPriceCondition(this.state.yogurtRate)
            this.checkYogurtQuantityCondition(this.state.yogurtQuantity)
        }
    }

    componentDidMount() {
        Firebase.database().ref("areas").on("value", (e) => {
            if (e.val()) {
                let values = Object.values(e.val());
                this.setState({
                    areaArr: values
                }, () => {
                    var additionalInfo = JSON.parse(localStorage.getItem("additionalInfo"))
                    this.setState({
                        city: additionalInfo.city,
                        area: additionalInfo.area,
                        subArea: additionalInfo.subArea,
                        milkRate: additionalInfo.milkRate,
                        yogurtRate: additionalInfo.yogurtRate
                    }, () => {
                        var subAreas = this.state.areaArr.filter((v, i) => {
                            return v.mainArea.toLowerCase() === additionalInfo.area.toLowerCase()
                        })
                        var subArea = subAreas.filter((ele, ind) => ind === subAreas.findIndex(elem => elem.subArea.toLowerCase() === ele.subArea.toLowerCase()))
                        this.setState({
                            subAreaArr: subArea,
                            subAreaCondition: true
                        })
                    })
                })
            }
        })
    }

    close() {
        this.setState({
            setShow: false,
            name: "",
            mobile: "",
            pay: 0,
            advance: 0,
            milkQuantity: "",
            yogurtQuantity: ""
        }, () => {
            this.props.history.push("allCustomers")
        })
    }

    render() {
        const navColor = {
            color: "#37A000"
        },
            nav = {
                width: "35%",
                marginLeft: "32%",
            }
        return (
            <div>
                <Navbar expand="lg"
                    style={{
                        backgroundColor: "white",
                        borderTop: "1px solid lightgrey",
                        borderBottom: "2px solid lightgrey",
                        boxShadow: "0 3px 3px -1px lightgray"
                    }}
                >
                    <Navbar.Brand>Milk Shops</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link style={navColor} onClick={() => this.props.history.push("allCustomers")} >Dashboard</Nav.Link>
                            <Nav.Link style={navColor} onClick={() => this.props.history.push("/addCustomer")} >Add Customer</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <div className="furtherInfo">
                    <h3>Add customer</h3>
                    <br />
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label><b>Name</b></Form.Label>
                            <Form.Control placeholder="e.g Mohammad Ahmed" type="text" onChange={(e) => this.setState({ name: e.target.value })} value={this.state.name} />
                        </Form.Group>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formBasicEmail">
                                <Form.Label><b>Mobile</b></Form.Label>
                                <Form.Control placeholder="e.g 03001234567" type="text" onChange={(e) => this.mobile(e.target.value)} value={this.state.mobile} />
                                {this.state.mobileLength ? <Form.Label style={{ color: "red" }}>Invalid mobile number</Form.Label> : ""}
                            </Form.Group>
                            <Form.Group as={Col} controlId="formBasicEmail">
                                <Form.Label><b>Opening</b></Form.Label>
                                <Form.Control type="text" onChange={(e) => this.checkConditionBalance(e.target.value)} value={this.state.pay} />
                                {this.state.balanceCondition ? <Form.Label style={{ color: "red" }}>Inavlid input</Form.Label> : ""}
                            </Form.Group>
                            <Form.Group as={Col} controlId="formBasicEmail">
                                <Form.Label><b>Advance</b></Form.Label>
                                <Form.Control type="text" onChange={(e) => this.checkConditionAdvance(e.target.value)} value={this.state.advance} />
                                {this.state.advanceCondition ? <Form.Label style={{ color: "red" }}>Inavlid input</Form.Label> : ""}
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridCity">
                                <Form.Label><b>City</b></Form.Label>
                                <Form.Control type="text" value={this.state.city} disabled={true} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridState">
                                <Form.Label><b>Area</b></Form.Label>
                                <Form.Control type="text" value={this.state.area} disabled={true} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridZip">
                                <Form.Label><b>Sub Area</b></Form.Label>
                                <Form.Control as="select" onChange={(event) => this.setState({ subArea: event.target.value })}>
                                    <option>Select Sub Area</option>
                                    {this.state.subAreaCondition && this.state.subAreaArr.map((v, i) => {
                                        return <option>{v.subArea}</option>
                                    })}
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridCity">
                                <Form.Label><b>Milk Price (PKR)</b></Form.Label>
                                <Form.Control type="text" onChange={(e) => this.checkMilkPriceCondition(e.target.value)} value={this.state.milkRate} />
                                {this.state.milkRateCondition ? <Form.Label style={{ color: "red" }}>Inavlid input</Form.Label> : ""}
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridState">
                                <Form.Label><b>Milk Qty (LITRE)</b></Form.Label>
                                <Form.Control type="text" onChange={(e) => this.checkMilkQuantityCondition(e.target.value)} value={this.state.milkQuantity} />
                                {this.state.milkQuantityCondition ? <Form.Label style={{ color: "red" }}>Inavlid input</Form.Label> : ""}
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridZip">
                                <Form.Label><b>Yogurt Price (PKR)</b></Form.Label>
                                <Form.Control type="text" onChange={(e) => this.checkYogurtPriceCondition(e.target.value)} value={this.state.yogurtRate} />
                                {this.state.yogurtRateCondition ? <Form.Label style={{ color: "red" }}>Inavlid input</Form.Label> : ""}
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridZip">
                                <Form.Label><b>Yogurt Qty (KG)</b></Form.Label>
                                <Form.Control type="text" onChange={(e) => this.checkYogurtQuantityCondition(e.target.value)} value={this.state.yogurtQuantity} />
                                {this.state.yogurtQuantityCondition ? <Form.Label style={{ color: "red" }}>Inavlid input</Form.Label> : ""}
                            </Form.Group>
                        </Form.Row>
                        <Button variant="primary" onClick={() => this.funcAddCustomer()}>Add customer</Button>
                        <Button style={{ marginLeft: 10 }} variant="primary" onClick={() => this.props.history.push("allCustomers")}>Dashboard</Button>
                    </Form>
                    <Modal show={this.state.setShow} onHide={() => this.close()}>
                        <Modal.Header closeButton>
                            <Modal.Title><b>Customer successfully added</b></Modal.Title>
                        </Modal.Header>
                        <Modal.Body><b>Customer Name: </b>{this.state.name}</Modal.Body>
                        <Modal.Body><b>Customer Mobile: </b>{this.state.mobile}</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.close()}>OK</Button>
                        </Modal.Footer>
                    </Modal>
                </div >
            </div>
        );
    }
}

export default addCustomer;