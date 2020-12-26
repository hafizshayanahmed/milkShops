import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import Login from "../components/login";
import FurtherInfo from "../components/furtherInfo";
import AddCustomer from '../components/addCustomer';
import DailyWork from "../components/dailyWork";
import Allcustomers from "../components/allCustomers";
import Bill from "../components/bill";
import PrintBill from "../components/printBill";
import Area from "../components/area";
import AddPayment from "../components/addPayment";
import Blogs from "../components/blogs";
import Index from "../components/index";
import Admin from "../components/admin";
import AddBlogs from "../components/addBlogs";
import Testimonials from "../components/testimonials";
import BlogInDetail from "../components/blogInDetail";
import ExistingBlogs from "../components/existingBlogs";
import AddCity from "../components/addCity";
import AddArea from "../components/addArea";
import AddSubArea from "../components/addSubArea";

function Navigation() {
    return (
        <div className="App">
            < BrowserRouter >
                <div>
                    <Route path="/login" component={Login} />
                    <Route path="/furtherInfo" component={FurtherInfo} />
                    <Route path="/addCustomer" component={AddCustomer} />
                    <Route path="/dailyWork" component={DailyWork} />
                    <Route path="/allCustomers" component={Allcustomers} />
                    <Route path="/bill" component={Bill} />
                    <Route path="/getBill" component={PrintBill} />
                    <Route path="/area" component={Area} />
                    <Route path="/blogInDetail" component={BlogInDetail} />
                    <Route path="/addPayment" component={AddPayment} />
                    <Route path="/blogs" component={Blogs} />
                    <Route exact path="/" component={Index} />
                    <Route path="/admin" component={Admin} />
                    <Route path="/addBlogs" component={AddBlogs} />
                    <Route path="/testimonials" component={Testimonials} />
                    <Route path="/existingBlogs" component={ExistingBlogs} />
                    <Route path="/addCity" component={AddCity} />
                    <Route path="/addArea" component={AddArea} />
                    <Route path="/addSubArea" component={AddSubArea} />
                </div>
            </ BrowserRouter >
        </div>
    );
}

export default Navigation;
