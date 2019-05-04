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
    this.postSignup = this.postSignup.bind(this);
    this.checkFields = this.checkFields.bind(this);

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

  checkFields(){
    if((this.state.first!=="") && (this.state.last!=="") &&
    (this.state.email!=="") && (this.state.password!=="") &&
    (this.state.retype!=="")) {
      document.getElementById("missingSignupReqs").style.visibility = "hidden";
      if(schema.validate(this.state.password)==false){
        alert('Password must consist of at least eight characters');
        //change this alert to actual text warning within the div or somethin
      }

      if(this.state.password != this.state.retype){
        alert('ERROR: passwords do not match');
         //change this alert to actual text warning within the div or somethin
      }
      if((schema.validate(this.state.password)) && (this.state.password === this.state.retype)){
        this.postSignup();
        alert(this.state.first + ", you have successfully signed up!"
        + " Please wait for administrator approval before logging in.");
      }
      // return true;
      // this.postLesson();
    } else {
      document.getElementById("missingSignupReqs").style.visibility = "visible";
      if (this.state.first==="") {
        document.getElementById("missingFirst").style.visibility = "visible";
      } else{
        document.getElementById("missingFirst").style.visibility = "hidden";
      }
      if(this.state.last===""){
        document.getElementById("missingLast").style.visibility="visible";
      } else{
        document.getElementById("missingLast").style.visibility="hidden";
      }
      if(this.state.email===""){
        document.getElementById("missingEmail").style.visibility="visible";
      } else{
        document.getElementById("missingEmail").style.visibility="hidden";
      }
      if(this.state.password===""){
        document.getElementById("missingPassword").style.visibility="visible";
      } else{
        document.getElementById("missingPassword").style.visibility="hidden";
      }
      if(this.state.retype===""){
        document.getElementById("missingRetyped").style.visibility="visible";
      } else{
        document.getElementById("missingRetyped").style.visibility="hidden";
      }
    }
  }

   postSignup() {
    //alert('credentials'+ this.state.email + this.state.password);
    // event.preventDefault();
    // if(validator.validate(this.state.email)==false){
    //   alert('Please enter a valid email');
    // }
    // if((schema.validate(this.state.password)) && (this.state.password === this.state.retype)){
      // alert(this.state.first + ", you have successfully signed up!"
      // + " Please wait for administrator approval before logging in.");
    // }
    // if()
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
        <label id="missingSignupReqs">Missing Field(s)</label>
        <div className="inputItem">
        <label>First Name <span id="missingFirst" className="asterisk">*</span>
        <input id="signupInput1" type="text" value={this.state.first} onChange={this.handleFirstChange} />
        </label>
        </div>
        <div className="inputItem">
        <label>Last Name <span id="missingLast" className="asterisk">*</span>
        <input id="signupInput2" type="text" value={this.state.last} onChange={this.handleLastChange} />
        </label>
        </div>
        <div className="inputItem">
        <label id="signupReqs"> Email <span id="missingEmail" className="asterisk">*</span>
        <input id="signupInput3" type="text" value={this.state.email} onChange={this.handleEmailChange} />
        </label>
        </div>
        <div className="inputItem">
        <label id="signupReqs"> Password (eight character minimum) <span id="missingPassword" className="asterisk">*</span>
        <input id="signupInput4" type="password" value={this.state.password} onChange={this.handlePasswordChange} />
        </label>
        </div>
        <div className="inputItem">
        <label id="signupReqs"> Retype password <span id="missingRetyped" className="asterisk">*</span>
        <input id="signupInput5" type="password" value={this.state.retype} onChange={this.handleRetypeChange} />
        </label>
        </div>
        <button id="signupInput" className="submitButton" onClick={this.checkFields}>Sign Up</button>
      </div>
    );
  }
}

export default SignUp;
