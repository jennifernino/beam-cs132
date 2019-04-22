import React, { Component } from 'react';
import './style/style.css';

class Menu extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="menuContainer">
        <ul>
          <div>
          <li><button className = "navButton">Home</button></li>
          </div>

          <div>
          <li><button className = "navButton">Search</button></li>
          </div>

          <div>
          <li><button className = "navButton">New Lesson</button></li>
          </div>

        </ul>
      </div>
    );
  }
}

export default Menu;
