import React, { Component } from 'react';
import './style/style.css';

class SignUp extends Component {
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
    alert('credentials'+ this.state.email + this.state.password);
    event.preventDefault();
  }

  render() {
    return (
      <div className="layout">
      <div className="layoutItem"></div>
      <div className="SignUpContainer">
        <div> <h1>Create Account</h1> </div>
        <form onSubmit={this.handleSubmit}>

        <div className="inputItem">
        <label>
        First Name
        <input type="text" value={this.state.email} onChange={this.handleUserChange} />
        </label>
        </div>

        <div className="inputItem">
        <label>
        Last Name
        <input type="text" value={this.state.email} onChange={this.handleUserChange} />
        </label>
        </div>

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
        <label>
        Retype password
        <input type="text" value={this.state.email} onChange={this.handleUserChange} />
        </label>
        </div>

        <div className="inputItem">
        <input type="submit" value="Sign up" className="submitButton" />
        </div>

        </form>


      </div>
      <div className="layoutItem"></div>
      </div>

    );
  }
}

export default SignUp;
