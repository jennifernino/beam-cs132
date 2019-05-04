import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types'
import Dropdown from './Dropdown';
import { DropdownMenu, MenuItem, DropdownToggle } from './Dropdown'
import '@trendmicro/react-buttons/dist/react-buttons.css';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import './style/style.css';


class EditLesson extends Component {
  constructor(props){
    super(props);
    this.state =
    {
      userMessage:"", // TODO inspect
      userError: "", // TODO Style green
      session:"",
      // TODO: lesson_id: String, // TODO: unique id for lesson - handle in server
      published: 0, // 1 is true or 0 is false
      // creator: Number, // TODO: return session number to get user ID - handle in server
      datePublished: "", // Number, UNIX time

      lessonName: "", // String
      monthOfLesson:"Month", // String
      yearOfLesson:"Year", // Number

      subject:"Subject",
      gradeStart: "Grade Start", // Number
      gradeEnd:"Grade End", // Number
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
      quote: "", // TODO: Not yet implemented
      materials: "", // TODO: Revise implementation
      // materials: [{
      //   item: String,
      //   quantity: Number
      // }]
    };
  }
  componentDidMount() {
    const lesson_id = 1;// this.props.lesson_id;
    this.setUp(lesson_id);

  }

  setUp = (id) => {
    const session = this.state.session;
    const uri = 'http://localhost:8080/' + session + '/' + id + '/editLesson';
    console.log(uri)
    fetch(uri)
      .then(res => res.json())
      .then(data => {
        console.log(data) // update sheet here before it renders? Maybe add a spinny wheel thing?
      })
  }

  handleLessonName(event) {
    this.setState({
      userMessage: "",
      userError: "",
      lessonName:event.target.value
    });
  }

  handleTheme(event) {
    this.setState({
      userMessage: "",
      userError: "",
      theme:event.target.value
    });
  }

  handleUnit(event) {
    this.setState({
      userMessage: "",
      userError: "",
      unit:event.target.value
    });
  }

  handleSubunit(event) {
    this.setState({
      userMessage: "",
      userError: "",
      subunit:event.target.value
    });
  }

  handleGoals(event) {
    this.setState({
      userMessage: "",
      userError: "",
      goal:event.target.value
    });
  }

  handleIntro(event) {
    this.setState({
      userMessage: "",
      userError: "",
      introduction:event.target.value
    });
  }

  handleWarmUp(event) {
    this.setState({
      userMessage: "",
      userError: "",
      warmup:event.target.value
    });
  }

  handleMainActivity(event) {
    this.setState({
      userMessage: "",
      userError: "",
      mainActivity:event.target.value
    });
  }

  handleBackupActivity(event) {
    this.setState({
      userMessage: "",
      userError: "",
      backupActivity:event.target.value
    });
  }

  handleReflection(event) {
    this.setState({
      userMessage: "",
      userError: "",
      reflection:event.target.value
    });
  }

  handleAdditionalGame(event) {
    this.setState({
      userMessage: "",
      userError: "",
      additionalGame:event.target.value
    });
  }

  handleMaterials(event) {
    this.setState({
      userMessage: "",
      userError: "",
      materials:event.target.value
    });
  }

  selected(type, value, event) {
    if (type === "semester") {
      this.setState({semester:value})
    }if (type === "dayOfWeek") {
      this.setState({dayOfWeek: value})
    } if (type ==="gradeStart") {
      this.setState({gradeStart: value})
    } if (type ==="gradeEnd") {
      this.setState({gradeEnd: value})
    } if(type === "subject"){
      this.setState({subject: value})
    } if(type === "monthOfLesson"){
      this.setState({monthOfLesson: value})
    } if(type === "dayOfLesson"){
      this.setState({dayOfLesson: value})
    } if(type === "yearOfLesson"){
      this.setState({yearOfLesson: value})
    }
  }

  saveLesson() {
    // save to database
    // Whenever unpublished lessons are sent to the server,
    // make sure the users are able to edit them
  }

  publishLesson() {
    // Verify everything is ok, if not throw error
    this.postLesson(1);
  }

  resetStuff() {
    console.log("ji")
  }

