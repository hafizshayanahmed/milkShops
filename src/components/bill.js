import React from 'react';
import Firebase from "../config/firebase"
import Table from 'react-bootstrap/Table'
import { Button } from 'react-bootstrap';

class bill extends React.Component {
    constructor() {
        super();
        this.state = {

        }
    }

    bill(ID) {
        this.props.history.push("getBill", ID)
    }

    componentDidMount() {
        let user = JSON.parse(localStorage.getItem("user"))
        Firebase.database().ref("customer/" + user.uid).on("value", (e) => {
            let val = e.val()
            let object = Object.values(val)
            this.setState({
                values: object,
                con: true
            })
        })
    }

    render() {
        return (
            <div className="App">
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th style={{ width: 50 }}>#</th>
                            <th style={{ width: 200 }}>Name</th>
                            <th style={{ width: 200 }}>Mobile No.</th>
                            <th>Option</th>
                        </tr>
                    </thead>
                </Table>
                {this.state.con && this.state.values.map((v, i) => {
                    return <Table striped bordered hover size="sm">
                        <tbody>
                            <tr verticalAlign="middle">
                                <td style={{ width: 50, verticalAlign: "middle" }}>{i + 1}</td>
                                <td style={{ width: 200, verticalAlign: "middle" }}>{v.name}</td>
                                <td style={{ width: 200, verticalAlign: "middle" }}>{v.mobile}</td>
                                <td>
                                    <Button onClick={() => this.bill(v.ID)}>Get Bill</Button>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                })
                }
            </div >
        );
    }
}

export default bill;
