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
      session: '',
      position:'Volunteer',
      team:'None',
      verified:''
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
        console.log(info)
      });
  }

  selected(value, event) {
    this.setState({position:value});
  }

  assignTeam(value, event) {
    this.setState({team:value})
  }

  verify() {
    // TODO: check if everything needed is here!!
    const body_str = JSON.stringify({
      toUpdate: {
        position:this.state.position,
        team:this.state.team,
        verified:this.state.verified
      }
    });
    adminUpdate(body_str);
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
    const session = this.props.session;
    const uri = 'http://localhost:8080/' + session + '/adminupdate'
    fetch(uri, req)
      .then(res => res.json())
      .then(info => {
        console.log(info)
      });
  }

  update() {
    const body_str = JSON.stringify({
      toUpdate: {
        position:this.state.position,
        team:this.state.team,
      }
    });
    adminUpdate(body_str)
  }

  render() {
    return (
      <div className="UserOptionContainer">
        <p>Person Name</p>
        <p>someemail@email.email</p>
          <Dropdown className="dropDownContainer">
            <DropdownToggle btnStyle="flat">{this.state.position}</DropdownToggle>
            <DropdownMenu>
              <MenuItem onClick={this.selected.bind(this, "Volunteer")}>Volunteer</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "Team Leader")}>Team Leader</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "Admin")}>Admin</MenuItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown className="dropDownContainer">
            <DropdownToggle btnStyle="flat">{this.state.team}</DropdownToggle>
            <DropdownMenu>
              <MenuItem onClick={this.assignTeam.bind(this, "None")}>None</MenuItem>
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
              null
            ) : (
              <button onClick={this.verify.bind(this)}>Verify</button>
            )}
          <button onClick={this.update.bind(this)}>Update</button>
      </div>
    );
  }
}

export default UserOption;
