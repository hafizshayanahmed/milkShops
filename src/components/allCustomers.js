import React from 'react';
import Firebase from "../config/firebase";
import "../App.css";
import AddCustomer from "../images/addCustomer.png"
import Writing from "../images/writing.png"
import Pencil from "../images/pencil.png"
import { Navbar, Nav, Form, Button, Modal, Col } from "react-bootstrap";

class AllCustomers extends React.Component {
    constructor() {
        super();
        this.state = {
            con: false,
            isCurrentUser: false,
            filter: ["dummy"],
            text: "",
            open: false,
            conn: false,
            open1: false,
            dailyWorkCondition: false,
            setShow: false
        }
    }

    componentDidMount() {
        this.initial()
    }

    initial() {
        Firebase.database().ref("areas").on("value", (e) => {
            if (e.val()) {
                let values = Object.values(e.val());
                this.setState({
                    areaArr: values
                })
            }
            else {
                this.setState({
                    areaArr: []
                })
            }
        })
        setTimeout(() => {
            var uniqueArr = []
            var user = JSON.parse(localStorage.getItem("user"))
            var additionalInfo = JSON.parse(localStorage.getItem("additionalInfo"))
            Firebase.database().ref("customer/" + user.uid).once("value").then((e) => {
                if (e.val() !== null) {
                    let val = e.val()
                    let values = Object.values(val)
                    this.setState({
                        values,
                        con: true,
                        user,
                        conn: true,
                        additionalInfo,
                    }, () => {
                        var subAreas = this.state.areaArr.filter((v, i) => {
                            return v.mainArea === additionalInfo.area
                        })
                        var subArea = subAreas.filter((ele, ind) => ind === subAreas.findIndex(elem => elem.subArea === ele.subArea))
                        this.setState({
                            subAreaArr: subArea,
                            subAreaCondition: true
                        })
                        Firebase.database().ref("dailyWork/" + user.uid).once("value").then((e) => {
                            if (e.val() !== null) {
                                let val = e.val()
                                let object = Object.values(val)
                                let bulkArr = []
                                for (var key in object) {
                                    for (var key1 in object[key]) {
                                        bulkArr.push(object[key][key1])
                                    }
                                }
                                var sortedArr = bulkArr.sort(function (x, y) {
                                    return y.timeStamp - x.timeStamp;
                                })
                                var filteredArr = sortedArr.filter((ele, ind) => ind === sortedArr.findIndex(elem => elem.ID === ele.ID))
                                this.setState({
                                    filteredArr: filteredArr,
                                }, () => {
                                    if (e.val()) {
                                        var customerList = this.state.values
                                        var balanceList = this.state.filteredArr
                                        for (var i = 0; i < customerList.length; i++) {
                                            for (var j = 0; j < balanceList.length; j++) {
                                                if (customerList[i].ID === balanceList[j].ID) {
                                                    customerList[i].pay = balanceList[j].pay
                                                    uniqueArr.push(customerList[i])
                                                }
                                            }
                                        }
                                        this.setState({
                                            values: uniqueArr
                                        })
                                    }
                                })
                            }
                        })
                    })
                }
                else {
                    this.setState({
                        noCustomer: "You don't have a customer in system yet.",
                        user,
                        additionalInfo,
                        conn: true
                    }, () => {
                        var subAreas = this.state.areaArr.filter((v, i) => {
                            return v.mainArea === additionalInfo.area
                        })
                        var subArea = subAreas.filter((ele, ind) => ind === subAreas.findIndex(elem => elem.subArea === ele.subArea))
                        this.setState({
                            subAreaArr: subArea,
                            subAreaCondition: true
                        })
                    })
                }
            })
        }, 2000);
    }

