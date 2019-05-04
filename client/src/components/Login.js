import React, { Component } from 'react';
import './style/style.css';
import logo from './beamLogo.png';


class Login extends Component {
  constructor(props){
    super(props);

    this.state = {
      username: '',
      password: '',
      error:''
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

  throwError(message) {
    this.setState({
      error: message
    });
    console.log('unable to login');
    document.getElementById("loginError").style.visibility="visible";
  }

  handleSubmit(event){
    if (typeof this.state.email === 'undefined' ||
        typeof this.state.password === 'undefined' ||
        this.state.email === "" ||
        this.state.password === "") {
          this.throwError("Missing login credential(s).");
          return;
    }


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
      .then(res => res.json())
      .then(info => {

        if (info.loggedIn) {
          document.getElementById("loginError").style.visibility="hidden";
          this.props.login(info.name, info.session);
        } else {
          console.log("No login")
          console.log("info.message: " + info.message);
          if(info.message === "User does not exist."){
            this.throwError(info.message);
          } else{
            this.throwError("Email or password are incorrect.");
          }
          // document.getElementById("loginError").style.visibility="visible";
          // this.throwError("Email or password are incorrect.")
        }
        // TODO create new page
      })

  }

  render() {
    return (
      <div className="LoginContainer">
        <h1> BEAM Lesson Planner </h1>
        <img className="beamLogo" src={logo} alt="Logo" />
        <label id="loginError">{this.state.error}</label>
        <label id="loginReqs">Email
        </label>
        <input id="loginInput" type="text" value={this.state.email} onChange={this.handleUserChange} />
        <label id="loginReqs">Password
        </label>
        <input id="loginInput" type="password" value={this.state.password} onChange={this.handlePasswordChange} />
        <div className="inputItem">
          <a href="/forgotpassword"> Forgot password? </a>
        </div>
        <div className="inputItem">
          <a href="/signup"> Create an account </a>
        </div>

        <button className="submitButton" onClick={this.handleSubmit.bind(this)}>Login</button>
      </div>
    );
  }
}

export default Login;
