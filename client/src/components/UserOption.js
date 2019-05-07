import React, { Component } from 'react';
import './style/style.css';
import Dropdown from './Dropdown';
import { DropdownMenu, MenuItem, DropdownToggle } from './Dropdown'
import '@trendmicro/react-buttons/dist/react-buttons.css';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';

//import logo from 'beamLogo.png'

class UserOption extends Component {
  constructor(props){
    super(props);
    this.state = {
      name:'',
      email:'',
      position:'Position',
      team:'Club',
      verified:''
    };

  }

  componentDidMount() {
    console.log('>> ', this.props.item);
    this.setState({
      session:localStorage.getItem('session'),
      name:this.props.item.name,
      email:this.props.item.email,
      verified:this.props.item.verified,
      position:this.props.item.position,
      team:this.props.item.group
    })
  }

  adminUpdate = (str) => {
    const req = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: str
    }
    const session = localStorage.getItem('session');
    const uri = 'http://localhost:8080/' + session + '/adminupdate'
    fetch(uri, req)
      .then(res => res.json())
      .then(info => {
        console.log(info)
      });
  }

  adminVerifyUpdate = (str) => {
    const req = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: str
    }
    const session = localStorage.getItem('session');
    const uri = 'http://localhost:8080/' + session + '/adminupdate'
    fetch(uri, req)
      .then(res => res.json())
      .then(info => {

        console.log(info)
        this.props.ad()
      });
  }
  selected(value, event) {
    this.setState({position:value});
  }

  assignTeam(value, event) {
    this.setState({team:value})
  }

  removeRequest() {
    this.removeReq();

  }
  removeReq = () => {
    const req = {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    const session = localStorage.getItem('session');
    const email = this.state.email;
    const uri = 'http://localhost:8080/' + session + '/delete/' + email
    fetch(uri, req)
      .then(res => res.json())
      .then(info => {
        console.log(info)
        this.props.ad()
      });
  }

  verify() {
    // TODO: check if everything needed is here!!
    const body_str = JSON.stringify({
      toUpdate: {
        position:this.state.position,
        team:this.state.team,
        leader:(this.state.position === 'Team Leader') ? 1 : 0,
        verified:1,
        isAdmin:(this.state.position === 'Admin') ? 1 : 0,
        group: this.state.team
      },
      email: this.state.email
    });

    this.adminVerifyUpdate(body_str);
  }

  update() {
    const body_str = JSON.stringify({
      toUpdate: {
        position:this.state.position,
        team:this.state.team,
        leader:(this.state.position === 'Team Leader') ? 1 : 0,
        isAdmin:(this.state.position === 'Admin') ? 1 : 0,
        group: this.state.team
      },
      email: this.state.email
    });
    this.adminUpdate(body_str)
  }

  render() {
    return (
      <div className="UserOptionContainer">
        <div className="userInfo">
        <p className="userName">{this.state.name}</p>
        <p className="userEmail">{this.state.email}</p>
      </div>
        <p>{this.state.position}</p>
        <p>{this.state.team}</p>
          <Dropdown className="dropDownContainer">
            <DropdownToggle btnStyle="flat">{this.state.position}</DropdownToggle>
            <DropdownMenu>
              <MenuItem onClick={this.selected.bind(this, "Position")}>Position</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "Volunteer")}>Volunteer</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "Team Leader")}>Team Leader</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "Admin")}>Admin</MenuItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown className="dropDownContainer">
            <DropdownToggle btnStyle="flat">{this.state.team}</DropdownToggle>
            <DropdownMenu>
              <MenuItem onClick={this.assignTeam.bind(this, "Club")}>Club</MenuItem>
              <MenuItem onClick={this.assignTeam.bind(this, "A")}>A</MenuItem>
              <MenuItem onClick={this.assignTeam.bind(this, "B")}>B</MenuItem>
              <MenuItem onClick={this.assignTeam.bind(this, "C")}>C</MenuItem>
              <MenuItem onClick={this.assignTeam.bind(this, "D")}>D</MenuItem>
              <MenuItem onClick={this.assignTeam.bind(this, "E")}>E</MenuItem>
              <MenuItem onClick={this.assignTeam.bind(this, "F")}>F</MenuItem>
            </DropdownMenu>
          </Dropdown>
          {this.state.verified ?
            (
              <div className="userButtons">
              <button className="updateButton" onClick={this.update.bind(this)}>Update</button>
              </div>
            ) : (
              <div className="userButtons">
              <button className="verifyButton" onClick={this.verify.bind(this)}>Verify</button>
              <button className="declineButton" onClick={this.removeRequest.bind(this)}> Decline </button>
              </div>
            )}
        </div>

    );
  }
}

export default UserOption;
