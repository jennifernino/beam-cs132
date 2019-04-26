import React, { Component } from 'react';
import './style/style.css';
//import logo from 'beamLogo.png'

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',

    };
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleUserChange(event){
    this.setState({email: event.target.value});
  }

  handlePasswordChange(event){
    this.setState({password: event.target.value});
  }

  handleSubmit(event){
    event.preventDefault();
    const body_str = JSON.stringify({
      email: this.state.email,
      password: this.state.password
    });
    console.log(body_str)

    const req = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: body_str
    }

    fetch("http://localhost:8080/", req)
      // .then(function(response) {
      //   return response.json();
      // })
      .then(res => res.text())          // convert to plain text
      .then(text => console.log(text))  // then log it out


  }

  render() {
    return (
      <div className="LoginContainer">
        <div className="inputItem">
        <h1> BEAM Lesson Planner </h1>
        </div>
        <form onSubmit={this.handleSubmit}>
        <div className="inputItem">
        <label>
        Email
        <input type="text" value={this.state.email} onChange={this.handleUserChange} />
        </label>
        </div>

        <div className="inputItem">
        <label>
        Password
        <input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
        </label>
        </div>

        <div className="inputItem">
        <input type="submit" value="Log in" className="submitButton" />
        </div>
        <div className="inputItem">
        <a href="/forgotpassword"> Forgot password? </a>
        </div>

        <div className="inputItem">
        <a href="/signup"> Create an account </a>
        </div>

        </form>
      </div>
    );
  }
}

export default Login;
