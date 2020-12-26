import React from 'react';
import { Form, Button, Col, Navbar, Nav, Modal } from "react-bootstrap";
import Firebase from "../config/firebase";
import "../css/existingBlogs.css"

class existingBlogs extends React.Component {
    constructor() {
        super();
        this.state = {
            setShow: false,
            setShow1: false,
            saveEditID: ""
        }
    }

    addBlog() {
        let details = this.state
        let obj = {
            title: details.title,
            content: details.content,
            timeStamp: Firebase.database.ServerValue.TIMESTAMP,
            category: details.category
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
                        }).then(() => {
                            if (this.state.title && this.state.content && this.state.category) {
                                Firebase.database().ref("blogs").push(obj).then(() => {
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

    componentDidMount() {
        Firebase.database().ref("blogs").on("value", (e) => {
            if (e.val()) {
                this.setState({
                    blogs: Object.values(e.val()),
                    con: true
                })
            }
        })
    }

    hide(prop) {
        Firebase.database().ref("blogs/" + prop).child("status").set("inactive").then(() => {
            alert("Blog status has been set to inactive")
        })
            .catch((err) => {
                alert(err.message)
            })
    }

    show(prop) {
        Firebase.database().ref("blogs/" + prop).child("status").set("active").then(() => {
            alert("Blog status has been set to active.")
        })
            .catch((err) => {
                alert(err.message)
            })
    }

    edit(prop) {
        this.setState({
            setShow: true,
            title: prop.title,
            content: prop.content,
            saveEditID: prop.id
        })
    }

    close() {
        this.setState({
            setShow: false
        })
    }

    saveEdit() {
        Firebase.database().ref("blogs/" + this.state.saveEditID).child("title").set(this.state.title).then(() => {
            Firebase.database().ref("blogs/" + this.state.saveEditID).child("content").set(this.state.content).then(() => {
                alert("Blog has been updated.")
                this.close()
            })
                .catch((err) => {
                    alert(err.message)
                })
        })
            .catch((err) => {
                alert(err.message)
            })
    }

    picEdit(prop) {
        this.setState({
            setShow1: true,
            picEditID: prop
        })
    }

    picUpload() {
        var storage = Firebase.storage().ref().child(`blogPicture/${this.state.picEditID}`);
        storage.put(this.state.newBlogPicture)
            .then((url) => {
                url.ref.getDownloadURL()
                    .then((refurl) => {
                        Firebase.database().ref("blogs/" + this.state.picEditID).child("image").set(refurl).then(() => {
                            alert("Picture updated")
                        })
                            .catch((err) => {
                                alert(err.message)
                            })
                    })
            })
    }

    close1() {
        this.setState({
            setShow1: false
        })
    }

    render() {
        const style = {
            width: "60%",
            minWidth: 500,
            border: "1px solid lightgrey",
            margin: "25px auto",
            height: 30
        },
            style1 = {
                width: 200,
                minWidth: 150,
                margin: "25px 0px 0px 20px",
                float: "left",
                textAlign: "center",
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
                        borderRight: "4px solid #37A000",
                        padding: 6,
                        fontWeight: "bold"
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
                        padding: 6
                    }}
                        onClick={() => this.props.history.push("/addBlogs")}
                    >
                        Add Blog
                </div>
                </div>
                {this.state.con && this.state.blogs.map((v, i) => {
                    console.log(v.status)
                    return <div className="formDiv">
                        <span className="sNo">{i + 1}</span>
                        <span className="title">{v.title}</span>
                        <span className="content">{v.content.slice(0, 60) + "...."}</span>
                        <a onClick={() => this.edit(v)}>
                            <span className="option">Edit</span>
                        </a>
                        {v.status === "active" || v.status === undefined
                            ?
                            <a onClick={() => this.hide(v.id)}>
                                <span className="option">Hide</span>
                            </a>
                            :
                            <a onClick={() => this.show(v.id)}>
                                <span className="option">Show</span>
                            </a>
                        }
                        <a onClick={() => this.picEdit(v.id)}>
                            <span className="blogPicOption">Change Blog Picture</span>
                        </a>
                    </div>
                })}
                <Modal show={this.state.setShow} onHide={() => this.close()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Blog</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label><b>Title</b></Form.Label>
                                <Form.Control type="text" onChange={(e) => this.setState({ title: e.target.value })} value={this.state.title} />
                            </Form.Group>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formBasicEmail">
                                    <Form.Label><b>Content</b></Form.Label>
                                    <Form.Control as="textarea" rows="5" onChange={(e) => this.setState({ content: e.target.value })} value={this.state.content} />
                                </Form.Group>
                            </Form.Row>
                            <Button variant="primary" onClick={() => this.saveEdit()}>Save</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.setShow1} onHide={() => this.close1()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Picture</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Blog Image</Form.Label>
                                <Form.Control type="file" onChange={(e) => this.setState({ newBlogPicture: e.target.files[0] })} />
                            </Form.Group>
                            <Button variant="primary" onClick={() => this.picUpload()}>Save</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div >
        );
    }
}

export default existingBlogs;