  postLesson = (num) => {

    const body_str = JSON.stringify({
      lesson_id: -1, // unique id for lesson
      published: num, // 1 is true or 0 is false
      creator: -1, // user ID
      datePublished: Date.now(), //UNIX time

      lessonName: this.state.lessonName,
      monthOfLesson:this.state.monthOfLesson,
      yearOfLesson: "0000", //this.state.yearOfLesson,

      subject:this.state.subject,
      gradeStart: "1", //this.state.gradeStart,
      gradeEnd: "1", // this.state.gradeEnd,
      semester:this.state.semester,
      dayOfWeek:this.state.dayOfWeek,

      theme: this.state.theme,
      unit: this.state.unit,
      subunit: this.state.subunit,
      goal: this.state.goal,
      introduction: this.state.introduction,
      warmup: this.state.warmup,
      mainActivity: this.state.mainActivity,
      backupActivity: this.state.backupActivity,
      reflection: this.state.reflection,
      additionalGame: this.state.additionalGame,
      quote: "No quote",
      materials: ""
    });

    const req = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: body_str
    }

    const session = this.state.session;
    const uri = 'http://localhost:8080/' + session + '/newPage'

    fetch(uri, req)
      .then(res => res.json())
      .then(info => {
        if (info.received) {
          this.setState({
            userMessage:info.message, // TODO inspect
            userError: "", // TODO Style green
            session:this.state.session,
            // TODO: lesson_id: String, // TODO: unique id for lesson - handle in server
            published: 0, // 1 is true or 0 is false
            // creator: Number, // TODO: return session number to get user ID - handle in server
            datePublished: "", // Number, UNIX time

            lessonName: "", // String
            monthOfLesson:"Month", // String
            yearOfLesson:"Year", // Number

            subject:"Subject",
            gradeStart: "Grade Start", // Number
            gradeEnd:"Grade End", // Number
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
            quote: "", // TODO: Not yet implemented
            materials: "", // TODO: Update as needed (array?)
          });
          this.resetStuff();
        } else {
          this.setState({
            userError: info.message
          });
        }
      });
  }

  render () {
    return (
      <div className="newPageContainer">
        <div className="headerContainer">
          <h1>Basic Info</h1>
          <div className="headerTextContainer">
          <label>Lesson Name: </label>
          <input id="searchBar" value={this.state.lessonName} type="text" placeholder="Lesson name ... " onChange={this.handleLessonName.bind(this)} />
          {this.state.userMessage ?
            (
              <p className="userMessage">{this.state.userMessage}</p>
            ) : (
              this.state.userError ?
               (
                 <p className="userMessage">{this.state.userError}</p>
               ) :
               (
                 null
               )
            )}
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
          <div id="inputStuffCollection" className="inputContainer">
            <div className="smallBox">
              <label>Theme</label>
              <br></br>
              <input className="shortBox" type="text" value={this.state.theme} onChange={this.handleTheme.bind(this)}></input>
            </div>
            <div className="smallBox">
              <label>Unit</label>
              <br></br>
              <input className="shortBox" type="text" value={this.state.unit} onChange={this.handleUnit.bind(this)}></input>
            </div>
            <div className="smallBox">
              <label>Subunit</label>
              <br></br>
              <input className="shortBox" type="text" value={this.state.subunit} onChange={this.handleSubunit.bind(this)}></input>
            </div>
            <div className="box">
              <label>Goals of the Day</label>
              <br></br>
              <textarea value={this.state.goal} onChange={this.handleGoals.bind(this)}></textarea>
            </div>
            <div className="box">
              <label>Introduction</label>
              <br></br>
              <textarea value={this.state.introduction} onChange={this.handleIntro.bind(this)}></textarea>
            </div>
            <div className="box">
              <label>Warm Up</label>
              <br></br>
              <textarea value={this.state.warmup} onChange={this.handleWarmUp.bind(this)}></textarea>
            </div>
            <div className="box">
              <label>Main Activity</label>
              <br></br>
              <textarea value={this.state.mainActivity} onChange={this.handleMainActivity.bind(this)}></textarea>
            </div>
            <div className="box">
              <label>Backup Activity</label>
              <br></br>
              <textarea value={this.state.backupActivity} onChange={this.handleBackupActivity.bind(this)}></textarea>
            </div>
            <div className="box">
              <label>Reflection</label>
              <br></br>
              <textarea value={this.state.reflection} onChange={this.handleReflection.bind(this)}></textarea>
            </div>
            <div className="box">
              <label>Additional Game</label>
              <br></br>
              <textarea value={this.state.additionalGame} onChange={this.handleAdditionalGame.bind(this)}></textarea>
            </div>
            <div className="box">
              <label>Materials</label>
              <br></br>
              <textarea value={this.state.materials} onChange={this.handleMaterials.bind(this)}></textarea>
            </div>
          </div>
          <div className="footerContainer">
            <Button onClick={this.saveLesson.bind(this)} className="saveButton">Save</Button>
            <Button onClick={this.publishLesson.bind(this)} className="submitButton">Submit</Button>
          </div>
        {/* </div> */}
      </div>
    );
  }
}

export default EditLesson;
