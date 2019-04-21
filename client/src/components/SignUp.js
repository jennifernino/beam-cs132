import React, { Component } from 'react';
import './style/style.css';

class SignUp extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',

    };

  }

  handleUserChange(event){
    this.setState({email: event.target.value});
  }

  handlePasswordChange(event){
    this.setState({password: event.taget.value});
  }

  handleSubmit(event){
    alert('credentials'+ this.state.email + this.state.password);
    event.preventDefault();
  }

  render() {
    return (
      <div className="SignUpContainer">
        <form onSubmit={this.handleSubmit}>
        <label>
        Email
        <input type="text" value={this.state.email} onChange={this.handleUserChange} />
        </label>

        <label>
        Password
        <input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
        </label>

        <input type="submit" value="Sign up" />

        </form>
      </div>
    );
  }
}

export default SignUp;
