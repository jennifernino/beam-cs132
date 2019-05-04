import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import './style/style.css';

var validator = require("email-validator");
var passwordValidator = require('password-validator');

var schema = new passwordValidator();

schema
.is().min(8);


class SignUp extends Component {
  constructor(props){
    super(props);
    this.state = {
      first: '',
      last: '',
      email: '',
      password: '',
      retype: '',

    };
    this.handleFirstChange = this.handleFirstChange.bind(this);
    this.handleLastChange = this.handleLastChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleRetypeChange = this.handleRetypeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }


  handleFirstChange(event){
    this.setState({first: event.target.value});
  }

  handleLastChange(event){
    this.setState({last: event.target.value});
  }

  handleEmailChange(event){
    this.setState({email: event.target.value});
  }

  handlePasswordChange(event){
    this.setState({password: event.target.value});
  }

  handleRetypeChange(event){
    this.setState({retype: event.target.value});
  }

  handleSubmit(event) {
    //alert('credentials'+ this.state.email + this.state.password);
    event.preventDefault();
    // if(validator.validate(this.state.email)==false){
    //   alert('Please enter a valid email');
    // }
    if(schema.validate(this.state.password)==false){
      alert('Password must consist of at least eight characters');

    }

    if(this.state.password != this.state.retype){
      alert('ERROR: passwords do not match');
    }
    const body_str = JSON.stringify({
      first: this.state.first,
      last: this.state.last,
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

    fetch("http://localhost:8080/signup", req)
      .then(res => res.json())
      .then(info => {
        // TODO print account made if made
        this.props.history.push('/');
      })
  }

  render() {
    return (

      <div className="SignUpContainer">
        <div> <h1>Create Account</h1> </div>
        <form onSubmit={this.handleSubmit}>

        <div className="inputItem">
        <label>First Name
        <input id="signupInput" type="text" value={this.state.first} onChange={this.handleFirstChange} />
        </label>
        </div>
        <div className="inputItem">
        <label>Last Name
        <input id="signupInput" type="text" value={this.state.last} onChange={this.handleLastChange} />
        </label>
        </div>
        <div className="inputItem">
        <label id="signupReqs"> Email
        <input id="signupInput" type="text" value={this.state.email} onChange={this.handleEmailChange} />
        </label>
        </div>
        <div className="inputItem">
        <label id="signupReqs"> Password (eight character minimum)
        <input id="signupInput" type="password" value={this.state.password} onChange={this.handlePasswordChange} />
        </label>
        </div>
        <div className="inputItem">
        <label id="signupReqs"> Retype password
        <input id="signupInput" type="password" value={this.state.retype} onChange={this.handleRetypeChange} />
        </label>
        </div>
        <div className="inputItem">
        <input id="signupInput" type="submit" value="Sign up" className="submitButton" />
        </div>
        </form>
      </div>

    );
  }
}

export default SignUp;
