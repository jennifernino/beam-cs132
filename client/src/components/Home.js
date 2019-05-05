import React, { Component } from 'react';
import { Link } from "react-router-dom";
import PageOption from './PageOption'
import EditOption from './EditOption'
import './style/style.css';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: localStorage.getItem('name'),
      isAdmin:0,
      session: '',
      inProgress:[],
      published:[]
    }
  }

  componentDidMount() {
    this.homeSetUp()
  }

  homeSetUp = () => {
    const name = localStorage.getItem('name');
    const session = localStorage.getItem('session');
  
    const uri = 'http://localhost:8080/' + session + '/home'
    fetch(uri)
      .then(res => res.json())
      .then(info => {
        this.setState({
          inProgress:info.unpublished,
          published:info.published,
          isAdmin:info.isAdmin
        })
        console.log(info.isAdmin)
      });
  }




  render() {
    return (
      <div className="homeContainer">
        <h1>Welcome {this.state.username}!</h1>
        {this.state.isAdmin ?
          (
            <Link to={'/admin'}>
                <button className="adminButton">Admin</button>
            </Link>
          ):(
            null
          )}
        <div className="inProgressContainer">
          <h2>In Progress</h2>
          <div className="optionContainer">
            {!this.state.inProgress.length ? (
                <p>No lessons in progress found!</p>
              ):(
                this.state.inProgress.map(item =>
                  <EditOption key={item.lesson_id} item={item} />
                )
              )
            }
          </div>
        </div>
        <div className="publishedContainer">
          <div className="publishedHeaderContainer">
            <div className="leftSideContainer">
              <h2>Published</h2>
            </div>
          </div>
          <div className="optionContainer">
            {!this.state.published.length ? (
                <p>No published lessons in progress found!</p>
              ):(
                this.state.published.map(item =>
                  <PageOption key={item.lesson_id} item={item} />
                )
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
