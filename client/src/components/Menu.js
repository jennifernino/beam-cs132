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
          <li><button>Home</button></li>
          <li><button>Search</button></li>
          <li><button>New Lesson</button></li>
        </ul>
      </div>
    );
  }
}

export default Menu;
