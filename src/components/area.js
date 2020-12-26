import React from 'react';
import Firebase from "../config/firebase"
import { Form, Button, Col, Navbar, Nav, NavDropdown } from "react-bootstrap";

class bill extends React.Component {
    constructor() {
        super();
        this.state = {
            city: "",
            mainArea: "",
            subArea: ""
        }
    }

    save() {
        var data = this.state;
        let obj = {
            city: this.state.city,
            mainArea: this.state.mainArea,
            subArea: this.state.subArea,
        }
        if (data.city !== "" && data.mainArea !== "" && data.subArea !== "") {
            Firebase.database().ref("areas").push(obj).then(() => {
                alert("posted")
                this.setState({
                    city: "",
                    mainArea: "",
                    subArea: ""
                })
            })
        }
        else {
            alert("Please add complete information")
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

    render() {
        const style = {
            width: "30%",
            minWidth: 300,
            border: "1px solid lightgrey",
            padding: 20,
            margin: "25px auto"
        },
            topStyle = {
                fontWeight: "bold",
                fontSize: 24,
                textAlign: "center"
            },
            navColor = {
                color: "#37A000"
            }
        return (
            <div className="App">
                <Navbar style={{
                    backgroundColor: "white",
                    borderTop: "1px solid lightgrey",
                    borderBottom: "2px solid lightgrey",
                    boxShadow: "0 3px 3px -1px lightgray"
                }}>
                    <Navbar.Brand>
                        <Nav.Link>Milk Shops</Nav.Link>
                    </Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link style={navColor} onClick={() => this.props.history.push("/addBlogs")} >Add Blog</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link style={navColor} onClick={() => this.logout()} >Logout</Nav.Link>
                    </Nav>
                </Navbar>
                <div style={style}>
                    <Form>
                        <Form.Group as={Col} controlId="formGridEmail">
                            <p style={topStyle}>Add Area</p>
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>City</Form.Label>
                            <Form.Control type="text" onChange={(e) => this.setState({ city: e.target.value })} placeholder="City" value={this.state.city} />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Area</Form.Label>
                            <Form.Control type="text" onChange={(e) => this.setState({ mainArea: e.target.value })} placeholder="Main Area" value={this.state.mainArea} />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Sub Area</Form.Label>
                            <Form.Control type="text" onChange={(e) => this.setState({ subArea: e.target.value })} placeholder="Sub Area" value={this.state.subArea} />
                        </Form.Group>
                        <Button onClick={() => this.save()} variant="primary">Save</Button>
                    </Form>
                </div>
            </div >
        );
    }
}

export default bill;
