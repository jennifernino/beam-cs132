import React, { Component } from 'react';
import PageOption from './PageOption'
import './style/style.css';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: 'Bob',
      session: '',
      inProgress:[],
      published:[]
    }
  }

  componentDidMount() {
    this.homeSetUp()
  }

  homeSetUp = () => {
    const session = this.props.session;
    const uri = 'http://localhost:8080/' + session + '/home'
    fetch(uri)
      .then(res => res.json())
      .then(info => {
        this.setState({
          inProgress:info.unpublished,
          published:info.published
        })
        console.log(info)
      });
  }

  render() {
    return (
      <div className="homeContainer">
        <h1>Welcome {this.state.username}!</h1>
        <div className="inProgressContainer">
          <h2>In Progress</h2>
          <div className="optionContainer">
            {this.state.inProgress.map((index, item) => {
                <PageOption key={item.lesson_id} item={item} />
              }
            )}
          </div>
        </div>
        <div className="publishedContainer">
          <div className="publishedHeaderContainer">
            <div className="leftSideContainer">
              <h2>Published</h2>
            </div>
            <div className="rightSideContainer">
              <button>add reflection</button>
            </div>
          </div>
          <div className="optionContainer">
            {this.state.published.map(item =>
              <PageOption key={item.lesson_id} item={item} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
