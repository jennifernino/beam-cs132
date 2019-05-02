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
    //event.preventDefault();
    const body_str = JSON.stringify({
      email: this.state.email,
      password: this.state.password
    });

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
          this.props.login();
        } else {
          console.log("No login")
        }
        // TODO create new page
      })
      .then(() => {
        console.log()

      });


  }

  render() {
    return (
      <div className="LoginContainer">
        <h1> BEAM Lesson Planner </h1>


        <label>
        Email
        </label>
        <input type="text" value={this.state.email} onChange={this.handleUserChange} />
        <label>
        Password
        </label>
        <input type="password" value={this.state.password} onChange={this.handlePasswordChange} />

        <div className="inputItem">
          <a href="/forgotpassword"> Forgot password? </a>
        </div>

        <div className="inputItem">
          <a href="/signup"> Create an account </a>
        </div>

        <button onClick={this.handleSubmit.bind(this)}>Submit</button>
      </div>
    );
  }
}

export default Login;
