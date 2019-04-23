import React, { Component } from 'react';
import { Button, Checkbox } from 'react-bootstrap';
import Dropdown from './Dropdown';
import PageOption from './PageOption'
import { DropdownMenu, MenuItem, DropdownToggle } from './Dropdown'
import '@trendmicro/react-buttons/dist/react-buttons.css';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import './style/style.css';


class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      session: "",
      started: false, // So no results doesn't show up until there is actually a search made

      results:[], // array of page options that are recieved from the db

      searchValue: "", // saving the search input
      semester:"None", // saving semester input
      day: "None", //saving day input
      grade: "None", // saving grade input
      subject: "None",
      year: "",
      month: "",
      gradeStart: "",
      gradeEnd:"",
      theme: "",
      unit: ""
    }
  }
  componentDidMount() {
    this.setUp();
  }

  setUp = () => {
    this.setState({session:this.props.session})
  }

  searchStuff = () => {
    const year = "";
    const month = "";
    const gradeStart = "";
    const gradeEnd = "";
    const theme = "";
    const unit = "";

    const body_str = JSON.stringify({
      year: year,
      month: month,
      gradeStart: gradeStart,
      gradeEnd: gradeEnd,
      theme: theme,
      unit: unit
    });

    const data = JSON.stringify({
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: body_str
    });

    const session = this.state.session;
    const uri = 'http://localhost:8080/' + session + '/search'

    fetch(uri, data)
      .then(res => res.json())
      .then(info => {
        console.log(info)
      });
  }

  /*
   * Alphabetical by default
   */

  handleSearchValue(event) {
    this.setState({searchValue: event.target.value});
  }

  handleSearch(event) {
    this.searchStuff();
  }

  handleSelected(event) {

  }

  selected(type, value, event) {
    console.log(type)
    if (type === "semester") {
      this.setState({started:true,semester:value})
      console.log(type)
      console.log(value)
    } if (type === "day") {
      this.setState({started:true, day: value})
      console.log(type)
      console.log(value)
    } if (type ==="grade") {
      this.setState({started:true, grade: value})
      console.log(type)
      console.log(value)
    } if(type === "subject"){
      this.setState({started:true, subject: value})
      console.log(type)
      console.log(value)
    }

  }

  render () {
    return (
      <div className="searchContainer">
        {/* <h2>Hello</h2> */}
        <div className="searchOptionsContainer">

          <div className="searchBarContainer">
            <input id="searchBar" type="text" placeholder="Search ... " onChange={this.handleSearchValue.bind(this)} />
            <Button className = "searchButton" variant="outline-primary" onClick={this.handleSearch.bind(this)}>Search</Button>
          </div>
          <h3>Filter By</h3>
          <div className="allDropDownContainer">
            <div>
            <label>Semester: </label>
            <Dropdown className="dropDownContainer">
              <DropdownToggle btnStyle="flat">{this.state.semester}</DropdownToggle>
              <DropdownMenu className="ddMenu">
                <MenuItem onClick={this.selected.bind(this, "semester", "Fall 2018")}>Fall 2018</MenuItem>
                <MenuItem divider></MenuItem>
                <MenuItem onClick={this.selected.bind(this, "semester", "Spring 2018")}>Spring 2018</MenuItem>
                <MenuItem divider></MenuItem>
                <MenuItem onClick={this.selected.bind(this, "semester", "Fall 2019")}>Fall 2019</MenuItem>
                <MenuItem divider></MenuItem>
                <MenuItem onClick={this.selected.bind(this, "semester", "Spring 2019")}>Spring 2019</MenuItem>
                <MenuItem divider></MenuItem>
                <MenuItem onClick={this.selected.bind(this, "semester", "None")}>None</MenuItem>
              </DropdownMenu>
            </Dropdown>
            </div>
            <div>
            <label>Day: </label>
            <Dropdown className="dropDownContainer">
              <DropdownToggle btnStyle="flat">{this.state.day}</DropdownToggle>
              <DropdownMenu className="ddMenu">
                <MenuItem onClick={this.selected.bind(this, "day", "Monday")}>Monday</MenuItem>
                <MenuItem divider></MenuItem>
                <MenuItem onClick={this.selected.bind(this, "day", "Tuesday")}>Tuesday</MenuItem>
                <MenuItem divider></MenuItem>
                <MenuItem onClick={this.selected.bind(this, "day", "Wednesday")}>Wednesday</MenuItem>
                <MenuItem divider></MenuItem>
                <MenuItem onClick={this.selected.bind(this, "day", "Thursday")}>Thursday</MenuItem>
                <MenuItem divider></MenuItem>
                <MenuItem onClick={this.selected.bind(this, "day", "Friday")}>Friday</MenuItem>
                <MenuItem divider></MenuItem>
                <MenuItem onClick={this.selected.bind(this, "day", "None")}>None</MenuItem>
              </DropdownMenu>
            </Dropdown>
            </div>
            <div>
            <label>Grade: </label>
            <Dropdown className="dropDownContainer">
              <DropdownToggle btnStyle="flat">{this.state.grade}</DropdownToggle>
              <DropdownMenu className="ddMenu">
                <MenuItem onClick={this.selected.bind(this, "grade", "K")}>K</MenuItem>
                <MenuItem divider></MenuItem>
                <MenuItem onClick={this.selected.bind(this, "grade", "1")}>1</MenuItem>
                <MenuItem divider></MenuItem>
                <MenuItem onClick={this.selected.bind(this, "grade", "2")}>2</MenuItem>
                <MenuItem divider></MenuItem>
                <MenuItem onClick={this.selected.bind(this, "grade", "3")}>3</MenuItem>
                <MenuItem divider></MenuItem>
                <MenuItem onClick={this.selected.bind(this, "grade", "4")}>4</MenuItem>
                <MenuItem divider></MenuItem>
                <MenuItem onClick={this.selected.bind(this, "grade", "5")}>5</MenuItem>
                <MenuItem divider></MenuItem>
                <MenuItem onClick={this.selected.bind(this, "grade", "None")}>None</MenuItem>
              </DropdownMenu>
            </Dropdown>
            </div>
            <div>
            <label>Subject: </label>
            <Dropdown className="dropDownContainer">
              <DropdownToggle btnStyle="flat">{this.state.subject}</DropdownToggle>
              <DropdownMenu className="ddMenu">
                <MenuItem onClick={this.selected.bind(this, "subject", "Math")}>Math</MenuItem>
                <MenuItem divider></MenuItem>
                <MenuItem onClick={this.selected.bind(this, "subject", "Science")}>Science</MenuItem>
                <MenuItem divider></MenuItem>
                <MenuItem onClick={this.selected.bind(this, "subject", "English")}>English</MenuItem>
                <MenuItem divider></MenuItem>
                <MenuItem onClick={this.selected.bind(this, "subject", "Social Studies")}>Social Studies</MenuItem>
                <MenuItem divider></MenuItem>
                <MenuItem onClick={this.selected.bind(this, "subject", "None")}>None</MenuItem>

              </DropdownMenu>
            </Dropdown>
            </div>
          </div>






          <div className="resultsContainer">
            <h1>Results</h1><hr></hr>
            {
              this.state.started ?
                (
                  this.state.results.length ?
                    (
                      this.state.results.map(item =>
                        <PageOption key={item.lesson_id} item={item}/>
                      )
                    ) : (
                      <h3>No results found</h3>
                    )
                ) : null
            }
          </div>


        </div>
      </div>
    )
  }
}

export default Search;
