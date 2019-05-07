import React, { Component } from 'react';
import UserOption from './UserOption';
import './style/style.css';
//import logo from 'beamLogo.png'

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      session:'',
      requests:[],
      users:[] // sort by team
    };

  }

  componentDidMount() {
    this.adminSetUp()
  }

  remEmail() {
    this.adminSetUp();
  }


  adminSetUp = () => {
    const session = localStorage.getItem('session');
    const uri = 'http://localhost:8080/' + session + '/adminsetup'
    fetch(uri)
      .then(res => res.json())
      .then(info => {
        console.log('b4 ', this.state)
        this.setState({
          users:info.users,
          requests:info.requests,
          session:session
        });
        console.log('after ', this.state)
      });
  }

  render() {
    console.log('RENDERING: $$$$ \n\t\n\t',this.state)

    return (
      <div className="AdminContainer">
        <h1>Manage Activity</h1>
        <h2>Pending Requests</h2>
        <div className="userSpacing">
          {!this.state.requests.length ?
            (
              <p>No pending requests...</p>
            ) : (
              this.state.requests.map((item, index) =>
                <UserOption key={'x'+item.email} item={item} ad={this.adminSetUp.bind(this)}/>
              )
            )}
        </div>
        <h2>Current Teams</h2>
        <div className="userSpacing">
          {!this.state.users.length ?
            (
              <p>No teams found...</p>
            ) : (
              this.state.users.map((item, index) =>
                <UserOption key={'y'+item.email} item={item} />
              )
            )}
        </div>
      </div>
    );
  }
}

export default Admin;
