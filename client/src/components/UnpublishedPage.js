import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types'
import Dropdown from './Dropdown';
import { DropdownMenu, MenuItem, DropdownToggle } from './Dropdown'
import '@trendmicro/react-buttons/dist/react-buttons.css';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import './style/style.css';


class UnpublishedPage extends Component {
  constructor(props){
    super(props);
    this.state =
    {
      userMessage:"",
      userError: "",

      lesson_id:"",

      // TODO: lesson_id: String, // TODO: unique id for lesson - handle in server
      published: 0, // 1 is true or 0 is false
      // creator: Number, // TODO: return session number to get user ID - handle in server
      datePublished: "", // Number, UNIX time

      lessonName: "",
      monthOfLesson:"Month",
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
      materials: [{
        material:"",
        quantity:""
      }]
    };
  }

  componentDidMount() {
    this.setUp();
  }

  setUp = () => {
    const session = localStorage.getItem('session');
    const lesson_id = this.props.match.params.lesson_id;
    const uri = 'http://localhost:8080/' + session + '/getpage/' + this.props.match.params.lesson_id;
    fetch(uri)
      .then(res => res.json())
      .then(info => {
        console.log("page INFO: " + info.pageInfo[0].gradeEnd);
        console.log("page INFO: " + info.pageInfo[0].gradeStart);
        // console.log("theme: " + info.theme);


        this.setState({

          userMessage: "",
          userError: "",
          lesson_id:lesson_id,
          session:localStorage.getItem('session'),

          lessonName: info.pageInfo[0].lessonName,
          theme: info.pageInfo[0].theme,
          unit: info.pageInfo[0].unit,
          subunit: info.pageInfo[0].subunit,

          monthOfLesson: info.pageInfo[0].monthOfLesson,

          yearOfLesson:
          (info.pageInfo[0].yearOfLesson === -1) ?
            ('Year') :
            (info.pageInfo[0].yearOfLesson),

          dayOfWeek: info.pageInfo[0].dayOfWeek,

          gradeStart:
          (info.pageInfo[0].gradeStart === 0) ?
            ('K') :
            ((info.pageInfo[0].gradeStart === -1) ?
              ('Grade Start') :
              (info.pageInfo[0].gradeStart)),

          gradeEnd:
          (info.pageInfo[0].gradeEnd === 0) ?
            ('K') :
            ((info.pageInfo[0].gradeEnd === -1) ?
              ('Grade End') :
              (info.pageInfo[0].gradeEnd)),

          semester: info.pageInfo[0].semester,
          subject: info.pageInfo[0].subject,
          goal: info.pageInfo[0].goal,
          introduction: info.pageInfo[0].introduction,
          warmup: info.pageInfo[0].warmup,
          mainActivity: info.pageInfo[0].mainActivity,
          backupActivity: info.pageInfo[0].backupActivity,
          reflection: info.pageInfo[0].reflection,
          materials: info.pageInfo[0].materials
        });

      });
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
    } if (type === "dayOfWeek") {
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

    // save to database
    // Whenever unpublished lessons are sent to the server,
    // make sure the users are able to edit them


  publishLesson() {
    // Verify everything is ok, if not throw error
    if((this.state.lessonName!=="") && (this.state.semester!=="Semester") &&
    (this.state.dayOfWeek!=="Weekday") && (this.state.monthOfLesson!=="Month") &&
    (this.state.yearOfLesson!=="Year") && (this.state.gradeStart!=="Grade Start") &&
    (this.state.gradeEnd!=="Grade End") && (this.state.subject!=="Subject")&&
    (this.state.theme!=="") && (this.state.unit!=="") && (this.state.subunit!=="") &&
    (this.state.goal!=="") && (this.state.introduction!=="") && (this.state.warmup!=="") &&
    (this.state.mainActivity!=="") && (this.state.backupActivity!=="")) {
      document.getElementById("missingFieldMessage").style.visibility = "hidden";
      this.postLesson();
    } else {
      document.getElementById("missingFieldMessage").style.visibility = "visible";
      if (this.state.lessonName==="") {
        document.getElementById("searchBar").style.borderColor = "red";
        document.getElementById("missingLesson").style.visibility = "visible";
      } else{
        document.getElementById("searchBar").style.borderColor = "black";
        document.getElementById("missingLesson").style.visibility = "hidden";
      }
      if(this.state.semester==="Semester"){
        document.getElementById("semesterDropdown").style.borderColor="red";
        document.getElementById("missingSemester").style.visibility="visible";
      } else{
        document.getElementById("semesterDropdown").style.borderColor = "#ccc";
        document.getElementById("missingSemester").style.visibility="hidden";
      }
      if(this.state.dayOfWeek==="Weekday"){
        document.getElementById("dayDropdown").style.borderColor="red";
        document.getElementById("missingDay").style.visibility="visible";
      } else{
        document.getElementById("dayDropdown").style.borderColor="#ccc";
        document.getElementById("missingDay").style.visibility="hidden";
      }
      if(this.state.monthOfLesson==="Month"){
        document.getElementById("monthDropdown").style.borderColor="red";
        document.getElementById("missingMonth").style.visibility="visible";
      } else{
        document.getElementById("monthDropdown").style.borderColor="#ccc";
        document.getElementById("missingMonth").style.visibility="hidden";
      }
      if(this.state.yearOfLesson==="Year"){
        document.getElementById("yearDropdown").style.borderColor="red";
        document.getElementById("missingYear").style.visibility="visible";
      } else{
        document.getElementById("yearDropdown").style.borderColor="#ccc";
        document.getElementById("missingYear").style.visibility="hidden";
      }
      if(this.state.gradeStart==="Grade Start"){
        document.getElementById("gradeStartDropdown").style.borderColor="red";
        document.getElementById("missingGradeStart").style.visibility="visible";
      } else{
        document.getElementById("gradeStartDropdown").style.borderColor="#ccc";
        document.getElementById("missingGradeStart").style.visibility="hidden";
      }
      if(this.state.gradeEnd==="Grade End"){
        document.getElementById("gradeEndDropdown").style.borderColor="red";
        document.getElementById("missingGradeEnd").style.visibility="visible";
      } else{
        document.getElementById("gradeEndDropdown").style.borderColor="#ccc";
        document.getElementById("missingGradeEnd").style.visibility="hidden";
      }
      if(this.state.subject==="Subject"){
        document.getElementById("subjectDropdown").style.borderColor="red";
        document.getElementById("missingSubject").style.visibility="visible";
      } else{
        document.getElementById("subjectDropdown").style.borderColor="#ccc";
        document.getElementById("missingSubject").style.visibility="hidden";
      }
      if (this.state.theme==="") {
        document.getElementById("themeBox").style.borderColor = "red";
        document.getElementById("missingTheme").style.visibility="visible";
      } else{
        document.getElementById("themeBox").style.borderColor = "black";
        document.getElementById("missingTheme").style.visibility="hidden";
      }
      if (this.state.unit==="") {
        document.getElementById("unitBox").style.borderColor = "red";
        document.getElementById("missingUnit").style.visibility="visible";
      } else{
        document.getElementById("unitBox").style.borderColor = "black";
        document.getElementById("missingUnit").style.visibility="hidden";
      }
      if (this.state.subunit==="") {
        document.getElementById("subunitBox").style.borderColor = "red";
        document.getElementById("missingSubunit").style.visibility="visible";
      } else{
        document.getElementById("subunitBox").style.borderColor = "black";
        document.getElementById("missingSubunit").style.visibility="hidden";
      }
      if (this.state.goal==="") {
        document.getElementById("goalBox").style.borderColor = "red";
        document.getElementById("missingGoals").style.visibility="visible";
      } else{
        document.getElementById("goalBox").style.borderColor = "black";
        document.getElementById("missingGoals").style.visibility="hidden";
      }
      if (this.state.introduction===""){
        document.getElementById("introBox").style.borderColor = "red";
        document.getElementById("missingIntro").style.visibility="visible";
      } else{
        document.getElementById("introBox").style.borderColor = "black";
        document.getElementById("missingIntro").style.visibility="hidden";
      }
      if (this.state.warmup===""){
        document.getElementById("warmupBox").style.borderColor = "red";
        document.getElementById("missingWarmup").style.visibility="visible";
      } else{
        document.getElementById("warmupBox").style.borderColor = "black";
        document.getElementById("missingWarmup").style.visibility="hidden";
      }
      if (this.state.mainActivity===""){
        document.getElementById("mainActivityBox").style.borderColor = "red";
        document.getElementById("missingMainActivity").style.visibility="visible";
      } else{
        document.getElementById("mainActivityBox").style.borderColor = "black";
        document.getElementById("missingMainActivity").style.visibility="hidden";
      }
      if (this.state.backupActivity===""){
        document.getElementById("backupActivityBox").style.borderColor = "red";
        document.getElementById("missingBackupActivity").style.visibility="visible";
      } else {
        document.getElementById("backupActivityBox").style.borderColor = "black";
        document.getElementById("missingBackupActivity").style.visibility="hidden";
      }

      console.log("NOT EVERYTHING IS FILLED OUT!")
    }
  }

  resetStuff(info) {
    this.setState({
      userMessage:info.message, // TODO inspect
      userError: "", // TODO Style green
      session:localStorage.getItem('session'),
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
      materials: [{
        material:"",
        quantity:""
      }]
    });
  }

  verifySave() {
    // TODO: at least one field must be filled in
    if((this.state.lessonName!=="") || (this.state.semester!=="Semester") ||
    (this.state.dayOfWeek!=="Weekday") || (this.state.monthOfLesson!=="Month") ||
    (this.state.yearOfLesson!=="Year") || (this.state.gradeStart!=="Grade Start") ||
    (this.state.gradeEnd!=="Grade End") || (this.state.subject!=="Subject") ||
    (this.state.theme!=="") || (this.state.unit!=="") || (this.state.subunit!=="") ||
    (this.state.goal!=="") || (this.state.introduction!=="") || (this.state.warmup!=="") ||
    (this.state.mainActivity!=="") || (this.state.backupActivity!=="")){
      return true;
    } else {
      return false;
    }
  }

  postLesson() {
    this.addToDB(1);
  }

  saveLesson() {
    //publish 0
    if (this.verifySave()) {
      this.addToDB(0);
    } else {
      console.log('Can\'t post, invalid')
      return;
    }
  }

 //// DO MULTIPLE SUBMITS ACTUALLY UPDATE THE LESSON NAME?
  addToDB = (num) => {
    const body_str = JSON.stringify({
      lesson_id: -1, // unique id for lesson
      published: num, // 1 is true or 0 is false
      creator: -1, // user ID
      datePublished: Date.now(), //UNIX time

      lessonName: this.state.lessonName,
      monthOfLesson:this.state.monthOfLesson,
      yearOfLesson:
      (this.state.yearOfLesson === 'Year') ?
        (-1) :
        (this.state.yearOfLesson),

      subject:this.state.subject,
      gradeStart:
      (this.state.gradeStart === 'K') ?
        (0) :
        ((this.state.gradeStart === 'Grade Start') ?
          (-1) :
          (this.state.gradeStart)),
      gradeEnd:
      (this.state.gradeEnd === 'K') ?
        (0) :
        ((this.state.gradeEnd === 'Grade End') ?
          (-1) :
          (this.state.gradeEnd)),
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
      materials: this.state.materials
    });

    console.log(body_str)

    const req = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: body_str
    }

    const session = localStorage.getItem('session');
    const uri = 'http://localhost:8080/' + session + '/getpage/' + this.state.lesson_id;

    fetch(uri, req)
      .then(res => res.json())
      .then(info => {
        if (info.received) {
          if (num > 0) {
            this.resetStuff(info);
            // TODO write a published message
          } else {
            // TODO write a saved message
          }
        } else {
          this.setState({
            userError: info.message
          });
        }
      });
  }
  addMaterial(){
    this.setState(prevState => ({
      materials: [...prevState.materials, { material: "", quantity: "" }]
    }))
  }

