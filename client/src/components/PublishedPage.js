import React, { Component } from 'react';
import './style/style.css';

class PublishedPage extends Component {

    constructor(props) {
      super(props);
      this.state = {
        // type:"",
        // color: "",
        lessonName: "",
        theme: "",
        unit: "",
        subunit: "",
        month: "",
        year: "",
        gradeStart: "",
        gradeEnd: "",
        semester: "",
        subject: "",
        goal: "",
        introduction: "",
        warmup: "",
        mainActivity: "",
        backupActivity: "",
        additionalGame: "",
        reflection: ""
      }
    }
    componentDidMount(){
      console.log(this.props.item);
      this.retrieveInfo();
    }

    retrieveInfo = () => {
      const session = this.props.session;
      const uri = 'http://localhost:8080/' + session + '/viewpage/' + this.props.match.params.lesson_id
      fetch(uri)
        .then(res => res.json())
        .then(info => {
          this.setState({
            lessonName: info.pageInfo[0].lessonName,
            theme: info.pageInfo[0].theme,
            unit: info.pageInfo[0].unit,
            subunit: info.pageInfo[0].subunit,
            month: info.pageInfo[0].monthOfLesson ,
            year: info.pageInfo[0].yearOfLesson,
            day: info.pageInfo[0].dayOfWeek,
            gradeStart: info.pageInfo[0].gradeStart,
            gradeEnd: info.pageInfo[0].gradeEnd,
            semester: info.pageInfo[0].semester,
            subject: info.pageInfo[0].subject,
            goal: info.pageInfo[0].goal,
            introduction: info.pageInfo[0].introduction,
            warmup: info.pageInfo[0].warmup,
            mainActivity: info.pageInfo[0].mainActivity,
            backupActivity: info.pageInfo[0].backupActivity,
            additionalGame: info.pageInfo[0].additionalGame,
            reflection: info.pageInfo[0].reflection,
            // inProgress:info.unpublished,
            // published:info.published,
            // isAdmin:true//(info.isAdmin === 1) ? true : false
          });
          console.log("allInfo: " + info.pageInfo[0])
        });
    }
    // console.log(this.state.item);
    render(){
      return(
      <div className="publishedPageContainer">
        <h1>{this.state.lessonName}</h1>
        <div className="publishedPageHeaderContainer">
          <div className="publishedPageTopInformation">
          <p><span id="changeFont">Theme: </span>{this.state.theme}</p>
          <p><span id="changeFont">Unit: </span> {this.state.unit}</p>
          <p><span id="changeFont">Subunit: </span> {this.state.subunit}</p>
          </div>
          <p><span id="changeFont">Date of Lesson: </span>{this.state.month + ' ' + this.state.year}</p>
          <p><span id="changeFont">Day: </span>{this.state.day}</p>
          <p><span id="changeFont">Grades: </span>{this.state.gradeStart + ' - ' + this.state.gradeEnd}</p>
          <p><span id="changeFont">Semester: </span>{this.state.semester}</p>
          <p><span id="changeFont">Subject: </span>{this.state.subject}</p>
          </div>
        <div className="pubishedPageBodyContainer">
          <h2>Goals of the Day: </h2>
          <p>{this.state.goal}</p>
          <h2>Introduction: </h2>
          <p>{this.state.introduction}</p>
          <h2>Warm Up: </h2>
          <p>{this.state.warmup}</p>
          <h2>Main Activity: </h2>
          <p>{this.state.mainActivity}</p>
          <h2>Backup Activity: </h2>
          <p>{this.state.backupActivity}</p>
          <h2>Additional Game: </h2>
          <p>{this.state.additionalGame}</p>
          <h2>Reflection: </h2>
          <p>{this.state.reflection}</p>
        </div>
        {/* <p>{this.state.item.subject}</p>
        <p>{this.state.item.theme}</p>
         */}
      </div>
    );
    }
}
export default PublishedPage;
