import React from 'react';
import { Form, Button, Col, Navbar, Nav, ListGroup } from "react-bootstrap";
import Firebase from "../config/firebase";
import "../css/area.css"

class addArea extends React.Component {
    constructor() {
        super();
        this.state = {
            city: "",
            area: "",
            cityCondition: false,
            con: false,
            conn: false,
            con1: false,
            conn1: false
        }
    }

    save() {
        var data = this.state;
        let obj = {
            city: data.city,
            area: data.area,
        }
        if (data.city !== "" && data.area !== "") {
            Firebase.database().ref("area").push(obj).then(() => {
                alert("Area has been added")
                this.setState({
                    area: "",
                })
                this.fetch()
            })
        }
        else {
            alert("Please add area")
        }
    }

    logout() {
        Firebase.auth().signOut().then(e => {
            this.props.history.push("/admin")
        })
            .catch(e => {
                alert(e.message);
            })
    };

    componentDidMount() {
        this.fetch()
    }

    fetch() {
        Firebase.database().ref("city").on("value", (e) => {
            if (e.val()) {
                this.setState({
                    cities: Object.values(e.val()),
                    cityCondition: true,
                    con: true
                })
            }
            else {
                this.setState({
                    cities: [{ state: "No data to display" }],
                    con1: true,
                    con: false
                })
            }
        })
        Firebase.database().ref("area").on("value", (e) => {
            if (e.val()) {
                this.setState({
                    areas: Object.values(e.val()),
                    conn: true
                })
            }
            else {
                this.setState({
                    areas: [{ state: "No data to display" }],
                    conn1: true,
                    conn: false
                })
            }
        })
    }

    render() {
        const topStyle = {
            fontWeight: "bold",
            fontSize: 24,
            textAlign: "center"
        },
            navColor = {
                color: "#37A000"
            }
        return (
            <div className="App">
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
                            <Nav.Link style={navColor} onClick={() => this.props.history.push("existingBlogs")}>Blogs</Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link style={navColor} onClick={() => this.logout()} >Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <div className="style1">
                    <div style={{
                        color: "#37A000",
                        border: "1px solid lightgrey",
                        cursor: "pointer",
                        padding: 6
                    }}
                        onClick={() => this.props.history.push("/addCity")}
                    >
                        Cities
                </div>
                    <div style={{
                        color: "#37A000",
                        cursor: "pointer",
                        border: "1px solid lightgrey",
                        borderRight: "4px solid #37A000",
                        padding: 6,
                        fontWeight: "bold",
                        borderTop: "none",
                    }}
                    // onClick={() => this.props.history.push("/addBlogs")}
                    >
                        Areas
                </div>
                    <div style={{
                        color: "#37A000",
                        border: "1px solid lightgrey",
                        cursor: "pointer",
                        borderTop: "none",
                        padding: 6
                    }}
                        onClick={() => this.props.history.push("/addSubArea")}
                    >
                        Sub Areas
                </div>
                </div>
                <div className="style">
                    <div className="style3">
                        <Form>
                            <Form.Group as={Col} controlId="formGridEmail">
                                <p style={topStyle}>Add Area</p>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label><b>City</b></Form.Label>
                                <Form.Control as="select" onChange={(event) => this.setState({ city: event.target.value })}>
                                    <option>Select City</option>
                                    {this.state.cityCondition && this.state.cities.map((v, i) => {
                                        return <option>{v.city}</option>
                                    })}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label><b>Area</b></Form.Label>
                                <Form.Control type="text" onChange={(e) => this.setState({ area: e.target.value })} placeholder="Area" value={this.state.area} />
                            </Form.Group>
                            <Button onClick={() => this.save()} variant="primary">Save</Button>
                        </Form>
                    </div>
                </div>
                <div className="style2" style={{ height: window.innerHeight * .833 }}>
                    <ListGroup as="ul">
                        <ListGroup.Item as="li" active>Cities</ListGroup.Item>
                        {this.state.con && this.state.cities.map((v, i) => {
                            return <ListGroup.Item as="li">{v.city}</ListGroup.Item>
                        })}
                        {this.state.con1 && this.state.cities.map((v, i) => {
                            return <ListGroup.Item as="li">{v.state}</ListGroup.Item>
                        })}
                    </ListGroup>
                    <ListGroup as="ul" style={{ marginTop: 25 }}>
                        <ListGroup.Item as="li" active>Areas</ListGroup.Item>
                        {this.state.conn && this.state.areas.map((v, i) => {
                            return <ListGroup.Item as="li">{v.area}</ListGroup.Item>
                        })}
                        {this.state.conn1 && this.state.areas.map((v, i) => {
                            return <ListGroup.Item as="li">{v.state}</ListGroup.Item>
                        })}
                    </ListGroup>
                </div>
            </div >
        );
    }
}

export default addArea;