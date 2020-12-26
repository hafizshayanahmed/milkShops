import React from 'react';
import { Form, Button, Col, Navbar, Nav, ListGroup } from "react-bootstrap";
import Firebase from "../config/firebase";
import "../css/area.css"

class addCity extends React.Component {
    constructor() {
        super();
        this.state = {
            city: "",
        }
    }

    save() {
        var data = this.state;
        let obj = {
            city: this.state.city,
        }
        if (data.city !== "") {
            Firebase.database().ref("city").push(obj).then(() => {
                alert("City has been added")
                this.setState({
                    city: "",
                })
            })
        }
        else {
            alert("Please add city")
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
        Firebase.database().ref("city").on("value", (e) => {
            if (e.val()) {
                this.setState({
                    cities: Object.values(e.val()),
                    con: true
                })
            }
            else {
                this.setState({
                    cities: [{ state: "No data to display" }],
                    con1: true,
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
            <div style={{ width: "100%" }}>
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
                        cursor: "pointer",
                        border: "1px solid lightgrey",
                        borderRight: "4px solid #37A000",
                        padding: 6,
                        fontWeight: "bold"
                    }}
                    // onClick={() => this.props.history.push("/existingBlogs")}
                    >
                        Cities
                </div>
                    <div style={{
                        color: "#37A000",
                        border: "1px solid lightgrey",
                        cursor: "pointer",
                        borderTop: "none",
                        padding: 6
                    }}
                        onClick={() => this.props.history.push("/addArea")}
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
                                <p style={topStyle}>Add City</p>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label><b>City</b></Form.Label>
                                <Form.Control type="text" onChange={(e) => this.setState({ city: e.target.value })} placeholder="City" value={this.state.city} />
                            </Form.Group>
                            <Button onClick={() => this.save()} variant="primary">Save</Button>
                        </Form>
                    </div>
                </div>
                <div className="style2" style={{ height: window.innerHeight * .838 }}>
                    <ListGroup as="ul">
                        <ListGroup.Item as="li" active>Cities</ListGroup.Item>
                        {this.state.con && this.state.cities.map((v, i) => {
                            return <ListGroup.Item as="li">{v.city}</ListGroup.Item>
                        })}
                        {this.state.con1 && this.state.cities.map((v, i) => {
                            return <ListGroup.Item as="li">{v.state}</ListGroup.Item>
                        })}
                    </ListGroup>
                </div>
            </div >
        );
    }
}

export default addCity;