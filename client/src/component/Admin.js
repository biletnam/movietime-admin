import React, { Component } from 'react';
import '../style/Admin.css';

// import { Link } from 'react-router-dom';
import axios from 'axios';

//COOKIES
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class Admin extends Component {
    constructor(){
        super();
        this.state = {
            cookie: false,
        }
    }
    componentDidMount(){
        //Check cookies
        let cookiePeramban = cookies.get('MOVIETIME_ADMIN_SESSID')
        
        var url = 'http://localhost:6001/cookie';
        axios.post(url, {
            cookieMovietime: cookiePeramban,
        })
        .then((response) => {
            if (response.data.kode == '001'){
                this.setState({
                    cookie: true,
                })
            }
            else if (response.data.kode == '002'){
                this.setState({
                    cookie: false,
                })
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    adminLogin(){
        // console.log(`Fungsi adminLogin sudah berjalan`)
        // console.log(`Email: ${this.refs.emaillogin.value}`)
        // console.log(`Password: ${this.refs.passwordlogin.value}`)

        var url = 'http://localhost:6001/adminlogin';
        axios.post(url, {
          email: this.refs.emaillogin.value,
          password: this.refs.passwordlogin.value
        })
        .then((response) => {
          if (response.data.kode === '001'){
            cookies.set('MOVIETIME_ADMIN_SESSID', response.data.session_id, {path: '/', expires: new Date(Date.now()+86400000)})

            console.log(`Berhasil login dan cookie sudah terbuat`)
            this.setState({
                email:this.refs.emaillogin.value,
                password:this.refs.passwordlogin.value,
                cookie: true
            });

            window.location.replace('/dashboard');
          }
        })
        .catch(function (error) {
          console.log(error);
          console.log(`Gagal login dan cookie tidak terbuat`)
        });
    }

    render() {
        if (this.state.cookie === true) {
            window.location.replace('/dashboard');
        } else {
            return (
                <div className="Admin">
                    <center>
                        <img src={require('../img/movietimecom-transparent-crop.png')} alt="" width="150px" />
                        <div className="mt-admin">
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Email address</label>
                                <input ref="emaillogin" type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1">Password</label>
                                <input ref="passwordlogin" type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"/>
                            </div>
                            <button onClick={()=>{this.adminLogin()}} className="btn btn-primary">LOG IN</button>
                        </div>
                    </center>
                </div>
            );
        }
    } 
}

export default Admin;