    getInfo(prop) {
        var arr = []
        var flag = false
        var user = JSON.parse(localStorage.getItem("user"))
        Firebase.database().ref("dailyWork/" + user.uid).on("value", (e) => {
            if (e.val() !== null) {
                let val = e.val()
                let object = Object.values(val)
                for (var key in object) {
                    for (var key1 in object[key]) {
                        if (prop === object[key][key1].ID) {
                            flag = true
                            arr.push(object[key][key1])
                            this.setState({
                                arr,
                                isCurrentUser: true,
                                dailyWorkCondition: false
                            })
                            break;
                        }
                    }
                    if (flag === false) {
                        this.setState({
                            dailyWork: "You have not posted any work for this particular customer.",
                            dailyWorkCondition: true,
                            isCurrentUser: false,
                            arr: [],
                        })
                    }
                }
            }
            else {
                this.setState({
                    dailyWork: "You have not posted any work.",
                    dailyWorkCondition: true,
                    isCurrentUser: false,
                    arr: [],
                })
            }
        })
    }

    search(prop) {
        var text = prop.target.value;
        text = text.toLowerCase()
        if (this.state.values) {
            const filter = this.state.values.filter((e) => {
                return e.name.toLowerCase().indexOf(text) !== -1
            })

            this.setState({
                filter,
                text,
            })
        }
    }

    onMouseOverStudent(prop, prop1) {
        if (prop1 === "allList") {
            document.getElementById("list" + prop).style.backgroundColor = "rgb(250, 250, 250)";
        }
        if (prop1 === "filterList") {
            document.getElementById("new" + prop).style.backgroundColor = "rgb(250, 250, 250)";
        }
    }

    onClickCustomers(prop, prop1) {
        if (prop1 === "allList") {
            for (var i = 0; i < this.state.values.length; i++) {
                if (prop === this.state.values[i].ID) {
                    document.getElementById("list" + this.state.values[i].ID).style.borderRight = "4px solid rgb(0,255,0)";
                }
                else if (prop !== this.state.values[i].ID) {
                    document.getElementById("list" + this.state.values[i].ID).style.borderRight = "none";
                }
            }
        }
        if (prop1 === "filterList") {
            for (var i = 0; i < this.state.filter.length; i++) {
                if (prop === this.state.filter[i].ID) {
                    document.getElementById("new" + this.state.filter[i].ID).style.borderRight = "4px solid rgb(0,255,0)";
                }
                else if (prop !== this.state.filter[i].ID) {
                    document.getElementById("new" + this.state.filter[i].ID).style.borderRight = "none";
                }
            }
        }
    }

    onMouseOut(prop, prop1) {
        if (prop1 === "allList") {
            document.getElementById("list" + prop).style.backgroundColor = "white";
        }
        if (prop1 === "filterList") {
            document.getElementById("new" + prop).style.backgroundColor = "white";
        }
    }

    handleClick = () => {
        this.setState({
            open: true
        })
    };

    handleClose = () => {
        this.setState({
            open: false
        })
    };

    handleClick1 = () => {
        this.setState({
            open1: true
        })
    };

    handleClose1 = () => {
        this.setState({
            open1: false
        })
    };

    close() {
        this.setState({
            setShow: false
        })
    }

    logout() {
        Firebase.auth().signOut().then(e => {
            localStorage.setItem("user", JSON.stringify("null"));
            localStorage.setItem("additionalInfo", JSON.stringify("null"));
            this.props.history.push("/login")
        })
            .catch(e => {
                alert(e.message);
            })
    };

    saveEditInfo() {
        var newpay = 0
        for (var i = 0; i < this.state.values.length; i++) {
            if (this.state.values[i].ID === this.state.newID) {
                newpay = this.state.values[i].pay
            }
        }
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        today = dd + '-' + mm + '-' + yyyy;
        today = today.toString()
        var user = JSON.parse(localStorage.getItem("user"))
        var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        let obj = {
            name: this.state.newname,
            mobile: this.state.newmobile,
            pay: newpay,
            milkRate: this.state.newmilkRate,
            milkQuantity: this.state.newmilkQuantity,
            yogurtRate: this.state.newyogurtRate,
            yogurtQuantity: this.state.newyogurtQuantity,
            ID: this.state.newID,
            timeStamp: Firebase.database.ServerValue.TIMESTAMP,
            credit: 0,
            month: month[new Date().getMonth()],
            date: today,
            opening: "edit",
            city: this.state.additionalInfo.city,
            area: this.state.additionalInfo.area,
            subArea: this.state.subArea,
        }
        console.log(obj)
        Firebase.database().ref("customer/" + user.uid).child(this.state.newID).set(obj).then(() => {
            Firebase.database().ref("dailyWork/" + user.uid).push([obj]).then(() => {
                this.setState({
                    setShow: false
                }, () => {
                    alert("Details Updated.")
                    this.initial()
                })
            })
        })
    }

