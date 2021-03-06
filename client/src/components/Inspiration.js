import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import './style/style.css';
import Dropdown from './Dropdown';
import { DropdownMenu, MenuItem, DropdownToggle } from './Dropdown';
import '@trendmicro/react-buttons/dist/react-buttons.css';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import { Button } from 'react-bootstrap';

class Inspiration extends Component {
  constructor(props){
    super(props);
    this.state = {
      category: "Category",
      lessons:[
        {
          mainActivity: "",
          theme: "",
          warmup: "",
          _id: ""
        }
      ],
      started: 0
    };
  }

  handleGo(){

    const body_str = JSON.stringify({
      category: this.state.category
    });

    const req = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: body_str
    }

    const uri = 'http://localhost:8080/inspiration'

    fetch(uri, req)
      .then(res => res.json())
      .then(data => {
        this.setState({
          lessons: data,
          started: 1
        })

      });
  }

  render() {
    return (
      <div className="inspirationContainer">
      <h1> Inspiration </h1>
      <div className="inspirationHeaderContainer">
        <Button className="inspirationOptionButton" onClick={() => {this.setState({category:"Themes", started: 0});this.handleGo()}}>Themes</Button>
        <Button className="inspirationOptionButton" onClick={() =>{this.setState({category:"Warmups", started: 0});this.handleGo()}}>Warmups</Button>
        <Button className="inspirationOptionButton" onClick={() => {this.setState({category:"Main Activites", started: 0});this.handleGo()}}>Main Activities</Button>
</div>
      {/* <Dropdown className="dropDownContainer">
        <DropdownToggle btnStyle="flat">{this.state.category}</DropdownToggle>
        <DropdownMenu className="ddMenu">


          <MenuItem onClick={() => this.setState({category:"Category", started: 0})}>Category</MenuItem>
          <MenuItem onClick={() => {this.setState({category:"Themes", started: 0});this.handleGo()}}>Themes</MenuItem>
          <MenuItem onClick={() => {this.setState({category:"Warmups", started: 0});this.handleGo()}}>Warmups</MenuItem>
          <MenuItem onClick={() => {this.setState({category:"Main Activites", started: 0});this.handleGo()}}>Main activities</MenuItem>
        </DropdownMenu>
      </Dropdown> */}
      <div>
      <ul>
      {
        this.state.started ?
          (
            this.state.lessons.length ?
              (
                this.state.category === "Themes" ?
                  (
                    this.state.lessons.map((item, index) => <li className="inspirationList" key={index}> {item.theme} </li>)
                  ) : this.state.category === "Warmups" ?
                  (
                    this.state.lessons.map((item, index) => <li className="inspirationList" key={index}> {item.warmup} </li>)
                  ) : this.state.category === "Main Activites" ?
                  (
                    this.state.lessons.map((item, index) => <li className="inspirationList" key={index}> {item.mainActivity} </li>)
                  )
                  : <h3> Please select a category </h3>


              ) : <h3>No results found</h3>
           ): null
      }
    </ul>

      </div>
      </div>
      // </div>
    );
  }
}

export default Inspiration;
