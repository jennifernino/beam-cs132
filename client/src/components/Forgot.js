import React, { Component } from 'react';
import './style/style.css';

class Forgot extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
    };

    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }



  handleUserChange(event){
    this.setState({email: event.target.value});
  }

  handleSubmit(event){

    event.preventDefault();
    const body_str = JSON.stringify({
      email: this.state.email,
    });

    const req = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: body_str
    }

    fetch("http://localhost:8080/forgotpassword", req)
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
      <h1> Forgot password </h1>
      </div>
      <form onSubmit={this.handleSubmit}>
      <div className="inputItem">
      <label>
      Enter your email to reset your password
      <input id="forgotInput" type="text" value={this.state.email} onChange={this.handleUserChange} />
      </label>
      </div>
      <div className="inputItem">
      <input className="resetButton" type="submit" value="Reset password" />
      </div>

      </form>
      </div>
    );
  }
}

export default Forgot;