    filter() {
        // let filter = this.state.arr.filter((v, i) => {
        //     return v.month.toLowerCase() === this.state.filterMonth.toLowerCase()
        // })
        // this.setState({ arr: filter })
    }

    render() {
        const headerBar = {
            height: 49,
            backgroundColor: "rgb(238, 238, 238)",
            textAlign: "center"
        },
            searchBar = {
                height: 47,
                backgroundColor: "rgb(245, 245, 245)",
                textAlign: "center",
                paddingTop: 6
            },
            input = {
                width: "95%",
                borderColor: "lightgrey",
                borderRadius: 30,
                border: "none",
                height: 35,
                paddingLeft: 10
            },
            selectStyle = {
                width: 200,
                height: 30,
                border: "none",
                borderRadius: 4,
                boxShadow: "5px 5px 5px #dadadd",
            },
            btn = {
                color: "grey",
                backgroundCcolor: "rgba(211, 211, 211, 0.507)",
                border: "none",
                borderRadius: 4,
                width: 65,
                height: 30,
                boxShadow: "5px 5px 5px #dadadd",
                fontWeight: "bold",
            },
            nav = {
                width: "35%",
                marginLeft: "23%",
            },
            navColor = {
                color: "#37A000"
            }
            console.log(this.state)
        return (
            <div className="mainDiv">
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
                            <Nav.Link style={navColor}>Print Monthly Bills</Nav.Link>
                            <Nav.Link style={navColor} onClick={() => this.props.history.push("/addPayment")} >Add Receipt</Nav.Link>
                            <Nav.Link style={navColor} onClick={() => this.props.history.push("/furtherInfo")} >Shop Setup</Nav.Link>
                            <Nav.Link style={navColor} onClick={() => this.logout()} >Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <div style={{ margin: 10 }}>
                    <div className="listDiv">
                        <div className="header" style={headerBar}>
                            <img src={Writing} width="25" height="25" style={{ marginTop: 0, cursor: "pointer" }} onClick={() => this.props.history.push("dailyWork")} />
                            <span style={{ padding: "11px 30px 0 30px", display: "inline-block" }}>
                                <b>{this.state.conn && this.state.additionalInfo.shopName.toUpperCase()}</b>
                            </span>
                            <img src={AddCustomer} width="25" height="25" style={{ marginTop: 0, cursor: "pointer" }} onClick={() => this.props.history.push("addCustomer")} />
                            <div style={{ width: 90, float: "right" }}>
                            </div>
                        </div>
                        <div className="searchBar" style={searchBar}>
                            <input placeholder="Enter keyword to search" onChange={(e) => this.search(e)} style={input} /><br />
                        </div>
                        {this.state.conn && this.state.noCustomer}
                        <div style={{ overflowY: "auto", height: window.innerHeight * .73 }}>
                            {
                                this.state.filter.length
                                    ?
                                    this.state.text.length
                                        ?
                                        this.state.filter.map((v, i) => {
                                            return <div id={"new" + v.ID}
                                                onMouseOver={() => this.onMouseOverStudent(v.ID, "filterList")}
                                                onMouseOut={() => this.onMouseOut(v.ID, "filterList")}
                                                onClick={() => this.onClickCustomers(v.ID, "filterList")}
                                                style={{
                                                    borderBottom: "1px solid lightgrey",
                                                    padding: 5,
                                                    width: "100%",
                                                    float: "left",
                                                    paddingTop: 15,
                                                    overflowY: "auto",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "98%",
                                                        float: "left",
                                                    }}
                                                    onClick={() => this.getInfo(v.ID)}
                                                >
                                                    <p style={{ lineHeight: 1 }}>
                                                        <span>{v.name}</span>
                                                        <span style={{ float: "right" }}>Balance</span>
                                                    </p>
                                                    <p style={{ lineHeight: 1 }}>
                                                        <span>{v.mobile}</span>
                                                        <span style={{ float: "right" }}>{parseFloat(v.pay * -1).toFixed(2)}</span>
                                                    </p>
                                                </div>
                                                <div style={{
                                                    padding: 5,
                                                    width: "5%",
                                                    float: "left"

                                                }}>
                                                    <img src={Pencil} width="15" height="15" style={{ marginTop: 0, cursor: "pointer" }} onClick={() => this.setState({
                                                        setShow: true,
                                                        newID: v.ID,
                                                        newname: v.name,
                                                        newmobile: v.mobile,
                                                        newmilkRate: v.milkRate,
                                                        newmilkQuantity: v.milkQuantity,
                                                        newyogurtRate: v.yogurtRate,
                                                        newyogurtQuantity: v.yogurtQuantity,
                                                        isEditUser: true,
                                                        subArea: v.subArea
                                                    })} />
                                                </div>
                                            </div>
                                        })
                                        :
                                        this.state.con && this.state.values.map((v, i) => {
                                            return <div id={"list" + v.ID}
                                                onMouseOver={() => this.onMouseOverStudent(v.ID, "allList")}
                                                onMouseOut={() => this.onMouseOut(v.ID, "allList")}
                                                onClick={() => this.onClickCustomers(v.ID, "allList")}
                                                style={{
                                                    borderBottom: "1px solid lightgrey",
                                                    padding: 5,
                                                    width: "100%",
                                                    float: "left",
                                                    paddingTop: 15,
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "98%",
                                                        float: "left",
                                                    }}
                                                    onClick={() => this.getInfo(v.ID)}
                                                >
                                                    <p style={{ lineHeight: 1 }}>
                                                        <span>{v.name}</span>
                                                        <span style={{ float: "right" }}>Balance</span>
                                                    </p>
                                                    <p style={{ lineHeight: 1 }}>
                                                        <span>{v.mobile}</span>
                                                        <span style={{ float: "right" }}>{parseFloat(v.pay * -1).toFixed(2)}</span>
                                                    </p>
                                                </div>
                                                <div style={{
                                                    padding: 5,
                                                    width: "5%",
                                                    float: "left"

                                                }}>
                                                    <img src={Pencil} width="15" height="15" style={{ marginTop: 0, cursor: "pointer" }} onClick={() => this.setState({
                                                        setShow: true,
                                                        newID: v.ID,
                                                        newname: v.name,
                                                        newmobile: v.mobile,
                                                        newmilkRate: v.milkRate,
                                                        newmilkQuantity: v.milkQuantity,
                                                        newyogurtRate: v.yogurtRate,
                                                        newyogurtQuantity: v.yogurtQuantity,
                                                        isEditUser: true,
                                                        subArea: v.subArea
                                                    })} />
                                                </div>
                                            </div>
                                        })
                                    :
                                    <p>No result found</p>
                            }
                        </div>
                    </div>
                    <div className="detailedDiv">
                        {this.state.dailyWorkCondition ? <p style={{ textAlign: "center" }}>{this.state.dailyWork}</p> : ""}
                        {this.state.isCurrentUser &&
                            <div>
                                <div style={{ width: "100%", height: 49, backgroundColor: "rgb(238, 238, 238)", padding: 4 }}>
                                    <p style={{ lineHeight: 0.8 }}>
                                        <span><b>{this.state.arr[0].name}</b></span>
                                        <span style={{ float: "right" }}><b>Balance</b></span>
                                    </p>
                                    <p style={{ lineHeight: 0.8 }}>
                                        <span><b>{this.state.arr[0].mobile}</b></span>
                                        <span style={{ float: "right" }}><b>{parseFloat(this.state.arr[this.state.arr.length - 1].pay * -1).toFixed(2)}</b></span>
                                    </p>
                                </div>
                                <div style={{
                                    height: 47,
                                    backgroundColor: "rgb(245, 245, 245)",
                                    paddingTop: 8.5
                                }}>
                                    <span style={{ display: "inline-block", paddingTop: 3 }}>Transaction for the month of {this.state.arr[this.state.arr.length - 1].month}</span>
                                    <div style={{ float: "right" }}>
                                        <select style={selectStyle} onChange={(event) => this.setState({ filterMonth: event.target.value })} >
                                            <option value="">Search by Month</option>
                                            <option value="january">January</option>
                                            <option value="february">February</option>
                                            <option value="march">March</option>
                                            <option value="april">April</option>
                                            <option value="may">May</option>
                                            <option value="june">June</option>
                                            <option value="July">July</option>
                                            <option value="august">August</option>
                                            <option value="september">September</option>
                                            <option value="october">October</option>
                                            <option value="november">November</option>
                                            <option value="december">December</option>
                                        </select>&nbsp;&nbsp;<button style={btn} onClick={() => this.filter()}>Search</button>&nbsp;&nbsp;<button style={btn}>Reset</button>
                                    </div>
                                </div>
                            </div>
                        }
                        {this.state.isCurrentUser &&
                            <table style={{ textAlign: "center" }}>
                                <thead>
                                    <tr>
                                        <th rowSpan="2" style={{ width: 100, textAlign: "center" }}>Date</th>
                                        <th colSpan="3" style={{ width: 140, textAlign: "center" }}>Milk</th>
                                        <th colSpan="3" style={{ width: 140, textAlign: "center" }}>Yogurt</th>
                                        <th colSpan="4" style={{ width: 140, textAlign: "center" }}>Amount in PKR</th>
                                    </tr>
                                    <tr>
                                        <th style={{ width: 40, textAlign: "center" }}>Qty</th>
                                        <th style={{ width: 60, textAlign: "center" }}>Rate</th>
                                        <th style={{ width: 80, textAlign: "center" }}>Ammount</th>
                                        <th style={{ width: 40, textAlign: "center" }}>Qty</th>
                                        <th style={{ width: 60, textAlign: "center" }}>Rate</th>
                                        <th style={{ width: 80, textAlign: "center" }}>Ammount</th>
                                        <th style={{ width: 80, textAlign: "center" }}>Total</th>
                                        <th style={{ width: 80, textAlign: "center" }}>Previous{'\n'}Balance</th>
                                        <th style={{ width: 80, textAlign: "center" }}>Payment</th>
                                        <th style={{ width: 80, textAlign: "center" }}>Current{'\n'}Balance</th>
                                    </tr>
                                </thead>
                            </table>
                        }
                        {this.state.isCurrentUser && this.state.arr.map((v, i) => {
                            console.log(v)
                            return this.state.arr.length > 0 ?
                                // v.opening === undefined &&
                                <table key={i} style={{ textAlign: "center" }}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: 100, textAlign: "center" }}>{v.date}</th>
                                            <th style={{ width: 40 }}>{v.milkQuantity}</th>
                                            <th style={{ width: 60 }}>{parseFloat(v.milkRate).toFixed(2)}</th>
                                            <th style={{ width: 80 }}>{v.milkAmount ? parseFloat(v.milkAmount).toFixed(2) : "0.00"}</th>
                                            <th style={{ width: 40 }}>{v.yogurtQuantity}</th>
                                            <th style={{ width: 60 }}>{parseFloat(v.yogurtRate).toFixed(2)}</th>
                                            <th style={{ width: 80 }}>{v.yogurtAmount ? parseFloat(v.yogurtAmount).toFixed(2) : "0.00"}</th>
                                            <th style={{ width: 80 }}>{v.milkAmount || v.yogurtAmount ? parseFloat(v.milkAmount + v.yogurtAmount).toFixed(2) : "0.00"}</th>
                                            <th style={{ width: 80 }}>{v.previous ? parseFloat(v.previous).toFixed(2) : "0.00"}</th>
                                            <th style={{ width: 80 }}>{v.credit ? parseFloat(v.credit).toFixed(2) : "0.00"}</th>
                                            <th style={{ width: 80 }}>{parseFloat(v.pay * -1).toFixed(2)}</th>
                                            {/* {v.opening
                                            ?
                                            <th style={{ width: 80 }}>{v.opening}</th>
                                            :
                                            ""
                                        } */}
                                        </tr>
                                    </thead>
                                </table>
                                :
                                <p>Data not found</p>
                        })}
                    </div>
                </div>
                {this.state.isEditUser &&
                    <Modal show={this.state.setShow} onHide={() => this.close()}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit User</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label><b>Customer Name</b></Form.Label>
                                    <Form.Control placeholder="e.g Mohammad Ahmed" type="text" onChange={(e) => this.setState({ newname: e.target.value })} value={this.state.newname} />
                                </Form.Group>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formBasicEmail">
                                        <Form.Label><b>Customer Mobile</b></Form.Label>
                                        <Form.Control placeholder="e.g 03001234567" type="text" onChange={(e) => this.setState({ newmobile: e.target.value })} value={this.state.newmobile} />
                                        {this.state.mobileLength ? <Form.Label style={{ color: "red" }}>Invalid mobile number</Form.Label> : ""}
                                    </Form.Group>
                                </Form.Row>
                                <Form.Group as={Col} controlId="formGridZip">
                                        <Form.Label><b>Current Sub Area of Customer</b></Form.Label>
                                        <Form.Control style={{fontWeight: "bold"}} value={this.state.subArea} disabled>
                                        </Form.Control>
                                    </Form.Group>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridCity">
                                        <Form.Label><b>Customer City</b></Form.Label>
                                        <Form.Control type="text" value={this.state.additionalInfo.city} disabled={true} />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridState">
                                        <Form.Label><b>Customer Area</b></Form.Label>
                                        <Form.Control type="text" value={this.state.additionalInfo.area} disabled={true} />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridZip">
                                        <Form.Label><b>Customer Sub Area</b></Form.Label>
                                        <Form.Control as="select" onChange={(event) => this.setState({ subArea: event.target.value })}>
                                            <option>Select Sub Area</option>
                                            {this.state.subAreaCondition && this.state.subAreaArr.map((v, i) => {
                                                return <option>{v.subArea}</option>
                                            })}
                                        </Form.Control>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridCity">
                                        <Form.Label><b>Milk Price (PKR)</b></Form.Label>
                                        <Form.Control type="text" onChange={(e) => this.setState({ newmilkRate: e.target.value })} value={this.state.newmilkRate} />
                                        {this.state.milkRateCondition ? <Form.Label style={{ color: "red" }}>Inavlid input</Form.Label> : ""}
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="formGridState">
                                        <Form.Label><b>Milk Quantity (LITRE)</b></Form.Label>
                                        <Form.Control type="text" onChange={(e) => this.setState({ newmilkQuantity: e.target.value })} value={this.state.newmilkQuantity} />
                                        {this.state.milkQuantityCondition ? <Form.Label style={{ color: "red" }}>Inavlid input</Form.Label> : ""}
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="formGridZip">
                                        <Form.Label><b>Yogurt Price (PKR)</b></Form.Label>
                                        <Form.Control type="text" onChange={(e) => this.setState({ newyogurtRate: e.target.value })} value={this.state.newyogurtRate} />
                                        {this.state.yogurtRateCondition ? <Form.Label style={{ color: "red" }}>Inavlid input</Form.Label> : ""}
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="formGridZip">
                                        <Form.Label><b>Yogurt Quantity (KG)</b></Form.Label>
                                        <Form.Control type="text" onChange={(e) => this.setState({ newyogurtQuantity: e.target.value })} value={this.state.newyogurtQuantity} />
                                        {this.state.yogurtQuantityCondition ? <Form.Label style={{ color: "red" }}>Inavlid input</Form.Label> : ""}
                                    </Form.Group>
                                </Form.Row>
                                <Button variant="primary" onClick={() => this.saveEditInfo()}>Save</Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                }
            </div >
        );
    }
}

export default AllCustomers;