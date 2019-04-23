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
      gradeStart: "Grade Start",
      gradeEnd:"Grade End",
      semester:"Semester",
      dayOfWeek:"Weekday",

      theme: "",
      unit: "",
      subunit: "",
      goal: "",
      introduction: "",
      warmup: "",
      mainActivity: "",
      backupActivity: "",
      reflection: "",
      additionalGame: "",
      materials: ""
    };
  }

  handleLessonName(event) {
    this.setState({lessonName:event.target.value});
  }
  handleTheme(event){
    this.setState({theme:event.target.value});
  }
  handleUnit(event){
    this.setState({unit:event.target.value});
  }
  handleSubunit(event){
    this.setState({subunit:event.target.value});
  }
  handleGoals(event){
    this.setState({goal:event.target.value});
  }
  handleIntro(event){
    this.setState({introduction:event.target.value});
  }
  handleWarmUp(event){
    this.setState({warmup:event.target.value});
  }
  handleMainActivity(event){
    this.setState({mainActivity:event.target.value});
  }
  handleBackupActivity(event){
    this.setState({backupActivity:event.target.value});
  }
  handleReflection(event){
    this.setState({reflection:event.target.value});
  }
  handleAdditionalGame(event){
    this.setState({additionalGame:event.target.value});
  }
  handleMaterials(event){
    this.setState({materials:event.target.value});
  }

  selected(type, value, event) {
    console.log(type)
    if (type === "semester") {
      this.setState({started:true,semester:value})
    }if (type === "dayOfWeek") {
      this.setState({started:true, dayOfWeek: value})
    } if (type ==="gradeStart") {
      this.setState({started:true, gradeStart: value})
    } if (type ==="gradeEnd") {
      this.setState({started:true, gradeEnd: value})
    } if(type === "subject"){
      this.setState({started:true, subject: value})
    } if(type === "monthOfLesson"){
      this.setState({started:true, monthOfLesson: value})
    } if(type === "dayOfLesson"){
      this.setState({started:true, dayOfLesson: value})
    } if(type === "yearOfLesson"){
      this.setState({started:true, yearOfLesson: value})
    }
  }

  render () {
    return (
      <div className="newPageContainer">
        <div className="headerContainer">
          <h1>Basic Info</h1>
          <div className="headerTextContainer">
          <label>Lesson Name: </label>
          <input id="searchBar" type="text" placeholder="Lesson name ... " onChange={this.handleLessonName.bind(this)} />
        </div>
          <div className="headerDropDownContainer">
            <div>
              {/* <label>Semester: </label> */}
            <Dropdown className="dropDownContainer">
              <DropdownToggle btnStyle="flat">{this.state.semester}</DropdownToggle>
              <DropdownMenu>
                <MenuItem onClick={this.selected.bind(this, "semester", "Semester")}>Semester</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "semester", "Fall 2018")}>Fall 2018</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "semester", "Spring 2018")}>Spring 2018</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "semester", "Fall 2019")}>Fall 2019</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "semester", "Spring 2019")}>Spring 2019</MenuItem>
              </DropdownMenu>
            </Dropdown>
            </div>
            <div>
            {/* <label>Day: </label> */}
            <Dropdown className="dropDownContainer">
              <DropdownToggle btnStyle="flat">{this.state.dayOfWeek}</DropdownToggle>
              <DropdownMenu>
                <MenuItem onClick={this.selected.bind(this, "dayOfWeek", "Weekday")}>Weekday</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfWeek", "Monday")}>Monday</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfWeek", "Tuesday")}>Tuesday</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfWeek", "Wednesday")}>Wednesday</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfWeek", "Thursday")}>Thursday</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfWeek", "Friday")}>Friday</MenuItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div>
          {/* <label>Date: </label> */}
          <Dropdown className="dropDownContainer">
            <DropdownToggle btnStyle="flat">{this.state.monthOfLesson}</DropdownToggle>
            <DropdownMenu>
              <MenuItem onClick={this.selected.bind(this, "monthOfLesson", "Month")}>Month</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "monthOfLesson", "January")}>January</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "monthOfLesson", "February")}>February</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "monthOfLesson", "March")}>March</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "monthOfLesson", "April")}>April</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "monthOfLesson", "May")}>May</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "monthOfLesson", "June")}>June</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "monthOfLesson", "July")}>July</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "monthOfLesson", "August")}>August</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "monthOfLesson", "September")}>September</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "monthOfLesson", "October")}>October</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "monthOfLesson", "November")}>November</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "monthOfLesson", "December")}>December</MenuItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown className="dropDownContainer">
            <DropdownToggle btnStyle="flat">{this.state.yearOfLesson}</DropdownToggle>
            <DropdownMenu>
              <MenuItem onClick={this.selected.bind(this, "yearOfLesson", "Year")}>Year</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "yearOfLesson", "2019")}>2019</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "yearOfLesson", "2018")}>2018</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "yearOfLesson", "2017")}>2017</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "yearOfLesson", "2016")}>2016</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "yearOfLesson", "2015")}>2015</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "yearOfLesson", "2014")}>2014</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "yearOfLesson", "2013")}>2013</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "yearOfLesson", "2012")}>2012</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "yearOfLesson", "2011")}>2011</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "yearOfLesson", "2010")}>2010</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "yearOfLesson", "2009")}>2009</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "yearOfLesson", "2008")}>2008</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "yearOfLesson", "2007")}>2007</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "yearOfLesson", "2006")}>2006</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "yearOfLesson", "2005")}>2005</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "yearOfLesson", "2004")}>2004</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "yearOfLesson", "2003")}>2003</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "yearOfLesson", "2002")}>2002</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "yearOfLesson", "2001")}>2001</MenuItem>
              <MenuItem onClick={this.selected.bind(this, "yearOfLesson", "2000")}>2000</MenuItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div>
        {/* <label>Grade Start: </label> */}
        <Dropdown className="dropDownContainer">
          <DropdownToggle btnStyle="flat">{this.state.gradeStart}</DropdownToggle>
          <DropdownMenu className="ddMenu">
            <MenuItem onClick={this.selected.bind(this, "gradeStart", "Grade Start")}>Grade Start</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeStart", "K")}>K</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeStart", "1")}>1</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeStart", "2")}>2</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeStart", "3")}>3</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeStart", "4")}>4</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeStart", "5")}>5</MenuItem>
          </DropdownMenu>
        </Dropdown>
        </div>
        <div>
        {/* <label>Grade End: </label> */}
        <Dropdown className="dropDownContainer">
          <DropdownToggle btnStyle="flat">{this.state.gradeEnd}</DropdownToggle>
          <DropdownMenu className="ddMenu">
            <MenuItem onClick={this.selected.bind(this, "gradeEnd", "Grade End")}>Grade End</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeEnd", "K")}>K</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeEnd", "1")}>1</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeEnd", "2")}>2</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeEnd", "3")}>3</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeEnd", "4")}>4</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeEnd", "5")}>5</MenuItem>
          </DropdownMenu>
        </Dropdown>
        </div>
          <div>
            {/* <label>Subject: </label> */}
            <Dropdown className="dropDownContainer">
              <DropdownToggle btnStyle="flat">{this.state.subject}</DropdownToggle>
              <DropdownMenu>
                <MenuItem onClick={this.selected.bind(this, "subject", "Subject")}>Subject</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "subject", "Math")}>Math</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "subject", "Science")}>Science</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "subject", "English")}>English</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "subject", "Social Studies")}>Social Studies</MenuItem>
              </DropdownMenu>
            </Dropdown>
            </div>
          </div>
          <h1>Details</h1>
        </div>
          <div className="inputContainer">
            <div className="smallBox">
              <label>Theme</label>
              <br></br>
              <input className="shortBox" type="text" onChange={this.handleTheme.bind(this)}></input>
            </div>
            <div className="smallBox">
              <label>Unit</label>
              <br></br>
              <input className="shortBox" type="text" onChange={this.handleUnit.bind(this)}></input>
            </div>
            <div className="smallBox">
              <label>Subunit</label>
              <br></br>
              <input className="shortBox" type="text" onChange={this.handleSubunit.bind(this)}></input>
            </div>
            <div className="box">
              <label>Goals of the Day</label>
              <br></br>
              <textarea onChange={this.handleGoals.bind(this)}></textarea>
            </div>
            <div className="box">
              <label>Introduction</label>
              <br></br>
              <textarea onChange={this.handleIntro.bind(this)}></textarea>
            </div>
            <div className="box">
              <label>Warm Up</label>
              <br></br>
              <textarea onChange={this.handleWarmUp.bind(this)}></textarea>
            </div>
            <div className="box">
              <label>Main Activity</label>
              <br></br>
              <textarea onChange={this.handleMainActivity.bind(this)}></textarea>
            </div>
            <div className="box">
              <label>Backup Activity</label>
              <br></br>
              <textarea onChange={this.handleBackupActivity.bind(this)}></textarea>
            </div>
            <div className="box">
              <label>Reflection</label>
              <br></br>
              <textarea onChange={this.handleReflection.bind(this)}></textarea>
            </div>
            <div className="box">
              <label>Additional Game</label>
              <br></br>
              <textarea onChange={this.handleAdditionalGame.bind(this)}></textarea>
            </div>
            <div className="box">
              <label>Materials</label>
              <br></br>
              <textarea onChange={this.handleMaterials.bind(this)}></textarea>
            </div>
          </div>
          <div className="footerContainer">
            <Button className="saveButton">Save</Button>
            <Button className="submitButton">Submit</Button>
          </div>
        {/* </div> */}
      </div>
    );
  }
}

export default NewPage;
