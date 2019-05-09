import React, { Component } from 'react';
import './style/style.css';

class Forgot extends Component {
  constructor(props){
    super(props);
    this.state = {
      emailSubmitted: false,
      email: '',
      newpass: '',
      confirmation: ''
    };
  }

  handleNewpassChange(event) {
    this.setState({newpass: event.target.value});
  }
  handleConfirmationChange (event) {
    this.setState({confirmation: event.target.value});
  }


  handleUserChange(event){
    this.setState({email: event.target.value});
  }
  goBack() {
    this.props.history.push('/');
  }
  handleReset() {
    const body_str = JSON.stringify({
      newpass: this.state.newpass,
      confirmation: this.state.confirmation
    });

    const req = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: body_str
    }
    const uri = 'http://localhost:8080/resetPassword/' + this.state.email;
    fetch(uri, req)
      .then(res => res.json())
      .then(info =>{
        console.log('AFTER', info)
        if (info.passReset) {
          this.props.history.push('/');
        } else {
          console.log("FAILED")
        }
      })
  }

  handleSubmit(event){
    if (this.state.email.length > 0) {
      this.setState({emailSubmitted:true})
      const uri = 'http://localhost:8080/resetPassword/' + this.state.email;
      fetch(uri)
      .then(res => res.json())
      .then(info => {
        console.log('INITIAL', info)

          this.setState({
            emailSubmitted:true
          })


      })
    }
  }


  render() {
    return (
      <div className="ForgotContainer">
      {!this.state.emailSubmitted ? (
        <div>
          <h1> Forgot password </h1>
          <label>Enter your email to reset your password</label>
          <input className="emailInput" type="text" value={this.state.email} onChange={this.handleUserChange.bind(this)} />
          <button className="submitButton" onClick={this.handleSubmit.bind(this)}>Submit</button>
          <button id="signupInput" className="submitButton" onClick={this.goBack.bind(this)}>Back to Login</button>
        </div>
    ) : (
      <div>
        <h1> Reset password </h1>
        <label className="tooMuchText">Enter the confirmation number that was sent to your email</label>
        <input className="emailInput" type="text" value={this.state.confirmation} onChange={this.handleConfirmationChange.bind(this)} />
        <label>New password</label>
        <input className="emailInput" type="text" value={this.state.newpass} onChange={this.handleNewpassChange.bind(this)} />
        <button className="submitButton" onClick={this.handleReset.bind(this)}>Submit</button>
        <button id="signupInput" className="submitButton" onClick={this.goBack.bind(this)}>Back to Login</button>
      </div>

    )}


      </div>
    );
  }
}

export default Forgot;
