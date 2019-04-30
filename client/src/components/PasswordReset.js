import React, { Component } from 'react';
import './style/style.css';

class PasswordReset extends Component {
  constructor(props){
    super(props);
    this.state = {
      confirmationID: '',
      password: '',
      retypePassword: ''
    };

    this.handleIDChange = this.handleIDChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleRetypeChange = this.handleRetypeChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);

  }



  handleIDChange(event){
    this.setState({confirmationID: event.target.value});
  }

  handlePasswordChange(event){
    this.setState({password: event.target.value});
  }

  handleRetypeChange(event){
    this.setState({retypePassword: event.target.value});
  }



  handleSubmit(event){

    event.preventDefault();
    const body_str = JSON.stringify({
      confirmationID: this.state.confirmationID,
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

    fetch("http://localhost:8080/passwordreset", req)
      // .then(function(response) {
      //   return response.json();
      // })
      .then(res => res.text())          // convert to plain text
      .then(text => console.log(text))  // then log it out
  }


  render() {
    return (
      <div className="ForgotContainer">

      <div className="inputItem">
      <h1> Reset password </h1>
      </div>



      <form onSubmit={this.handleSubmit}>
      <div className="inputItem">
      <label>
      Verification code:
      <input type="text" value={this.state.confirmationID} onChange={this.handleIDChange} />
      </label>
      </div>
      <div className="inputItem">
      <label>
      New password
      <input type="text" value={this.state.password} onChange={this.handlePasswordChange} />
      </label>
      </div>
      <div className="inputItem">
      <label>
      Retype password
      <input type="text" value={this.state.retypePassword} onChange={this.handleRetypeChange} />
      </label>
      </div>


      <div className="inputItem">
      <input type="submit" value="Reset password" />
      </div>

      </form>
      </div>
    );
  }
}

export default PasswordReset;
