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
      unit: "",

      monthOfLesson: "None",
      dayOfLesson: "None",
      yearOfLesson: "None"

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
    } if(type === "monthOfLesson"){
      this.setState({started:true, monthOfLesson: value})
    } if(type === "dayOfLesson"){
      this.setState({started:true, dayOfLesson: value})
    } if(type === "yearOfLesson"){
      this.setState({started:true, yearOfLesson: value})
    }

  }

  render () {
    return (
      <div className="searchContainer">
        <h1>Search</h1><hr></hr>
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
                {/* <MenuItem divider></MenuItem> */}
                <MenuItem onClick={this.selected.bind(this, "semester", "Spring 2018")}>Spring 2018</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "semester", "Fall 2019")}>Fall 2019</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "semester", "Spring 2019")}>Spring 2019</MenuItem>
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
                {/* <MenuItem divider></MenuItem> */}
                <MenuItem onClick={this.selected.bind(this, "day", "Tuesday")}>Tuesday</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "day", "Wednesday")}>Wednesday</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "day", "Thursday")}>Thursday</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "day", "Friday")}>Friday</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "day", "None")}>None</MenuItem>
              </DropdownMenu>
            </Dropdown>
            </div>
            <div>
            <label>Date: </label>
            <Dropdown className="dropDownContainer">
              <DropdownToggle btnStyle="flat">{this.state.monthOfLesson}</DropdownToggle>
              <DropdownMenu>
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
                <MenuItem onClick={this.selected.bind(this, "monthOfLesson", "None")}>None</MenuItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown className="dropDownContainer">
              <DropdownToggle btnStyle="flat">{this.state.dayOfLesson}</DropdownToggle>
              <DropdownMenu>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "1")}>1</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "2")}>2</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "3")}>3</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "4")}>4</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "5")}>5</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "6")}>6</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "7")}>7</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "8")}>8</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "9")}>9</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "10")}>10</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "11")}>11</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "12")}>12</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "13")}>13</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "14")}>14</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "15")}>15</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "16")}>16</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "17")}>17</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "18")}>18</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "19")}>19</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "20")}>20</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "21")}>21</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "22")}>22</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "23")}>23</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "24")}>24</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "25")}>25</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "26")}>26</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "27")}>27</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "28")}>28</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "29")}>29</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "30")}>30</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "31")}>31</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "dayOfLesson", "None")}>None</MenuItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown className="dropDownContainer">
              <DropdownToggle btnStyle="flat">{this.state.yearOfLesson}</DropdownToggle>
              <DropdownMenu>
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
                <MenuItem onClick={this.selected.bind(this, "yearOfLesson", "None")}>None</MenuItem>
              </DropdownMenu>
            </Dropdown>
          </div>
            <div>
            <label>Grade: </label>
            <Dropdown className="dropDownContainer">
              <DropdownToggle btnStyle="flat">{this.state.grade}</DropdownToggle>
              <DropdownMenu className="ddMenu">
                <MenuItem onClick={this.selected.bind(this, "grade", "K")}>K</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "grade", "1")}>1</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "grade", "2")}>2</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "grade", "3")}>3</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "grade", "4")}>4</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "grade", "5")}>5</MenuItem>
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
                <MenuItem onClick={this.selected.bind(this, "subject", "Science")}>Science</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "subject", "English")}>English</MenuItem>
                <MenuItem onClick={this.selected.bind(this, "subject", "Social Studies")}>Social Studies</MenuItem>
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
