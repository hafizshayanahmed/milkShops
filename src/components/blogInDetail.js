import React from 'react';
import { Navbar, Nav, NavDropdown, Card, Button } from "react-bootstrap";
import Background from '../images/cow.png';
import Firebase from "../config/firebase"
import moment from "moment"

class blogs extends React.Component {
    constructor() {
        super();
        this.state = {
            con: false
        }
    }

    componentDidMount() {
        Firebase.database().ref('blogs').on("value", (e) => {
            if (e.val()) {

                this.setState({
                    blogs: Object.values(e.val()),
                    con: true
                })
            }
            else {
                this.setState({
                    con: true
                })
            }
        })
    }

    render() {
        var bgStyle = {
            width: "100%",
            height: "100vh",
            opacity: 0.8,
        },
            navColor = {
                color: "#37A000"
            },
            nav = {
                width: "35%",
                marginLeft: "30%",
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
                                    <NavDropdown.Item style={navColor} onClick={() => this.props.history.push("/admin")} >Sign in as Administrator</NavDropdown.Item>
                                    <NavDropdown.Item style={navColor} onClick={() => this.props.history.push("/login")} >Sign in as Shopkeeper</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    <br />
                    <div style={{ width: "80%", height: 250, border: "1px solid black", margin: "0 auto", padding: 20 }}>
                        <p>Google Add area</p>
                    </div>
                    <div style={{ width: "65%", margin: 20, float: "left" }}>
                        <p style={{ fontSize: 48, fontWeight: "bold" }}>{this.props.location.state.title}</p>
                        <p>{moment(this.props.location.state.timeStamp).fromNow()}</p>
                        <br />
                        <br />
                        <img src={this.props.location.state.image} width="90%" height="400" />
                        <br />
                        <br />
                        <p style={{ fontSize: 20 }}>{this.props.location.state.content}</p>
                    </div>
                    <div style={{ width: "29%", height: 600, margin: 20, padding: 20, border: "1px solid black", float: "left" }}>
                        <p>Google Add area</p>
                    </div>
                </div >
            </section>
        );
    }
}

export default blogs;
