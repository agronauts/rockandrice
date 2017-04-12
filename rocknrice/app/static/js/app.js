let React = require('react');
let ReactDOM = require('react-dom');
let $ = require('jquery');
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

let SearchForm = React.createClass({
    searchChange: function(event) {
        this.props.onSearchRequest(event.target.value);
    },
    render: function () {
        return (
            <div>
                <div className="form">
                    <div>
                        <label>Name:</label>
                        <input type="text" onChange={this.searchChange}/>
                    </div>
                </div>
            </div>
        );
    }
});


let CragList = React.createClass({
    render: function () {
        let crags = this.props.data.map(function (crag) {
            return (
                <tr>
                    <td>{crag.name}</td>
                    <td>{crag.description.substring(0,30)}</td>
                </tr>
            );
        });
        return (
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
                </thead>
                <tbody>{crags}</tbody>
            </table>
        )
    }
});
let ClimbList = React.createClass({
    render: function () {
        let climbs = this.props.data.map(function (climb) {
            return (
                <tr>
                    <td>{climb.name}</td>
                    <td>{climb.description.substring(0,30)}</td>
                </tr>
            );
        });
        return (
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
                </thead>
                <tbody>{climbs}</tbody>
            </table>
        )
    }
});

let ClimbSearch = React.createClass({
    getInitialState: function () {
        return {
            all_climbs: [],
            cur_climb: []
        }
    },
    componentDidMount: function() {
        $.ajax({
            url: '../static/climbs.json',
            dataType: 'json',
            success: function(data) {
                this.setState({all_climbs: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    filterClimbs: function (query) {
        let filtered_climbs = this.state.all_climbs.filter(function (climb) {
            return climb.name.toLowerCase().includes(query);
        });
        this.setState({cur_climb: filtered_climbs});
    },
    render: function () {
        return (
            <div>
                <h2>Climb Search</h2>
                <SearchForm onSearchRequest={this.filterClimbs}/>
                <ClimbList data={this.state.cur_climb}/>
            </div>
        );
    }
});
let CragSearch = React.createClass({
    getInitialState: function () {
       return {
           all_crags: [],
           cur_crags: []
       }
    },
    componentDidMount: function() {
        $.ajax({
            url: '../static/crags.json',
            dataType: 'json',
            success: function(data) {
                this.setState({all_crags: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    filterCrags: function (query) {
        let filtered_crags = this.state.all_crags.filter(function (crag) {
            return crag.name.toLowerCase().includes(query);
        });
        this.setState({cur_crags: filtered_crags});
    },
    render: function () {
        return (
            <div>
                <p>Crag Search</p>
                <SearchForm onSearchRequest={this.filterCrags}/>
                <ClimbList data={this.state.cur_crags}/>
            </div>
        );
    }
});


let App = React.createClass({
    render: function () {
        return (
            <Tabs selectedIndex={0}>
                <TabList>
                  <Tab>Crags</Tab>
                  <Tab>Climbs</Tab>
                </TabList>
                <TabPanel>
                  <CragSearch/>
                </TabPanel>
                <TabPanel>
                  <ClimbSearch/>
                </TabPanel>
            </Tabs>
    );
  }
});

ReactDOM.render(<App/>,  document.getElementById("app"));
