import React from 'react';
import GoogleButton from 'react-google-button';
import Firebase from "../config/firebase";
import Background from '../images/cow.png';
import Fb from '../images/fb.png';
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import "../css/login.css";

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            statement: "By creating or loggin an account you're agreeing with our Terms & Conditions and Privacy Statement"
        }
    }

    signUp(router) {
        var provider = new Firebase.auth.GoogleAuthProvider();
        Firebase.auth().signInWithPopup(provider).then(function (result) {
            var user = result.user;
            var obj = {
                uid: user.uid,
                name: user.displayName,
                photo: user.photoURL,
                email: user.email
            }
            Firebase.database().ref("users/" + user.uid).set(obj).then(() => {
                localStorage.setItem('user', JSON.stringify(obj));
                Firebase.database().ref("additionalInfo/" + user.uid).on("value", (e) => {
                    if (e.val() !== null) {
                        localStorage.setItem("additionalInfo", JSON.stringify(e.val()))
                    }
                    e.val()
                        ?
                        router.push("/allCustomers")
                        :
                        router.push("/furtherInfo")
                })
            })
        })
    }

    fbsignin(router) {
        var provider = new Firebase.auth.FacebookAuthProvider();
        provider.setCustomParameters({
            'display': 'popup'
        });
        Firebase.auth().signInWithPopup(provider).then(function (result) {
            var user = result.user;
            var obj = {
                uid: user.uid,
                name: user.displayName,
                photo: user.photoURL,
                email: user.email
            }
            Firebase.database().ref("users/" + user.uid).set(obj).then(() => {
                localStorage.setItem('user', JSON.stringify(obj));
                Firebase.database().ref("additionalInfo/" + user.uid).on("value", (e) => {
                    if (e.val() !== null) {
                        localStorage.setItem("additionalInfo", JSON.stringify(e.val()))
                    }
                    e.val()
                        ?
                        router.push("/allCustomers")
                        :
                        router.push("/furtherInfo")
                })
            })
        })
    }

    render() {
        var bgStyle = {
            width: "100vw",
            height: "100vh",
            backgroundImage: `url(${Background})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            opacity: 0.8,
        },
            navColor = {
                color: "#37A000"
            }
        var router = this.props.history;
        return (
            <section style={bgStyle}>
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
                            <NavDropdown id="nav-dropdown" title={
                                <span style={navColor}>Sign In</span>
                            }>
                                <NavDropdown.Item style={navColor} onClick={() => this.props.history.push("/admin")} >Sign in as Administrator</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <div className="logDiv">
                    <h4>Milk Shops</h4>
                    <br />
                    <GoogleButton
                        style={{
                            width: "100%",
                        }}
                        onClick={() => {
                            this.signUp(router)
                        }}
                    />
                    <div style={{
                        marginTop: 5,
                        width: "100%",
                        height: 50,
                        border: "1px solid #3b5998",
                        boxShadow: "0 3px 3px -2px gray",
                        cursor: "pointer"
                    }}
                        onClick={() => this.fbsignin(router)}
                    >
                        <div style={{
                            width: 48,
                            backgroundColor: "white",
                            float: "left",
                            height: 48,
                        }}>
                            <img src={Fb} width="50" height="50" />
                        </div>
                        <div style={{
                            width: "100%",
                            height: 48,
                            backgroundColor: "#3b5998"
                        }}>
                            <p style={{
                                color: "white",
                                textAlign: "center",
                                paddingTop: 11
                            }}>Sign in with Facebook</p>
                        </div>
                    </div>
                    <p style={{
                        fontSize: 12,
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 90
                    }}>{this.state.statement}</p>
                </div>
            </section >
        );
    }
}

export default Login;
