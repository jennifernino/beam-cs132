import React, { Component } from 'react';
import './style/style.css';
import { Link } from "react-router-dom";

class Menu extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  logout() {
    this.props.logout();
  }

  render() {
    return (
      <div className="menuContainer">
        <ul>
          <li>
            <Link to={'/home'}>
            <button className="navButton">Home</button>
          </Link>
          </li>
          <li>
            <Link to={'/search'}>
            <button className="navButton">Search</button>
            </Link>
          </li>
          <li>
            <Link to={'/newlesson'}>
            <button className="navButton">New Lesson</button>
            </Link>
          </li>
          {/* <li> */}

          {/* </li> */}
        </ul>
        <button className="logoutButton" onClick={this.logout.bind(this)}>Logout</button>
      </div>
    );
  }
}

export default Menu;
