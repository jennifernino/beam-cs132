import React, { Component } from 'react';
import './style/style.css';

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
      error: '',
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
      document.getElementById("passwordError").style.visibility = "hidden";
      if(schema.validate(this.state.password)===false){
        this.setState({error: 'Password must consist of at least eight characters.'})
        document.getElementById("passwordError").style.visibility = "visible";
      }

      if(this.state.password !== this.state.retype){
        this.setState({error: 'Passwords do not match.'})
        document.getElementById("passwordError").style.visibility = "visible";
      }
      if((schema.validate(this.state.password)) && (this.state.password === this.state.retype)){
        this.postSignup();
      }
    } else {
      this.setState({error: 'Missing field(s).'})
      document.getElementById("passwordError").style.visibility = "visible";
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
    const email = this.state.email.toLowerCase();
    const body_str = JSON.stringify({
      first: this.state.first,
      last: this.state.last,
      email: email,
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
        console.log(info)
        if (info.created) {
          this.props.history.push('/');
        } else {
          console.log(this.state);
          document.getElementById("passwordError").style.visibility = "visible";
          this.setState({error: 'An account already exists with that email.'})
          console.log(this.state);
          document.getElementById("missingEmail").style.visibility = "visible";
        }
      })
  }

  goBack() {
    this.props.history.push('/');
  }

  render() {
    return (
      <div className="SignUpContainer">
        <div> <h1>Create Account</h1> </div>
        <label id="passwordError">{this.state.error}</label>
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
        <button id="signupInput" className="submitButton" onClick={this.goBack.bind(this)}>Back to Login</button>

      </div>
    );
  }
}

export default SignUp;