  handleMaterialsChange(i, e) {
     const { name, value } = e.target;
     let materials = [...this.state.materials];
     materials[i] = {...materials[i], [name]: value};
     console.log(this.state.materials)
     this.setState({ materials: materials });
  }

  removeClick(i) {
     let materials = [...this.state.materials];
     materials.splice(i, 1);
     this.setState({ materials: materials });
  }
  createUI() {
     return this.state.materials.map((el, i) => (
       <div className="materialsContainer" key={i}>
          <div className="itemContainer">
          <label> Item </label>
    	    <input className="materialInput" name="material" value={el.material ||''} onChange={this.handleMaterialsChange.bind(this, i)} />
          </div>
          <div className="itemContainer">
          <label> Quantity </label>
          <input className="materialInput" name="quantity" value={el.quantity ||''} onChange={this.handleMaterialsChange.bind(this, i)} />
          </div>
          <Button id ="materialButton2" className="materialButton" onClick={this.removeClick.bind(this, i)}> Remove </Button>
       </div>
     ))
  }

  notanumber() {
    console.log("Not a number!")
  }

  render () {
    return (
      <div className="newPageContainer">
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
        <div className="headerContainer">
          <h1>Edit Lesson Page</h1>
          <p id="missingFieldMessage">Missing Field(s)</p>
          <div className="headerTextContainer">
          <label>Lesson Name: <span id="missingLesson" className="asterisk">*</span></label>
          <input id="searchBar" value={this.state.lessonName} type="text" placeholder="Lesson name ... " onChange={this.handleLessonName.bind(this)} />

        </div>
          <div className="headerDropDownContainer">
            <div>
              {/* <label>Semester: </label> */}
            <Dropdown className="dropDownContainer">
              <DropdownToggle id="semesterDropdown" btnStyle="flat">{this.state.semester}</DropdownToggle>
              <DropdownMenu className="ddMenu">
                <MenuItem onClick={this.selected.bind(this, "semester", "Semester")}>Semester</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "semester", "Fall 2018")}>Fall 2018</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "semester", "Spring 2018")}>Spring 2018</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "semester", "Fall 2019")}>Fall 2019</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "semester", "Spring 2019")}>Spring 2019</MenuItem>
              </DropdownMenu>
            </Dropdown><span id="missingSemester" className="asterisk">*</span>
            </div>
            <div>
            {/* <label>Day: </label> */}
            <Dropdown className="dropDownContainer">
              <DropdownToggle id="dayDropdown" btnStyle="flat">{this.state.dayOfWeek}</DropdownToggle>
              <DropdownMenu className="ddMenu">
                <MenuItem onClick={this.selected.bind(this, "dayOfWeek", "Weekday")}>Weekday</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfWeek", "Monday")}>Monday</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfWeek", "Tuesday")}>Tuesday</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfWeek", "Wednesday")}>Wednesday</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfWeek", "Thursday")}>Thursday</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfWeek", "Friday")}>Friday</MenuItem>
              </DropdownMenu>
            </Dropdown><span id="missingDay" className="asterisk">*</span>
          </div>
          <div>
          {/* <label>Date: </label> */}
          <Dropdown className="dropDownContainer">
            <DropdownToggle id="monthDropdown" btnStyle="flat">{this.state.monthOfLesson}</DropdownToggle>
            <DropdownMenu className="ddMenu">
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
          </Dropdown><span id="missingMonth" className="asterisk">*</span>
          <Dropdown className="dropDownContainer">
            <DropdownToggle id="yearDropdown" btnStyle="flat">{this.state.yearOfLesson}</DropdownToggle>
            <DropdownMenu className="ddMenu">
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
          </Dropdown><span id="missingYear" className="asterisk">*</span>
        </div>
        <div>
        {/* <label>Grade Start: </label> */}
        <Dropdown className="dropDownContainer">
          <DropdownToggle id="gradeStartDropdown" btnStyle="flat">{this.state.gradeStart}</DropdownToggle>
          <DropdownMenu className="ddMenu">
            <MenuItem onClick={this.selected.bind(this, "gradeStart", "Grade Start")}>Grade Start</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeStart", "K")}>Kindergarten</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeStart", "1")}>Grade 1</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeStart", "2")}>Grade 2</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeStart", "3")}>Grade 3</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeStart", "4")}>Grade 4</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeStart", "5")}>Grade 5</MenuItem>
          </DropdownMenu>
        </Dropdown><span id="missingGradeStart" className="asterisk">*</span>
        </div>
        <div>
        {/* <label>Grade End: </label> */}
        <Dropdown className="dropDownContainer">
          <DropdownToggle id="gradeEndDropdown" btnStyle="flat">{this.state.gradeEnd}</DropdownToggle>
          <DropdownMenu className="ddMenu">
            <MenuItem onClick={this.selected.bind(this, "gradeEnd", "Grade End")}>Grade End</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeEnd", "K")}>Kindergarten</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeEnd", "1")}>Grade 1</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeEnd", "2")}>Grade 2</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeEnd", "3")}>Grade 3</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeEnd", "4")}>Grade 4</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeEnd", "5")}>Grade 5</MenuItem>
          </DropdownMenu>
        </Dropdown><span id="missingGradeEnd" className="asterisk">*</span>
        </div>
          <div>
            {/* <label>Subject: </label> */}
            <Dropdown className="dropDownContainer">
              <DropdownToggle id="subjectDropdown" btnStyle="flat">{this.state.subject}</DropdownToggle>
              <DropdownMenu className="ddMenu">
                <MenuItem onClick={this.selected.bind(this, "subject", "Subject")}>Subject</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "subject", "Math")}>Math</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "subject", "Science")}>Science</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "subject", "English")}>English</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "subject", "Social Studies")}>Social Studies</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "subject", "Art")}>Art</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "subject", "Elective")}>Elective</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "subject", "Other")}>Other</MenuItem>
              </DropdownMenu>
            </Dropdown><span id="missingSubject" className="asterisk">*</span>
            </div>
          </div>
          {/* <h1>Details</h1> */}
        </div>
          <div id="inputStuffCollection" className="inputContainer">
            <div className="smallBox">
              <label>Theme<span id="missingTheme" className="asterisk">*</span></label>
              <br></br>
              <input id="themeBox" className="shortBox" type="text" value={this.state.theme} onChange={this.handleTheme.bind(this)}></input>
            </div>
            <div className="smallBox">
              <label>Unit<span id="missingUnit" className="asterisk">*</span></label>
              <br></br>
              <input id="unitBox"className="shortBox" type="text" value={this.state.unit} onChange={this.handleUnit.bind(this)}></input>
            </div>
            <div className="smallBox">
              <label>Subunit<span id="missingSubunit" className="asterisk">*</span></label>
              <br></br>
              <input id="subunitBox" className="shortBox" type="text" value={this.state.subunit} onChange={this.handleSubunit.bind(this)}></input>
            </div>
            <div className="box">
              <label>Goals of the Day<span id="missingGoals" className="asterisk">*</span></label>
              <br></br>
              <textarea id="goalBox" value={this.state.goal} onChange={this.handleGoals.bind(this)}></textarea>
            </div>
            <div className="box">
              <label>Introduction<span id="missingIntro" className="asterisk">*</span></label>
              <br></br>
              <textarea id="introBox" value={this.state.introduction} onChange={this.handleIntro.bind(this)}></textarea>
            </div>
            <div className="box">
              <label>Warm Up<span id="missingWarmup" className="asterisk">*</span></label>
              <br></br>
              <textarea id="warmupBox" value={this.state.warmup} onChange={this.handleWarmUp.bind(this)}></textarea>
            </div>
            <div className="box">
              <label>Main Activity<span id="missingMainActivity" className="asterisk">*</span></label>
              <br></br>
              <textarea id="mainActivityBox" value={this.state.mainActivity} onChange={this.handleMainActivity.bind(this)}></textarea>
            </div>
            <div className="box">
              <label>Backup Activity<span id="missingBackupActivity" className="asterisk">*</span></label>
              <br></br>
              <textarea id="backupActivityBox" value={this.state.backupActivity} onChange={this.handleBackupActivity.bind(this)}></textarea>
            </div>
            <div className="box">
              <label>Reflection</label>
              <br></br>
              <textarea value={this.state.reflection} onChange={this.handleReflection.bind(this)}></textarea>
            </div>

            <div className="box" id="scrollForAddMaterials">
              <label>Materials</label> <div></div>
              <Button className="materialButton" onClick={this.addMaterial.bind(this)}> Add material <div> {console.log(this.state.materials)} </div> </Button>
              <div>{this.createUI()}</div>
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

export default UnpublishedPage;
