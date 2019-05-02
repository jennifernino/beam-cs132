import React, { Component } from 'react';
import UserOption from './UserOption';
import './style/style.css';
//import logo from 'beamLogo.png'

class Admin extends Component {
  constructor(props){
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

  adminSetUp = () => {
    const session = this.props.session;
    const uri = 'http://localhost:8080/' + session + '/adminsetup'
    fetch(uri)
      .then(res => res.json())
      .then(info => {
        this.setState({
          requests:info.requests,
          users:info.users,
          session:session
        })
      });
  }

  render() {
    return (
      <div className="AdminContainer">
        <h1>Manage Activity</h1>
        <h2>Pending Requests</h2>
        <div className="userSpacing">
          {!this.state.requests.length ?
            (
              <p>No pending requests...</p>
            ) : (
              this.state.requests.map(item =>
                <UserOption key={item.name} session={this.state.session} item={item} />
              )
            )}
        </div>
        <h2>Current Teams</h2>
        <div className="userSpacing">
          {!this.state.users.length ?
            (
              <p>No teams found...</p>
            ) : (
              this.state.users.map(item =>
                <UserOption key={item.name} session={this.state.session} item={item} />
              )
            )}
        </div>
      </div>
    );
  }
}

export default Admin;
