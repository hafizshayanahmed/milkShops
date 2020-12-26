import React from 'react';
import { Navbar, Nav, NavDropdown, Card, Button } from "react-bootstrap";
import Background from '../images/cow.png';
import Firebase from "../config/firebase"
import moment from "moment"
import "../css/blogs.css"

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
            width: "100wh",
            height: "100vh",
            backgroundImage: `url(${Background})`,
            opacity: 0.8,
            overflowY: 'auto',
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
                    <br />
                    {this.state.con ?
                        this.state.blogs
                            ?
                            this.state.blogs.map((v, i) => {
                                return v.status !== "inactive" &&
                                    <div className="blogDiv">
                                        <Card className="text-center">
                                            <Card.Header>Featured</Card.Header>
                                            <Card.Body>
                                                <Card.Img src={v.image} className="imageDiv" />
                                                <br />
                                                <br />
                                                <Card.Title>{v.title}</Card.Title>
                                                <Card.Text>
                                                    {v.content.slice(0, 30) + "..."}
                                                </Card.Text>
                                                <Button variant="primary" onClick={() => this.props.history.push("/blogInDetail", v)}>Read</Button>
                                            </Card.Body>
                                            <Card.Footer className="text-muted">{moment(v.timeStamp).fromNow()}</Card.Footer>
                                        </Card>
                                    </div>
                            })
                            :
                            <p style={{ color: "white" }}>No blogs available</p>
                        :
                        <p style={{ color: "black", textAlign: "center" }}>Loading</p>
                    }
                </div >
            </section>
        );
    }
}

export default blogs;
