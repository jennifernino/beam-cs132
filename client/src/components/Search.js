import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
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
      started: false, // So no results doesn't show up until there is actually a search made
      results:[], // array of page options that are recieved from the db
      searchValue: "", // saving the search input
      semester:"None" // saving semester input
    }

  }

  /*
   * Alphabetical by default
   */

  handleSearchValue(event) {
    this.setState({searchValue: event.target.value});
    console.log(this.state.searchValue);
  }

  handleSearch(event) {
    console.log("Clicked the search button")
    console.log(this.state.searchValue)
  }

  handleSelected(event) {

  }

  selected(type, value, event) {
    console.log(type)
    if (type === "semester") {
      this.setState({started:true,semester:value})
      console.log(type)
      console.log(value)
    }

  }

  render () {
    return (
      <div className="searchContainer">
        <h2>Hello</h2>
        <div className="searchOptionsContainer">

          <div className="searchBarContainer">
            <input id="searchBar" type="text" placeholder="Search ... " onChange={this.handleSearchValue.bind(this)} />
            <Button variant="outline-primary" btnStyle="flat" onClick={this.handleSearch.bind(this)}>Search</Button>
          </div>

          <div className="allDropDownContainer">
            <Dropdown className="dropDownContainer">
              <DropdownToggle btnStyle="flat">{this.state.semester}</DropdownToggle>
              <DropdownMenu>
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


          <div className="resultsContainer">
            {
              this.state.started ?
                (
                  this.state.results.length ?
                    (
                      this.state.results.map(item =>
                        <PageOption key="TODO insert here" item={item}/>
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
