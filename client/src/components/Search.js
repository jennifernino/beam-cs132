import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Dropdown from './Dropdown';
import PageOption from './PageOption';
import PublishedOption from './PublishedOption';
import { DropdownMenu, MenuItem, DropdownToggle } from './Dropdown';
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

      monthOfLesson:"Month",
      yearOfLesson:"Year",

      subject:"Subject",
      gradeStart: "Grade Start",
      gradeEnd:"Grade End",
      semester:"Semester",
      dayOfWeek:"Weekday",

      sort:"None",


      error:false,
      errorMessage:""
    }
  }
  componentDidMount() {
    this.setUp();
  }

  setUp = () => {
    this.setState({session:localStorage.getItem('session')})
  }

  cleanStr(str) {
    if (typeof str === 'undefined' || str === null) {
      return "";
    }
    return str.toString().replace(/[^\x00-\x7F]/g, "").trim();
  }

  cleanStrFilter(str) {
    if (typeof str === 'undefined' || str === null || str === "Month"
        || str === "Year" || str === "Subject" || str === "Grade Start"
        || str === "Grade End" || str === "Semester" || str === "Weekday") {
      return "";
    }
    return str.toString().replace(/[^\x00-\x7F]/g, "").trim();

  }

  validate(str) {
    return (typeof str === "undefined" || str === "");
  }

  searchStuff = () => {
    let filters = false;

    const text = this.cleanStr(this.state.searchValue);
    const semester = this.cleanStrFilter(this.state.semester);
    const weekday = this.cleanStrFilter(this.state.dayOfWeek);
    const month = this.cleanStrFilter(this.state.monthOfLesson);
    const year = this.cleanStrFilter(this.state.yearOfLesson);
    const gStart = this.cleanStrFilter(this.state.gradeStart);
    const gEnd = this.cleanStrFilter(this.state.gradeEnd);
    const subject = this.cleanStrFilter(this.state.subject);

    // true if empty and false if has something
    const checkFilters = (this.validate(semester) &&
      this.validate(weekday) && this.validate(month) &&
      this.validate(year) && this.validate(gStart) &&
      this.validate(gEnd) && this.validate(subject));

    // true if everything empty and false if something
    if (checkFilters && this.validate(text)) {
      console.log("error");
      return;
    }

    const body_str = JSON.stringify({
      hasResponse: !checkFilters, // true if has filters, false if not
      textSearch: text,
      semester: semester,
      weekday: weekday,
      month: month,
      year: year,
      gradeStart: gStart,
      gradeEnd: gEnd,
      subject: subject
    });

    const req = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: body_str
    }

    const session = localStorage.getItem('session');
    const uri = 'http://localhost:8080/' + session + '/search'

    fetch(uri, req)
      .then(res => res.json())
      .then(info => {
        console.log(info)
        this.setState({
          results:info,
          started: true
        })
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

  sortedResults(){
    var sortedResult;
    if (this.state.sort === "New to Old"){
      sortedResult  = this.state.results.sort(function(a, b){return b.datePublished - a.datePublished})
    }
    if (this.state.sort === "Old to New"){
      sortedResult = this.state.results.sort(function(a,b){return a.datePublished - b.datePublished})
    }
    if (this.state.sort === "Alphabetical"){
      sortedResult = this.state.results.sort(function(a, b) {
        return a.lessonName.localeCompare(b.lessonName);
      });
    }
    else{
      sortedResult = this.state.results;
    }
    return sortedResult
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

  render () {
    return (
      <div className="searchContainer">
        <h1>Search</h1>
        <div className="searchOptionsContainer">

          <div className="searchBarContainer">
            <input id="searchBar" type="text" placeholder="Search ... " onChange={this.handleSearchValue.bind(this)} />
            <Button className = "searchButton" variant="outline-primary" onClick={this.handleSearch.bind(this)}>Search</Button>
          </div>
          <h3>Filter By</h3>
          <div className="allDropDownContainer">
            <div>
              {/* <label>Semester: </label> */}
            <Dropdown className="dropDownContainer">
              <DropdownToggle btnStyle="flat">{this.state.semester}</DropdownToggle>
              <DropdownMenu className="ddMenu">
                <MenuItem onClick={this.selected.bind(this, "semester", "Semester")}>Semester</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "semester", "Fall 2018")}>Fall 2018</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "semester", "Spring 2018")}>Spring 2018</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "semester", "Fall 2019")}>Fall 2019</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "semester", "Spring 2019")}>Spring 2019</MenuItem>
              </DropdownMenu>
            </Dropdown>
            </div>
            <div>
            {/* <label>Day: </label> */}
            <Dropdown className="dropDownContainer">
              <DropdownToggle btnStyle="flat">{this.state.dayOfWeek}</DropdownToggle>
              <DropdownMenu className="ddMenu">
                <MenuItem onClick={this.selected.bind(this, "dayOfWeek", "Weekday")}>Weekday</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfWeek", "Monday")}>Monday</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfWeek", "Tuesday")}>Tuesday</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfWeek", "Wednesday")}>Wednesday</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfWeek", "Thursday")}>Thursday</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfWeek", "Friday")}>Friday</MenuItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div>
          {/* <label>Date: </label> */}
          <Dropdown className="dropDownContainer">
            <DropdownToggle btnStyle="flat">{this.state.monthOfLesson}</DropdownToggle>
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
          </Dropdown>
          <Dropdown className="dropDownContainer">
            <DropdownToggle btnStyle="flat">{this.state.yearOfLesson}</DropdownToggle>
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
          </Dropdown>
        </div>
        <div>
        {/* <label>Grade Start: </label> */}
        <Dropdown className="dropDownContainer">
          <DropdownToggle btnStyle="flat">{this.state.gradeStart}</DropdownToggle>
          <DropdownMenu className="ddMenu">
            <MenuItem onClick={this.selected.bind(this, "gradeStart", "Grade Start")}>Grade Start</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeStart", "K")}>K</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeStart", "1")}>1</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeStart", "2")}>2</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeStart", "3")}>3</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeStart", "4")}>4</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeStart", "5")}>5</MenuItem>
          </DropdownMenu>
        </Dropdown>
        </div>
        <div>
        {/* <label>Grade End: </label> */}
        <Dropdown className="dropDownContainer">
          <DropdownToggle btnStyle="flat">{this.state.gradeEnd}</DropdownToggle>
          <DropdownMenu className="ddMenu">
            <MenuItem onClick={this.selected.bind(this, "gradeEnd", "Grade End")}>Grade End</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeEnd", "K")}>K</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeEnd", "1")}>1</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeEnd", "2")}>2</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeEnd", "3")}>3</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeEnd", "4")}>4</MenuItem>
            <MenuItem onClick={this.selected.bind(this, "gradeEnd", "5")}>5</MenuItem>
          </DropdownMenu>
        </Dropdown>
        </div>
          <div>
            {/* <label>Subject: </label> */}
            <Dropdown className="dropDownContainer">
              <DropdownToggle btnStyle="flat">{this.state.subject}</DropdownToggle>
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
            </Dropdown>
            </div>
          </div>

          <h3> Sort by </h3>
          <div className="sortContainer">

            <div>
              {/* <label>Semester: </label> */}
            <Dropdown className="dropDownContainer">
              <DropdownToggle btnStyle="flat">{this.state.sort}</DropdownToggle>
              <DropdownMenu className="ddMenu">
                <MenuItem onClick={() => this.setState({sort:"None"})}>None</MenuItem>
                <MenuItem onClick={() => this.setState({sort:"New to Old"})}>New to Old</MenuItem>
                <MenuItem onClick={() => this.setState({sort:"Old to New"})}>Old to New</MenuItem>
                <MenuItem onClick={() => this.setState({sort:"Alphabetical"})}>Alphabetical</MenuItem>
              </DropdownMenu>
            </Dropdown>
            </div>
            </div>




          <div className="resultsContainer">
            <h1>Results</h1>
            {
              this.state.started ?
                (
                  this.state.results.length ?
                    (
                      this.sortedResults().map(item =>
                        <PublishedOption key={item.lesson_id} item={item}/>
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
