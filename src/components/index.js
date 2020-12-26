import React from 'react';
import { Navbar, Nav, Button, NavDropdown } from "react-bootstrap";
import Background from '../images/cow.png';

class index extends React.Component {
    constructor() {
        super();
        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        var bgStyle = {
            width: "100wh",
            height: "100vh",
            backgroundImage: `url(${Background})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            opacity: 0.8,
        },
            nav = {
                width: "35%",
                marginLeft: "30%",
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
                                    <NavDropdown.Item style={navColor} onClick={() => this.props.history.push("/admin")} >Sign in as Administrator</NavDropdown.Item>
                                    <NavDropdown.Item style={navColor} onClick={() => this.props.history.push("/login")} >Sign in as Shopkeeper</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    <div style={{ margin: "200px auto", width: 203 }}>
                        <Button style={{
                            borderRadius: 30,
                        }} onClick={() => this.props.history.push("/login")} variant="primary" size="lg">Continue in system</Button>
                    </div>
                </div >
            </section >
        );
    }
}

export default index;
