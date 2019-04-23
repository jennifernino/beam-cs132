import React, { Component } from 'react';
import './style/style.css';

class PageOption extends Component {

  constructor(props) {
    super(props);
    this.state = {
      type:"",
      color: "",
      reflection: ""
    }
  }

  componentDidMount() {
    console.log(this.props.item); // information to work on
    if(this.props.item.published){
      this.setState({color: "green", type:"Published", reflection: this.props.item.reflection});
      //missing lesson name from the server ..
      // add lessonName: this.props.item.lessonName to state when added
    } else {
      this.setState({color: "red", type:"Not Published", reflection: this.props.item.reflection});
      //missing lesson name from the server ..
      // add lessonName: this.props.item.lessonName to state when added
    }
    // when opening?
  }

  render() {
    return (
      <div className="pageOptionContainer">
        <div className="pageHeaderContainer">
          <div className="leftPageHeaderContainer">
            <p>Title</p>
          </div>
          <div className="rightPageHeaderContainer">
            <p style={{color: this.state.color}} >{this.state.type}</p>
          </div>
        </div>
        <div className="pageSummaryContainer">
          <p>{this.state.reflection}</p>
        </div>
      </div>
    );
  }
}

export default PageOption;
