import React, { Component } from 'react';
import './style/style.css';

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
    alert('credentials'+ this.state.email + this.state.password);
    event.preventDefault();
  }

  render() {
    return (
      <div className="LoginContainer">
        <form onSubmit={this.handleSubmit}>
        <div>
        <label>
        Email
        <input type="text" value={this.state.email} onChange={this.handleUserChange} />
        </label>
        </div>

        <div>
        <label>
        Password
        <input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
        </label>
        </div>

        <input type="submit" value="Log in" />

        </form>
      </div>
    );
  }
}

export default Login;
