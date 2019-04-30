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
      reflection: ""
    }
  }

  componentDidMount() {
    console.log(this.props.item); // information to work on
    if(this.props.item.published){
     this.setState({color: "green", type:"Published", lessonName: this.props.item.lessonName, reflection: this.props.item.reflection});
   } else {
     this.setState({color: "red", type:"Not Published", lessonName: this.props.item.lessonName, reflection: this.props.item.reflection});
   }
    // when opening?
  }

  render() {
    return (
      <Link to={'/viewpage/' + this.props.item.lesson_id}>
      <div className="pageOptionContainer">
        <div className="pageHeaderContainer">
          <div className="leftPageHeaderContainer">
            <p>{this.state.lessonName}</p>
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
    );
  }
}

export default PageOption;
