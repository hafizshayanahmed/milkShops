import React from 'react';
// import Doc from './pdf/docService';
import Firebase from "../config/firebase"
// import PdfContainer from './pdf/PDFContainer';

class printBill extends React.Component {
    constructor() {
        super();
        this.state = {

        }
    }

    componentDidMount() {
        let milkTotal = 0;
        let yogurtTotal = 0;
        let arr = []
        let user = JSON.parse(localStorage.getItem("user"))
        Firebase.database().ref("dailyWork/" + user.uid).on("value", (e) => {
            let val = e.val()
            let object = Object.values(val)
            for (var key in object) {
                for (var key1 in object[key]) {
                    for (var key2 in object[key][key1]) {
                        if (this.props.history.location.state === object[key][key1][key2].ID) {
                            if (object[key][key1][key2].isMilkDelivered === true) {
                                milkTotal = milkTotal + Number(object[key][key1][key2].milkRate)
                            }
                            if (object[key][key1][key2].isYogurtDelivered === true) {
                                yogurtTotal = yogurtTotal + Number(object[key][key1][key2].yogurtRate)
                            }
                            arr.push(object[key][key1][key2])
                            this.setState({
                                arr,
                                con: true,
                                milkTotal,
                                yogurtTotal
                            })
                        }
                    }
                }
            }
        })
        Firebase.database().ref("payments/" + user.uid + "/" + this.props.history.location.state).on("value", (e) => {
            let totalAdvance = 0;
            let val = e.val()
            let object = Object.values(val)
            for (var key in object) {
                totalAdvance = totalAdvance + Number(object[key].pay)
            }
            this.setState({
                totalAdvance,
                con: true
            })
        })
    }

    // createPdf = (html) => Doc.createPdf(html);

    render() {
        return (
            <div style={{ width: "100%" }}>
                {this.state.con &&
                    <div style={{ width: 298, margin: "0 auto" }}>
                        <section className="header-bar">
                            {/* <span className="header">Bill</span> */}
                        </section>
                        <br />
                        {/* <PdfContainer createPdf={this.createPdf}>
                            <br />
                            <div className="billContainer">
                                <table border="1">
                                    <thead>
                                        <tr>
                                            <th style={{ width: 112 }}>DATE</th>
                                            <th style={{ width: 45 }}>M.R</th>
                                            <th style={{ width: 45 }}>Y.R</th>
                                            <th style={{ width: 45 }}>M.D</th>
                                            <th style={{ width: 45 }}>Y.D</th>
                                        </tr>
                                    </thead>
                                </table>
                                {this.state.con && this.state.arr.map((v, i) => {
                                    return <table border="1">
                                        <tbody>
                                            <tr>
                                                <td style={{ width: 112 }}>{v.date}</td>
                                                <td style={{ width: 45 }}>{v.milkRate}</td>
                                                <td style={{ width: 45 }}>{v.yogurtRate}</td>
                                                <td style={{ width: 45 }}>{v.isMilkDelivered ? "Y" : "N"}</td>
                                                <td style={{ width: 45 }}>{v.isYogurtDelivered ? "Y" : "N"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                })}
                                <table border="1">
                                    <tfoot>
                                        <tr>
                                            <th style={{ width: 112 }}>TOTAL</th>
                                            <th style={{ width: 45 }}>{this.state.milkTotal}</th>
                                            <th style={{ width: 45 }}>{this.state.yogurtTotal}</th>
                                        </tr>
                                        <tr>
                                            <th style={{ width: 112 }}>GRAND TOTAL</th>
                                            <th style={{ width: 45 }}>{this.state.milkTotal + this.state.yogurtTotal}</th>
                                        </tr>
                                        <tr>
                                            <th style={{ width: 112 }}>ADVANCE</th>
                                            <th style={{ width: 45 }}>{this.state.totalAdvance}</th>
                                        </tr>
                                        <tr>
                                            <th style={{ width: 112 }}>BALANCE</th>
                                            <th style={{ width: 45 }}>{this.state.totalAdvance - (this.state.milkTotal + this.state.yogurtTotal)}</th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </PdfContainer> */}
                    </div>
                }
            </div >
        );
    }
}

export default printBill;
