import React from 'react';
import { Form, Button, Col, Navbar, Nav, NavDropdown } from "react-bootstrap";
import Firebase from "../config/firebase";
import Background from '../images/cow.png';
import "../css/admin.css";

class admin extends React.Component {
    constructor() {
        super();
        this.state = {

        }
    }

    login() {
        Firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                this.props.history.push("/existingBlogs")
            })
            .catch(function (error) {
                var errorMessage = error.message;
                alert(errorMessage)
            });
    }

    render() {
        const topStyle = {
            fontWeight: "bold",
            fontSize: 24,
            textAlign: "center"
        },
            bgStyle = {
                width: "100wh",
                height: "100vh",
                backgroundImage: `url(${Background})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                opacity: 0.8,
            },
            navColor = {
                color: "#37A000"
            }
        return (
            <section style={bgStyle}>
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
                                <Nav.Link style={navColor} onClick={() => this.props.history.push("/blogs")} >Blogs</Nav.Link>
                                <Nav.Link style={navColor} onClick={() => this.props.history.push("/testimonials")} >Testimonials</Nav.Link>
                                <NavDropdown title={
                                    <span style={navColor}>Sign In</span>
                                } id="basic-nav-dropdown">
                                    <NavDropdown.Item style={navColor} onClick={() => this.props.history.push("/login")} >Sign in as Shopkeeper</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    <div className="loginDiv">
                        <Form>
                            <Form.Group as={Col} controlId="formGridEmail">
                                <p style={topStyle}>Administrator</p>
                            </Form.Group>
                            <Form.Group controlId="formGridEmail">
                                <Form.Label><b>Email</b></Form.Label>
                                <Form.Control type="email" placeholder="Enter email" onChange={(e) => this.setState({ email: e.target.value })} />
                            </Form.Group>

                            <Form.Group controlId="formGridPassword">
                                <Form.Label><b>Password</b></Form.Label>
                                <Form.Control type="password" placeholder="Password" onChange={(e) => this.setState({ password: e.target.value })} />
                            </Form.Group>
                            <br />
                            <Button onClick={() => this.login()} variant="primary">Login</Button>
                        </Form>
                    </div>
                </div >
            </section>
        );
    }
}

export default admin;