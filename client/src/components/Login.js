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
    fetch('/', {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: {
        "username": "test"
      }
    });

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
