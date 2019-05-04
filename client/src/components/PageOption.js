import React, { Component } from 'react';
import './style/style.css';
import { Link } from "react-router-dom";
import PublishedPage from './PublishedPage';

class PageOption extends Component {

  constructor(props) {
    super(props);
    this.state = {
      type:"",
      color: "",
      lessonName: "",
      reflection: "",
      date: ""
    }
  }

  componentDidMount() {
    console.log(this.props.item); // information to work on
    if(this.props.item.published){
      var date = new Date(this.props.item.datePublished);
      var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      var month = months[date.getMonth()];
      var day = date.getDate().toString();
      var year = date.getFullYear().toString();
      var full_date = month + " " + day + " " + year;
     this.setState({color: "green", type:"Published", lessonName: this.props.item.lessonName, reflection: this.props.item.reflection, date: full_date});
   } else {
     this.setState({color: "red", type:"Not Published", lessonName: this.props.item.lessonName, reflection: this.props.item.reflection});
   }
    // when opening?
  }

  render() {
    return (
      <div className="outerPageOptionContainer">
      <Link className="link" to={'/viewpage/' + this.props.item.lesson_id}>
      <div className="pageOptionContainer">
        <div className="pageHeaderContainer">
          <div className="leftPageHeaderContainer">
            <p id="changeFont">{this.state.lessonName}</p>
            <p id="dateFont">{this.state.date}</p>
          </div>
          <div className="rightPageHeaderContainer">
            <p style={{color: this.state.color}} >{this.state.type}</p>
          </div>
        </div>
        <div className="pageSummaryContainer">
          <p>{this.state.reflection}</p>
        </div>
      </div>
    </Link>
    <button className="addButton">Add Reflection</button>
  </div>
    );
  }
}

export default PageOption;
