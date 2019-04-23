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
    alert('credentials'+ this.state.email);
    event.preventDefault();
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
      <input type="text" value={this.state.email} onChange={this.handleUserChange} />
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

export default Forgot;
