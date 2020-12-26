// import React from 'react'
// const printer = require('node-thermal-printer');
// export default class TPrinter extends React.Component {

//     constructor(props) {
//         super(props);
//         this._printer = printer.init({
//             type: 'epson',
//             interface: '/dev/usb/lp0'
//         });
//     }

//     handleOnClick() {
//         this._printer.alignCenter();
//         this._printer.println("Hello world");
//         this._printer.cut();
//         this._printer.execute((err) => {
//             if (err) { return console.log(err); }
//             console.log('Done!');
//         });

//     }

//     render() {
//         return (
//             <button onClick={() => this.handleOnClick()}></button>
//         )
//     }
// }