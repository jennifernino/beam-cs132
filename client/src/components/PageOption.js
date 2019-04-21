import React, { Component } from 'react';
import './style/style.css';

class PageOption extends Component {

  constructor(props) {
    super(props);
    this.state = {
      type:"Not published"
    }
  }

  componentDidMount() {
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
            <p>{this.state.type}</p>
          </div>
        </div>
        <div className="pageSummaryContainer">
          <p>Summary</p>
        </div>
      </div>
    );
  }
}

export default PageOption;
