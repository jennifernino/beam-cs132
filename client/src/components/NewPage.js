import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types'
import Dropdown from './Dropdown';
import { DropdownMenu, MenuItem, DropdownToggle } from './Dropdown'
import '@trendmicro/react-buttons/dist/react-buttons.css';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import './style/style.css';


class NewPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      lessonName: "",

      monthOfLesson:"Month",
      dayOfLesson:"Day",
      yearOfLesson:"Year",

      subject:"Subject",
      grade:"Grade",
      semester:"Semester",
      dayOfWeek:"Day of Week"
    };
  }

  handleLessonName(event) {
    this.setState({lessonName:event.target.value});
    console.log(this.state.lessonName)
  }

  selected(type, value, event) {
    console.log(type)
    if (type === "semester") {
      this.setState({started:true,semester:value})
      console.log(type)
      console.log(value)
    }

  }

  render () {
    return (
      <div className="newPageContainer">
        <p>hello</p>
        <div className="headerContainer">
          <label>Lesson Name</label>
          <input id="searchBar" type="text" placeholder="Lesson name ... " onChange={this.handleLessonName.bind(this)} />

          <div className="headerDropDownContainer">

            <Dropdown className="dropDownContainer">
              <DropdownToggle btnStyle="flat">{this.state.semester}</DropdownToggle>
              <DropdownMenu>
                <MenuItem onClick={this.selected.bind(this, "semester", "Fall 2018")}>Fall 2018</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "semester", "Spring 2018")}>Spring 2018</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "semester", "Fall 2019")}>Fall 2019</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "semester", "Spring 2019")}>Spring 2019</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "semester", "None")}>None</MenuItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="inputContainer">
            <label>Goals of the Day</label>
            <textarea></textarea>
            <br></br>
            <label>Introduction</label>
            <textarea></textarea>
            <br></br>
            <label>Main Activity</label>
            <textarea></textarea>
            <br></br>
            <label>Backup Activity</label>
            <textarea></textarea>
          </div>
          <div className="footerContainer">
            <Button>Save</Button>
            <Button>Submit</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default NewPage;
