import React, { Component } from 'react';
import './style/style.css';

class PublishedPage extends Component {

    constructor(props) {
      super(props);
      // this.state = {
        // type:"",
        // color: "",
        // lessonName: "",
        // reflection: ""
      // }
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
          // this.setState({
            // inProgress:info.unpublished,
            // published:info.published,
            // isAdmin:true//(info.isAdmin === 1) ? true : false
          // })
          console.log('month' + info)
        });
    }
    // console.log(this.state.item);
    render(){
      return(
      <div className="publishedPageContainer">
        {/* <p>{this.props.item.lessonName}</p>  */}
        {/* <p>{this.state.item.subject}</p>
        <p>{this.state.item.theme}</p>
        <p>{this.state.item.reflection}</p> */}
      </div>
    );
    }
}
export default PublishedPage;
