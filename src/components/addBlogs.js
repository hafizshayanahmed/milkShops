import React from 'react';
import { Form, Button, Col, Navbar, Nav } from "react-bootstrap";
import Firebase from "../config/firebase";
import "../css/addBlogs.css"

class addBlogs extends React.Component {
    constructor() {
        super();
        this.state = {

        }
    }

    addBlog() {
        let details = this.state
        let obj = {
            title: details.title,
            content: details.content,
            timeStamp: Firebase.database.ServerValue.TIMESTAMP,
            category: details.category,
            status: "active"
        }
        let firebaseQuery = Firebase.database().ref().push()
        var newID = firebaseQuery.key
        var storage = Firebase.storage().ref().child(`blogPicture/${newID}`);
        if (this.state.blogPicture) {
            storage.put(this.state.blogPicture)
                .then((url) => {
                    url.ref.getDownloadURL()
                        .then((refurl) => {
                            obj.image = refurl;
                            obj.id = newID
                        }).then(() => {
                            if (this.state.title && this.state.content && this.state.category) {
                                Firebase.database().ref("blogs").child(newID).set(obj).then(() => {
                                    alert("Blog Added")
                                })
                                    .catch((err) => {
                                        alert(err.message)
                                    })
                            }
                            else {
                                alert("Please add complete information")
                            }
                        })
                })
                .catch((err) => {
                    alert(err.message)
                })
        }
        else {
            alert("Please add blog picture")
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
                            <Nav.Link style={navColor} onClick={() => this.props.history.push("/addCity")} >Add Area</Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link style={navColor} onClick={() => this.logout()} >Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <div className="navDiv">
                    <div style={{
                        color: "#37A000",
                        cursor: "pointer",
                        border: "1px solid lightgrey",
                        padding: 6
                    }}
                        onClick={() => this.props.history.push("/existingBlogs")}
                    >
                        Blogs
                </div>
                    <div style={{
                        color: "#37A000",
                        border: "1px solid lightgrey",
                        cursor: "pointer",
                        borderTop: "none",
                        padding: 6,
                        borderRight: "4px solid #37A000",
                        fontWeight: "bold"
                    }}
                        onClick={() => this.props.history.push("/addBlogs")}
                    >
                        Add Blog
                </div>
                </div>
                <div className="formDiv">
                    <Form>
                        <Form.Group as={Col} controlId="formGridEmail">
                            <p style={topStyle}>Add Blog</p>
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter title of blog" onChange={(e) => this.setState({ title: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Blog Content</Form.Label>
                            <Form.Control as="textarea" rows="3" onChange={(e) => this.setState({ content: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Blog Type</Form.Label>
                            <Form.Control type="text" placeholder="Category" onChange={(e) => this.setState({ category: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Blog Image</Form.Label>
                            <Form.Control type="file" onChange={(e) => this.setState({ blogPicture: e.target.files[0] })} />
                        </Form.Group>
                        <Button onClick={() => this.addBlog()} variant="primary">Add Blog</Button>
                    </Form>
                </div>
            </div >
        );
    }
}

export default addBlogs;