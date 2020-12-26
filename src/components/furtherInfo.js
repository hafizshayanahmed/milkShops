import React from 'react';
import Firebase from "../config/firebase";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Modal, Navbar, Nav, Col } from 'react-bootstrap';
import "../css/furtherInfo.css"

class furtherInfo extends React.Component {
    constructor() {
        super();
        this.state = {
            setShow: false,
            mobile: "",
            yogurtRate: "",
            milkRate: "",
            shopName: "",
            cityCondition: false,
            dashboardCheck: false
        }
    }

    firebaseQuery() {
        let obj = {
            mobile: this.state.mobile,
            city: this.state.localCity,
            area: this.state.localMainArea,
            subArea: this.state.localSubArea,
            milkRate: this.state.milkRate,
            yogurtRate: this.state.yogurtRate,
            shopName: this.state.shopName,
            timeStamp: Firebase.database.ServerValue.TIMESTAMP
        }
        console.log(this.state.mobile)
        console.log(this.state.mobileLength)
        console.log(this.state.milkRateCondition)
        console.log(this.state.yogurtRateCondition)
        if (this.state.mobile !== "" && !this.state.mobileLength && !this.state.milkRateCondition && !this.state.yogurtRateCondition) {

            Firebase.database().ref("additionalInfo/" + Firebase.auth().currentUser.uid).set(obj).then(() => {
                localStorage.setItem("additionalInfo", JSON.stringify(obj))
                this.setState({
                    setShow: true
                })
            })
        }
        else {
            this.checkCondition(this.state.mobile)
            this.checkMilkPriceCondition(this.state.milkRate)
            this.checkYogurtPriceCondition(this.state.yogurtRate)
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

    componentDidMount() {
        var user = JSON.parse(localStorage.getItem('user'));
        this.setState({
            user,
        })
        Firebase.database().ref("additionalInfo/" + user.uid).on("value", (e) => {
            if (e.val() !== null) {
                var val = e.val()
                this.setState({
                    shopName: val.shopName,
                    mobile: val.mobile,
                    localMainArea: val.area,
                    localSubArea: val.subArea,
                    localCity: val.city,
                    yogurtRate: val.yogurtRate,
                    milkRate: val.milkRate,
                    dashboardCheck: true
                }, () => {
                    this.checkCondition()
                })
            }
            else {
                this.setState({
                    dashboardCheck: false
                })
            }
        })
        Firebase.database().ref("areas").on("value", (e) => {
            let values = Object.values(e.val());
            var cities = values.filter((ele, ind) => ind === values.findIndex(elem => elem.city === ele.city))
            this.setState({
                city: cities,
                cityCondition: true,
                area: values
            })
        });
    }

    close() {
        this.setState({
            setShow: false
        })
    }

    forMainArea(evt) {
        var mainAreas = this.state.area.filter((v, i) => {
            return v.city === evt.target.value
        })

        var mainArea = mainAreas.filter((ele, ind) => ind === mainAreas.findIndex(elem => elem.mainArea === ele.mainArea))
        this.setState({
            mainArea: mainArea,
            localCity: evt.target.value,
            mainAreaCondition: true
        })
    }

    forSubArea(evt) {
        var subAreas = this.state.area.filter((v, i) => {
            return v.mainArea === evt.target.value
        })
        var subArea = subAreas.filter((ele, ind) => ind === subAreas.findIndex(elem => elem.subArea === ele.subArea))
        this.setState({
            subArea: subArea,
            localMainArea: evt.target.value,
            subAreaCondition: true
        })
    }

    subArea(evt) {
        this.setState({
            localSubArea: evt.target.value,
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
                            {this.state.dashboardCheck &&
                                <Nav.Link style={navColor} onClick={() => this.props.history.push("allCustomers")} >Dashboard</Nav.Link>
                            }
                            <Nav.Link style={navColor} onClick={() => this.props.history.push("/furtherInfo")} >Shop Setup</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <div className="furtherInfo">
                    <h3 style={{ textAlign: "center" }}>Shop Setup</h3>
                    <br />
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label><b>Shop Name</b></Form.Label>
                            <Form.Control type="text" onChange={(e) => this.setState({ shopName: e.target.value })} value={this.state.shopName} />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label><b>Mobile</b></Form.Label>
                            <Form.Control type="number" onChange={(e) => this.mobile(e.target.value)} value={this.state.mobile} />
                            {this.state.mobileLength ? <Form.Label style={{ color: "red" }}>Invalid mobile number</Form.Label> : ""}
                        </Form.Group>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label><b>Current City: </b></Form.Label>
                                <Form.Control value={this.state.localCity} disabled />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label><b>Current Area: </b></Form.Label>
                                <Form.Control value={this.state.localMainArea} disabled />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label><b>Current Sub Area: </b></Form.Label>
                                <Form.Control value={this.state.localSubArea} disabled />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="exampleForm.ControlSelect1">
                                <Form.Label><b>City</b></Form.Label>
                                <Form.Control as="select" onChange={(event) => this.forMainArea(event)}>
                                    <option>Select city</option>
                                    {this.state.cityCondition && this.state.city.map((v, i) => {
                                        return <option>{v.city}</option>
                                    })}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group as={Col} controlId="exampleForm.ControlSelect1">
                                <Form.Label><b>Area</b></Form.Label>
                                <Form.Control as="select" onChange={(event) => this.forSubArea(event)}>
                                    <option>Select area</option>
                                    {this.state.mainAreaCondition && this.state.mainArea.map((v, i) => {
                                        return <option>{v.mainArea}</option>
                                    })}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group as={Col} controlId="exampleForm.ControlSelect1">
                                <Form.Label><b>Sub Area</b></Form.Label>
                                <Form.Control as="select" onChange={(event) => this.subArea(event)}>
                                    <option>Select sub area</option>
                                    {this.state.subAreaCondition && this.state.subArea.map((v, i) => {
                                        return <option>{v.subArea}</option>
                                    })}
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formBasicPassword">
                                <Form.Label><b>Default Milk Rate in rupees per KG</b></Form.Label>
                                <Form.Control type="text" onChange={(e) => this.checkMilkPriceCondition(e.target.value)} value={this.state.milkRate} />
                                {this.state.milkRateCondition ? <Form.Label style={{ color: "red" }}>Inavlid input</Form.Label> : ""}
                            </Form.Group>
                            <Form.Group as={Col} controlId="formBasicPassword">
                                <Form.Label><b>Default Yogurt Rate in rupees per KG</b></Form.Label>
                                <Form.Control type="text" onChange={(e) => this.checkYogurtPriceCondition(e.target.value)} value={this.state.yogurtRate} />
                                {this.state.yogurtRateCondition ? <Form.Label style={{ color: "red" }}>Inavlid input</Form.Label> : ""}
                            </Form.Group>
                        </Form.Row>
                        <Button variant="primary" onClick={() => this.firebaseQuery()}>Submit</Button>
                        {this.state.dashboardCheck &&
                            <Button style={{ marginLeft: 10 }} variant="primary" onClick={() => this.props.history.push("allCustomers")}>Dashboard</Button>
                        }
                    </Form>
                    <Modal show={this.state.setShow} onHide={() => this.close()}>
                        <Modal.Header closeButton>
                            <Modal.Title><b>Alert</b></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Record updated</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.props.history.push("/allCustomers")}>GO</Button>
                        </Modal.Footer>
                    </Modal>
                </div >
            </div>
        );
    }
}

export default furtherInfo;
